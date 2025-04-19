import { UserButton } from "@clerk/nextjs";
import PdfUploader from "@/components/pdf-uploader";
import { cn } from "@/lib/utils";
import { LabResultsDisplay } from "@/components/lab-results-display";

export default function DashboardPage() {
  return (
    <div className={cn("min-h-screen bg-brand-light-bg pb-12")}>
      <header className="bg-brand-dark-green text-white p-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className={cn("text-2xl font-semibold font-serif tracking-tight")}>COA Dashboard</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-2xl mt-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
          <h2 className={cn("text-xl font-semibold font-serif text-brand-dark-green mb-6 text-center")}>
            Upload Certificate of Analysis (PDF)
          </h2>
          <PdfUploader />
        </div>
        <div className="w-full max-w-3xl mt-8">
          <LabResultsDisplay />
        </div>
      </main>
    </div>
  );
} 