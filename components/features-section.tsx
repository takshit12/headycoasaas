'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, UploadCloud, FileCheck2, LineChart } from 'lucide-react'; // Icons for features
import { SignedIn, SignedOut, SignUpButton } from '@clerk/nextjs';
import Link from 'next/link';

// Updated Feature Card with icon support and hover effect
const FeatureCard = ({ title, description, icon: Icon }: {
  title: string;
  description: string;
  icon: React.ElementType; // Use ElementType for component type
}) => (
  <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-lg hover:border-brand-accent-green/50"> {/* Added group for hover effects */}
    {/* Icon Area with Styling - Updated Default Gradient */}
    <div className="h-48 bg-gradient-to-br from-brand-light-bg to-green-100 flex items-center justify-center border-b p-4 group-hover:bg-gradient-to-br group-hover:from-brand-light-bg group-hover:to-green-50 transition-all duration-300"> {/* Use theme colors for default gradient */}
       <Icon className="h-16 w-16 text-brand-dark-green/60 group-hover:text-brand-accent-green transition-colors duration-300" strokeWidth={1.5} /> {/* Display Icon */}
    </div>
    {/* Content Area */}
    <div className="p-6 flex flex-col flex-grow">
      <CardTitle className="text-xl font-semibold text-brand-dark-green mb-2 group-hover:text-brand-accent-green transition-colors duration-300">{title}</CardTitle> {/* Hover color change */}
      <p className="text-gray-600 flex-grow">{description}</p>
    </div>
  </Card>
);


export function FeaturesSection() {
  const headline = "The Proven Choice For Cannabis Data Extraction";

  return (
    <div className="w-full bg-brand-light-bg py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-12 lg:mb-16"
        >
           <h2 className="font-serif font-medium text-4xl tracking-tight text-brand-dark-green sm:text-5xl lg:text-6xl max-w-3xl">
              {headline}
            </h2>
        </motion.div>

        {/* Feature Cards Grid - Pass Lucide Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch" // items-stretch for equal height
        >
            {/* Pass relevant Lucide icons */}
            <FeatureCard
                title="Instant Data Extraction"
                description="AI automatically pulls key data points like cannabinoids, terpenes, contaminants, and more from your COA PDFs in seconds."
                icon={UploadCloud} // Icon for upload/extraction
            />
            <FeatureCard
                title="Ensure Compliance"
                description="Quickly verify results against state regulations and internal standards. Flag out-of-spec results immediately."
                icon={FileCheck2} // Icon for compliance/verification
            />
             <FeatureCard
                title="Unlock Insights"
                description="Analyze trends across batches, suppliers, and strains. Optimize your products and processes with actionable data."
                icon={LineChart} // Icon for analytics/insights
            />
        </motion.div>

         {/* Final CTA */} 
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mt-12 lg:mt-16"
          >
            <SignedOut>
              <SignUpButton mode="modal">
                <Button size="lg" className="gap-2 bg-brand-accent-green hover:bg-brand-accent-green/90 text-white font-semibold px-6 py-3 rounded-full transform hover:scale-105 transition-transform duration-200">
                  Start Analyzing For Free <ArrowRight className="h-5 w-5" />
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button size="lg" className="gap-2 bg-brand-accent-green hover:bg-brand-accent-green/90 text-white font-semibold px-6 py-3 rounded-full transform hover:scale-105 transition-transform duration-200" asChild>
                <Link href="/dashboard">
                    Go to Dashboard <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </SignedIn>
          </motion.div>
      </div>
    </div>
  );
} 