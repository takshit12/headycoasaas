'use client';

import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, UploadCloud, X, FileText, CheckCircle } from 'lucide-react';
import { uploadPdfAction } from '@/app/dashboard/_actions/upload-pdf';
import { cn } from '@/lib/utils';

export default function PdfUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [uploadComplete, setUploadComplete] = useState(false);

  const MAX_SIZE_MB = 1;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const handleFileChange = (selectedFile: File | null) => {
    setError(null);
    setUploadComplete(false);
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Invalid file type. Please upload a PDF.');
        setFile(null);
        return;
      }
      if (selectedFile.size > MAX_SIZE_BYTES) {
        setError(`File size exceeds ${MAX_SIZE_MB}MB limit.`);
        setFile(null);
        return;
      }
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(event.target.files ? event.target.files[0] : null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFileChange(event.dataTransfer.files[0]);
      const input = document.getElementById('pdf-upload-input') as HTMLInputElement;
      if (input) {
          input.value = '';
      }
    }
  };

  const handleUpload = async () => {
    if (!file || isPending) return;
    setError(null);
    setUploadComplete(false);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('pdf', file);

        toast.info('Uploading...', { description: 'Validating and uploading your PDF.' });

        const result = await uploadPdfAction(formData);

        if (result.success) {
          toast.success('Success!', { description: `PDF uploaded successfully: ${result.filePath}` });
          setUploadComplete(true);
          setTimeout(() => {
              setFile(null);
              setUploadComplete(false);
              const input = document.getElementById('pdf-upload-input') as HTMLInputElement;
              if (input) input.value = '';
          }, 2000);
        } else {
          toast.error('Upload Failed', { description: result.error || 'Could not upload the PDF. Please try again.' });
          setError(result.error || 'Upload failed on the server.');
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected client-side error occurred.';
        console.error("Upload action failed:", err);
        toast.error('Upload Failed', { description: errorMessage });
        setError(errorMessage);
      }
    });
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    setUploadComplete(false);
    const input = document.getElementById('pdf-upload-input') as HTMLInputElement;
    if (input) {
        input.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          `border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300`,
          `bg-gradient-to-br from-brand-light-bg/50 to-green-50`,
           isDragging 
            ? 'border-brand-accent-green scale-105'
            : (error 
                ? 'border-destructive'
                : 'border-brand-dark-green/20'),
          !file && !error && 'hover:border-brand-accent-green/50 hover:bg-gradient-to-br hover:from-brand-light-bg hover:to-green-100',
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && !isPending && document.getElementById('pdf-upload-input')?.click()}
      >
        <Input
          id="pdf-upload-input"
          type="file"
          accept="application/pdf"
          onChange={handleInputChange}
          className="hidden"
          disabled={isPending}
        />
        {uploadComplete ? (
           <div className="flex flex-col items-center space-y-2 text-brand-accent-green">
               <CheckCircle className="h-12 w-12" />
               <p className="font-medium">Upload Complete!</p>
           </div>
        ) : file ? (
          <div className="flex flex-col items-center space-y-2">
            <FileText className="h-10 w-10 text-brand-dark-green mb-2" />
            <p className="font-medium text-sm break-all px-2 text-gray-700">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            {!isPending && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => { e.stopPropagation(); removeFile(); }} 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50/50 mt-2 text-xs h-auto px-2 py-1 rounded"
                >
                  <X className="h-3 w-3 mr-1" /> Remove
                </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2 text-gray-500">
             <UploadCloud className="h-10 w-10 mb-2 text-brand-dark-green/60" />
            <Label htmlFor="pdf-upload-input" className="font-medium text-brand-accent-green cursor-pointer hover:underline">
              Choose PDF or drag here
            </Label>
            <p className="text-xs">Max {MAX_SIZE_MB}MB</p>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-destructive mt-3 text-center">{error}</p>}
      
      {file && !uploadComplete && (
          <Button 
            onClick={handleUpload} 
            disabled={isPending} 
            size="lg"
            className={cn(
                "mt-6 w-full font-semibold rounded-full transform transition-transform duration-200",
                "bg-brand-accent-green hover:bg-brand-accent-green/90 text-white",
                "hover:scale-105",
                isPending && "opacity-75 cursor-not-allowed"
            )}
          >
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
            ) : (
              <><UploadCloud className="mr-2 h-4 w-4" /> Confirm & Upload</>
            )}
          </Button>
      )}
    </div>
  );
} 