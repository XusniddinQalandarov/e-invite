import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/lib/language-context'
import { Navbar } from '@/components/ui/Navbar'

export const metadata: Metadata = {
  title: 'Sening Toy — Wedding E-Invitations',
  description: 'Beautiful animated wedding e-invitations for Uzbekistan',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
        </LanguageProvider>
      </body>
    </html>
  )
}
