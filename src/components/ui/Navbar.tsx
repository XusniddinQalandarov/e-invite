'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { LanguageToggle } from './LanguageToggle'
import { Button } from './Button'

export function Navbar() {
  const { t } = useLanguage()
  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-cream/85 border-b border-gold/10">
      <Link href="/" className="font-display text-xl text-dark tracking-wide select-none">
        sening<span className="text-gold">·</span>toy
      </Link>
      <div className="flex items-center gap-5">
        <Link
          href="/templates"
          className="hidden sm:block font-body text-sm text-brand-text/60 hover:text-gold transition-colors"
        >
          {t.nav.templates}
        </Link>
        <Link
          href="/dashboard"
          className="hidden sm:block font-body text-sm text-brand-text/60 hover:text-gold transition-colors"
        >
          {t.nav.dashboard}
        </Link>
        <LanguageToggle />
        <Link href="/templates">
          <Button size="sm">{t.nav.createNew}</Button>
        </Link>
      </div>
    </nav>
  )
}
