"use client"

import { Hero } from '@/components/ui/animated-hero'
import { FeaturesSection } from '@/components/features-section'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-dark-green text-white">
      <header className="container mx-auto px-4 h-20 flex items-center justify-between border-b border-white/10 sticky top-0 z-50 bg-brand-dark-green/80 backdrop-blur-sm">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image src="/headylogo.png" alt="HeadyCo Logo" width={120} height={40} priority />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
            <Link href="#" className="hover:text-white transition-colors duration-200">About</Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">Services</Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">Success Stories</Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">Resources</Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">Blog</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <SignedOut>
            <Button 
              variant="outline" 
              className="hidden sm:inline-flex bg-brand-dark-green text-white hover:bg-white hover:text-brand-dark-green border-brand-dark-green hover:border-brand-dark-green transition-all duration-200"
            >
              Request Demo
            </Button>
            <SignUpButton mode="modal">
              <Button className="bg-brand-accent-green hover:bg-brand-accent-green/90 text-white font-semibold transform hover:scale-105 transition-transform duration-200">
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Button asChild variant="outline" className="border-white/40 text-white/80 hover:border-white/80 hover:bg-white/5 hover:text-white transition-all duration-200">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>
      <main className="flex-grow">
        <Hero />
        <FeaturesSection />
      </main>
      <footer className="container mx-auto px-4 py-8 mt-auto border-t border-white/10 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} HeadyCo. All rights reserved.
      </footer>
    </div>
  )
}
