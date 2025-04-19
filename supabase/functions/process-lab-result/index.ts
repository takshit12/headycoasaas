import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.47.1';

// Import pdfjs-serverless
import { resolvePDFJS } from "https://esm.sh/pdfjs-serverless@0.4.2";

console.log("Initializing process-lab-result function...")

// Ensure required environment variables are available
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("CUSTOM_SERVICE_ROLE_KEY");

if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing required environment variables (OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)");
  // Optionally throw an error or handle appropriately
}

// Initialize OpenAI Client
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Helper function to update DB status using Admin client
async function updateLabResultStatus(
  supabaseAdmin: SupabaseClient,
  recordId: number | string,
  status: 'processing' | 'completed' | 'error',
  details?: string | null,
  description?: string | null
) {
  console.log(`Updating record ${recordId} status to ${status}...`);
  const updateData: { status: string; error_details?: string | null; description?: string | null } = { status };
  if (details) updateData.error_details = details;
  if (description) updateData.description = description;

  const { error: updateError } = await supabaseAdmin
    .from('lab_results') // Ensure this matches your table name
    .update(updateData)
    .eq('id', recordId);

  if (updateError) {
    console.error(`Failed to update lab_result ${recordId} status to ${status}:`, updateError.message);
    // Consider further error handling/logging here
  } else {
     console.log(`Successfully updated lab_result ${recordId} status to ${status}`);
  }
}

serve(async (req: Request) => {
  let recordId: number | string | null = null; // Track record ID for error logging
  let supabaseAdmin: SupabaseClient | null = null; // Define admin client in outer scope

  try {
    // 1. Check Method and Content-Type
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }
    if (req.headers.get("content-type") !== "application/json") {
       return new Response(JSON.stringify({ error: "Request must be JSON"}), { status: 400, headers: { "Content-Type": "application/json" }});
    }

    // 2. Get PDF storage path and record ID from request body
    const { pdfStoragePath, labResultId } = await req.json();
    if (!pdfStoragePath || !labResultId) {
      throw new Error("Missing pdfStoragePath or labResultId in request body");
    }
    recordId = labResultId;
    console.log(`Processing PDF for record ID: ${recordId}, path: ${pdfStoragePath}`);

    // 3. Initialize Supabase Admin Client (use Service Role Key)
    supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!); // Use non-null assertion after check

    // 4. Download PDF from Supabase Storage
    console.log("Downloading PDF from storage...");
    // Corrected bucket name
    const { data: pdfBlob, error: downloadError } = await supabaseAdmin.storage
      .from('labresults') 
      .download(pdfStoragePath);

    if (downloadError) throw new Error(`Storage download failed: ${downloadError.message}`);
    if (!pdfBlob) throw new Error("Downloaded PDF blob is empty");
    console.log(`Downloaded PDF size: ${pdfBlob.size} bytes`);

    // 5. Update status to 'processing' *before* heavy work
    await updateLabResultStatus(supabaseAdmin, recordId!, 'processing');

    // 6. Parse PDF Text using pdfjs-serverless
    console.log("Parsing PDF text with pdfjs-serverless...");
    const pdfBuffer = new Uint8Array(await pdfBlob.arrayBuffer());
    let extractedText = '';
    
    try {
        const { getDocument } = await resolvePDFJS();
        const doc = await getDocument({ data: pdfBuffer }).promise;
        
        for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' '); // Added :any type hint for item
            extractedText += pageText + '\n';
        }
        extractedText = extractedText.trim();
        console.log(`Extracted text length (pdfjs-serverless): ${extractedText.length} for record ${recordId}`);

    } catch (pdfParseError: any) { // Added :any type hint
        console.error(`pdfjs-serverless parsing error for record ${recordId}:`, pdfParseError);
        throw new Error(`Failed to parse PDF content with pdfjs-serverless: ${pdfParseError.message}`);
    }

    if (!extractedText || extractedText.trim().length === 0) {
      console.warn(`Failed to extract text or PDF empty for record ${recordId}`);
      throw new Error("Failed to extract text from PDF or PDF appears empty.");
    }

    // 7. Call OpenAI API
    console.log(`Calling OpenAI for record ${recordId}...`);
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert copywriter specializing in the cannabis industry. Analyze the provided lab results text and generate a compelling, concise, and compliant product description suitable for a retailer's website or product listing. Focus *only* on key data points present in the text like cannabinoids (THC, CBD percentages), terpenes, and overall product profile. Keep the description brief, informative, and engaging." },
        { role: "user", content: `Analyze the following lab results text and generate a product description:\n\n---\n${extractedText}\n---"` }
      ],
      model: "gpt-4o",
      max_tokens: 300, // Limit output length
      temperature: 0.7, // Adjust creativity
    });

    const generatedDescription = chatCompletion.choices[0]?.message?.content?.trim();
    if (!generatedDescription) {
      throw new Error("Failed to generate description from OpenAI (Empty response)");
    }
    console.log(`Generated Description for record ${recordId}:`, generatedDescription);

    // 8. Update database record to 'completed'
    await updateLabResultStatus(supabaseAdmin, recordId!, 'completed', null, generatedDescription);

    // 9. Return success response
    return new Response(JSON.stringify({ success: true, description: generatedDescription }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`Error processing PDF for record ${recordId ?? 'UNKNOWN'}:`, errorMessage);
    
    // Attempt to update DB status to 'error' if possible
    if (recordId && supabaseAdmin) {
      await updateLabResultStatus(supabaseAdmin, recordId, 'error', errorMessage);
    } else {
        console.error("Could not update error status in DB: Missing recordId or Supabase client.");
    }

    // Return error response
    return new Response(JSON.stringify({ error: `Failed to process PDF: ${errorMessage}` }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500, // Internal Server Error
    });
  }
});

console.log("process-lab-result function initialized and waiting for requests.");

/*
  DEPLOYMENT NOTES:
  - Deploy using Supabase CLI: `supabase functions deploy process-lab-result --no-verify-jwt`
  - Set Secrets in Supabase dashboard:
    - OPENAI_API_KEY
    - CUSTOM_SERVICE_ROLE_KEY
  - Using pdfjs-serverless (via esm.sh) for PDF parsing.
*/ 