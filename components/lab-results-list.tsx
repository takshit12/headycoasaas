'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client'; // Use client client
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, Loader2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Type Definition (can be shared or redefined)
type LabResult = {
  id: number;
  created_at: string;
  file_name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  description?: string | null;
  error_details?: string | null;
  user_id: string; // Need user_id for subscription filter
};

// Helper functions (getStatusVariant, StatusIcon) - Keep these as before
// Helper to get status badge variants
const getStatusVariant = (status: LabResult['status']): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'completed': return 'default';
    case 'processing': return 'secondary';
    case 'pending': return 'outline';
    case 'error': return 'destructive';
    default: return 'outline';
  }
};

// Helper to get status icon
const StatusIcon = ({ status }: { status: LabResult['status'] }) => {
  switch (status) {
    case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'processing': return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />;
    case 'pending': return <Clock className="h-4 w-4 text-gray-500" />;
    case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
    default: return null;
  }
};


// Client Component to handle list rendering and realtime updates
export function LabResultsList({ initialResults, userId }: { initialResults: LabResult[], userId: string }) {
  console.log('[LabResultsList] Received initialResults prop:', initialResults);
  console.log('[LabResultsList] Received userId prop:', userId);
  
  const [results, setResults] = useState<LabResult[]>(initialResults);
  console.log('[LabResultsList] Initial state set:', results);
  
  const supabase = createClient();
  let channel: RealtimeChannel | null = null;

  useEffect(() => {
    console.log('[LabResultsList] useEffect running. Current results state:', results);
    
    // Ensure results are sorted initially (server might not guarantee order after inserts)
    setResults(prev => [...prev].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));

    // Set up Supabase Realtime subscription
    channel = supabase
      .channel('lab_results_changes')
      .on(
        'postgres_changes',
        { 
            event: '*', // Listen to INSERT, UPDATE, DELETE
            schema: 'public', 
            table: 'lab_results',
            filter: `user_id=eq.${userId}` // Only listen for changes for the current user
        },
        (payload: RealtimePostgresChangesPayload<{ [key: string]: any }>) => {
          console.log('Realtime payload received:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newResult = payload.new as LabResult;
            // Add to top and re-sort to be sure
             setResults(prev => 
                [newResult, ...prev].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
             );
          } else if (payload.eventType === 'UPDATE') {
            const updatedResult = payload.new as LabResult;
             setResults(prev => 
                prev.map(r => r.id === updatedResult.id ? updatedResult : r)
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
             );
          } else if (payload.eventType === 'DELETE') {
             const deletedResult = payload.old as Partial<LabResult>;
             setResults(prev => prev.filter(r => r.id !== deletedResult.id));
          }
        }
      )
      .subscribe((status, err) => {
        if (err) {
            console.error("Realtime subscription error:", err);
        }
         console.log("Realtime subscription status:", status);
      });

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
         console.log("Removed realtime channel");
      }
    };
  }, [supabase, userId]); // Depend on supabase client and userId

  if (results.length === 0) {
     return (
       <div className="mt-8 text-center text-gray-500 py-8 border border-dashed rounded-lg">
         <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
         <p>No lab results uploaded yet.</p>
         <p className="text-sm">Upload a PDF above to get started.</p>
       </div>
     );
  }

  // Render the list using the state
  return (
    <div className="space-y-6">
      {results.map((result) => (
        <Card key={result.id} className="overflow-hidden shadow-sm border border-gray-200 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50/50 border-b px-4 py-3">
            <div className="flex items-center gap-2 overflow-hidden mr-2">
                <FileText className="h-5 w-5 text-brand-dark-green/70 flex-shrink-0" />
                <CardTitle className="text-base font-medium truncate" title={result.file_name}>
                 {result.file_name}
                </CardTitle>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
               <StatusIcon status={result.status} />
               <Badge variant={getStatusVariant(result.status)} className="capitalize text-xs">
                  {result.status}
               </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
             <p className="text-xs text-gray-500">
                Uploaded {formatDistanceToNow(new Date(result.created_at), { addSuffix: true })}
             </p>
             {result.status === 'completed' && result.description && (
                 <div>
                    <h4 className="text-sm font-semibold text-brand-dark-green mb-1">Generated Description:</h4>
                    <p className="text-sm text-gray-700 bg-green-50/50 p-3 rounded-md border border-green-100 whitespace-pre-wrap">
                        {result.description}
                    </p>
                 </div>
             )}
             {result.status === 'error' && result.error_details && (
                <div>
                    <h4 className="text-sm font-semibold text-red-700 mb-1">Processing Error:</h4>
                    <p className="text-sm text-red-800 bg-red-50/50 p-3 rounded-md border border-red-100">
                        {result.error_details}
                    </p>
                </div>
             )}
             {(result.status === 'pending' || result.status === 'processing') && (
                 <p className="text-sm text-gray-600 italic">
                    {result.status === 'pending' ? 'Waiting to be processed...' : 'Processing in progress...'}
                 </p>
             )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 