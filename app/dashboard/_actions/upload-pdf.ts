'use server';

import { auth } from '@clerk/nextjs/server';
import { createClient as createServerSupabaseClient } from '@/lib/supabase/server'; // Rename the import
import { createClient as createSupabaseClient } from '@supabase/supabase-js'; // Import the standard client
import { PDFDocument } from 'pdf-lib';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// --- Basic Base64 decode helper ---
function decodeJwtPart(part: string): any {
  try {
    // Replace URL-safe characters and add padding if needed
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64 + '==='.slice(0, (4 - base64.length % 4) % 4);
    return JSON.parse(Buffer.from(paddedBase64, 'base64').toString());
  } catch (e) { 
    console.error('Error decoding JWT part:', e);
    return null; 
  }
}
// --- End helper ---

const MAX_SIZE_MB = 1;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const MAX_PAGES = 5;

// Updated return type to reflect only success/error of initiating processing
export async function uploadPdfAction(formData: FormData): Promise<{ success: boolean; error?: string; message?: string }>
{
  const authResult = await auth();
  const userId = authResult?.userId;
  if (!userId) {
    return { success: false, error: 'User not authenticated.' };
  }

  // --- Explicitly get Supabase token using the auth object ---
  // *** IMPORTANT: Replace 'supabase' if your Clerk template has a different name ***
  const supabaseToken = await authResult.getToken({ template: 'supabase' });
  if (!supabaseToken) {
      console.error('Could not retrieve Supabase token from Clerk using the template.');
      return { success: false, error: 'Authentication token issue.' };
  }
  console.log('Retrieved Supabase token from Clerk template.');
  // --- End token fetch ---

  const file = formData.get('pdf') as File | null;

  if (!file) {
    return { success: false, error: 'No file provided.' };
  }

  // Server-side validations
  if (file.type !== 'application/pdf') {
    return { success: false, error: 'Invalid file type. Only PDF is allowed.' };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { success: false, error: `File size exceeds ${MAX_SIZE_MB}MB limit.` };
  }

  // --- Create Supabase client WITH the specific token ---
  // Use environment variables directly, ensure they are set server-side
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase URL or Anon Key environment variables.');
      return { success: false, error: 'Server configuration error.' };
  }

  const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: `Bearer ${supabaseToken}` }, // Pass the token
    },
  });
  console.log('Created Supabase client instance with explicit token.');
  // --- End client creation ---

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  let pageCount: number;

  try {
    // Validate page count
    try {
        const pdfDoc = await PDFDocument.load(fileBuffer);
        pageCount = pdfDoc.getPageCount();
        if (pageCount > MAX_PAGES) {
          return { success: false, error: `PDF exceeds maximum page count of ${MAX_PAGES}.` };
        }
    } catch (pdfError) {
        console.error('PDF Loading Error:', pdfError);
        return { success: false, error: 'Could not process the uploaded file as a valid PDF.' };
    }

    // --- Upload to Supabase Storage (using the new client) ---
    const uniqueFileName = `${userId}/${Date.now()}-${file.name}`;
    console.log(`Attempting upload with uniqueFileName: ${uniqueFileName} using explicit token client.`);
    const { data: storageData, error: uploadError } = await supabase.storage
      .from('labresults')
      .upload(uniqueFileName, fileBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase storage upload error (with explicit token):', uploadError);
      return { success: false, error: 'Failed to upload file to storage.' };
    }
    if (!storageData?.path) {
      console.error('Supabase storage upload error: No path returned');
      return { success: false, error: 'Failed to get file path after storage upload.' };
    }
    const storagePath = storageData.path;
    console.log('File uploaded to storage:', storagePath);

    // --- Insert record into Database (using the new client) ---
    console.log('Inserting record into lab_results table...');
    console.log(`Attempting insert with userId: ${userId} using explicit token client.`);
    const { data: insertData, error: insertError } = await supabase
      .from('lab_results')
      .insert({
        user_id: userId,
        file_name: file.name,
        storage_path: storagePath,
        page_count: pageCount,
        status: 'pending',
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Supabase DB insert error (with explicit token):', insertError);
      return { success: false, error: 'Failed to save file metadata to database.' };
    }
    if (!insertData?.id) {
        console.error('Supabase DB insert error: No ID returned');
        return { success: false, error: 'Failed to get record ID after database insert.' };
    }
    const labResultId = insertData.id;
    console.log(`Record inserted with ID: ${labResultId}`);

    // --- Asynchronously Invoke Edge Function ---
    console.log(`Invoking process-lab-result function for ID: ${labResultId}...`);
    const { error: functionError } = await supabase.functions.invoke('process-lab-result', {
      body: { pdfStoragePath: storagePath, labResultId: labResultId },
    });

    // We only check for errors invoking the function, not its execution result
    if (functionError) {
      console.error('Supabase function invoke error:', functionError);
      // Update DB status to 'error' since processing couldn't start
      await supabase
        .from('lab_results')
        .update({ status: 'error', error_details: 'Failed to invoke processing function.' })
        .eq('id', labResultId);
      return { success: false, error: 'Failed to start the lab result processing.' };
    }

    console.log(`Successfully invoked function for record ${labResultId}`);

    // Revalidate path if needed later
    // revalidatePath('/dashboard'); 

    // Return success to the user immediately
    return { success: true, message: 'PDF uploaded successfully. Processing started.' };

  } catch (error) {
    console.error('Unexpected error in uploadPdfAction (with explicit token):', error);
    return { success: false, error: 'An unexpected server error occurred.' };
  }
} 