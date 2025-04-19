import { createClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';
import { FileText } from 'lucide-react';
import { LabResultsList } from './lab-results-list';

// Type Definition matching the client component's expectation
// (Could be shared in a types file)
type LabResult = {
  id: number;
  created_at: string;
  file_name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  description?: string | null;
  error_details?: string | null;
  user_id: string; // Ensure user_id is included
};

// Server Component: Fetches initial data and renders the client list component
export async function LabResultsDisplay() {
  const authResult = await auth();
  const userId = authResult?.userId;
  console.log('[LabResultsDisplay] userId:', userId);

  if (!userId) {
    console.log('[LabResultsDisplay] User not authenticated.');
    return <p className="text-red-500 text-center">User not authenticated.</p>;
  }

  const supabase = createClient();
  console.log('[LabResultsDisplay] Fetching initial results...');
  const { data: initialResults, error } = await supabase
    .from('lab_results')
    .select('id, created_at, file_name, status, description, error_details, user_id') 
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  console.log('[LabResultsDisplay] Fetched data:', initialResults);
  console.log('[LabResultsDisplay] Fetch error:', error);

  if (error) {
    console.error("Error fetching initial lab results:", error);
    return <p className="text-red-500 text-center">Failed to load initial lab results.</p>;
  }

  const resultsForClient = (initialResults as LabResult[] | null) ?? [];
  console.log('[LabResultsDisplay] Results passed to client:', resultsForClient);

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-semibold font-serif text-brand-dark-green text-center mb-6">
        Recent Lab Results
      </h3>
      <LabResultsList initialResults={resultsForClient} userId={userId} />
    </div>
  );
} 