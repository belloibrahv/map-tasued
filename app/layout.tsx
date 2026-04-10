import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import ErrorBoundary from '@/components/error-boundary'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TASUED Campus Navigator',
  description: 'Navigate Tai Solarin University of Education campus with ease',
  keywords: 'TASUED, campus navigation, university map, student guide',
  authors: [{ name: 'TASUED Development Team' }],
  creator: 'TASUED',
  publisher: 'Tai Solarin University of Education',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'TASUED Campus Navigator',
    description: 'Navigate Tai Solarin University of Education campus with ease',
    type: 'website',
    locale: 'en_US',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            {children}
          </div>
        </ErrorBoundary>
      </body>
    </html>
  )
}