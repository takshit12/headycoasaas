'use client'; // Ensure it's a client component for Clerk interactions

import { motion } from 'framer-motion'
import { ArrowRight, DollarSign, CheckCircle, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from "@/components/ui/card"
import { SignedIn, SignedOut, SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'

// Placeholder Social Proof Logos (Replace with actual logos/components later)
const SocialProofLogos = () => (
  <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-gray-400 sm:justify-start">
    <span className="text-sm font-semibold tracking-wider uppercase">Trusted by:</span>
    {/* Use actual logos here */} 
    <span>Elastic</span> 
    <span>VMware</span> 
    <span>Varonis</span> 
    <span>Basecamp</span>
  </div>
);

// Placeholder Metric Card Component
const MetricCard = ({ icon: Icon, title, value, percentage, percentageColor = 'text-green-400' }: {
  icon: React.ElementType;
  title: string;
  value: string;
  percentage?: string;
  percentageColor?: string;
}) => (
  <Card className="bg-brand-card-dark border border-white/10 p-4 rounded-lg shadow-md">
    <CardContent className="p-0 flex items-start gap-3">
      <div className={`mt-1 p-1.5 rounded bg-white/5 ${percentageColor.replace('text-', 'text-opacity-20')}`}> { /* Subtle icon bg */}
         <Icon className={`h-5 w-5 ${percentageColor}`} />
      </div>
      <div>
        <p className="text-sm text-gray-300 font-medium">{title}</p>
        <p className="text-2xl font-semibold text-white mt-1">{value}</p>
        {percentage && (
          <p className={`text-xs ${percentageColor} mt-1`}>↑ {percentage}</p>
        )}
      </div>
    </CardContent>
  </Card>
);

function Hero() {
  const headline = "The AI-Powered COA Analysis Tool";
  const description = 
    "Instantly unlock valuable insights from your lab results. Upload COA PDFs and let AI handle the data extraction and analysis, streamlining your compliance and quality control.";

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16 lg:py-24">
        
        {/* Left Column: Text Content & Logos */} 
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start text-left"
        >
          <h1 className="font-serif font-medium max-w-xl text-5xl tracking-tight text-white sm:text-6xl lg:text-7xl">
            {headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
            {description}
          </p>

          {/* CTA Button */} 
          <div className="mt-8">
             <SignedOut>
              <SignUpButton mode="modal">
                <Button size="lg" className="gap-2 bg-brand-accent-green hover:bg-brand-accent-green/90 text-white font-semibold px-6 py-3 rounded-full transform hover:scale-105 transition-transform duration-200">
                  Upload Your First COA <ArrowRight className="h-5 w-5" />
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
          </div>

          <SocialProofLogos />
        </motion.div>

        {/* Right Column: Metric Cards */} 
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col gap-4"
        >
           <MetricCard 
              icon={CheckCircle}
              title="Accuracy Improvement"
              value="99.5%"
              percentage="vs Manual Entry"
              percentageColor="text-green-400"
           />
            <MetricCard 
              icon={Users}
              title="Time Saved per COA"
              value="5 mins"
              percentage="Average User"
              percentageColor="text-blue-400"
           />
           <MetricCard 
              icon={DollarSign}
              title="Compliance Risk Reduction"
              value="Significant"
              percentageColor="text-yellow-400"
           />
        </motion.div>

      </div>
    </div>
  )
}

export { Hero }
