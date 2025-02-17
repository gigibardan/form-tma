import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

//comentariu test

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

// comentariu test Vlad

export const metadata: Metadata = {
  title: 'Formular Înscriere | TechMinds Academy',
  description: 'Formular de înscriere pentru cursurile de robotică, programare și STEM la TechMinds Academy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro">
      <body className={`${poppins.variable} font-sans min-h-screen bg-gray-50`}>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}