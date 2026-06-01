import type { Metadata } from 'next'

import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/components/auth/AuthProvider'


export const metadata: Metadata = {
  title: 'Param Makerspace — Where Ideas Become Reality',
  description:
    'A community of builders, thinkers, and creators collaborating on real-world projects. Learn by building, earn badges, and showcase your work.',
  keywords: ['makerspace', 'projects', 'community', 'badges', 'challenges', 'electronics', 'robotics', '3D printing'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col grain font-sans">
        <AuthProvider>
          <Header />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
