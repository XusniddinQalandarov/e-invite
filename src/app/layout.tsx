import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/lib/language-context'

export const metadata: Metadata = {
  title: 'Sening Toy — Wedding E-Invitations',
  description: 'Beautiful animated wedding e-invitations for Uzbekistan',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
