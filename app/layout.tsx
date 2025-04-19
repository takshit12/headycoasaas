import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Playfair_Display } from 'next/font/google'
import './globals.css'
import TanstackClientProvider from '@/components/providers/tanstack-client-provider'
import { ClerkProvider } from '@clerk/nextjs'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'HeadyCo Lab Results',
  description: 'Manage and analyze cannabis lab results easily.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <TanstackClientProvider>{children}</TanstackClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
