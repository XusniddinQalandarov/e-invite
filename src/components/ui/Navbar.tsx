'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { LanguageToggle } from './LanguageToggle'
import { Button } from './Button'

export function Navbar() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const isHome = pathname === '/'

  useEffect(() => {
    function onScroll() {
      const heroHeight = window.innerHeight * 0.85
      setScrolled(window.scrollY > heroHeight)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Hero mode: home page before scrolling past the hero
  const heroMode = isHome && !scrolled

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-500 ${
        heroMode
          ? 'bg-transparent border-b border-transparent'
          : 'backdrop-blur-md bg-cream/85 border-b border-gold/10 shadow-sm'
      }`}
    >
      <Link
        href="/"
        className={`font-display text-xl tracking-wide select-none transition-colors duration-500 ${
          heroMode ? 'text-white' : 'text-dark'
        }`}
        style={heroMode ? { textShadow: '0 1px 8px rgba(0,0,0,0.5)' } : undefined}
      >
        sening<span className="text-gold">·</span>toy
      </Link>
      <div className="flex items-center gap-5">
        <Link
          href="/templates"
          className={`hidden sm:block font-body text-sm transition-colors duration-500 ${
            heroMode
              ? 'text-white/90 hover:text-white'
              : 'text-gold/80 hover:text-gold'
          }`}
          style={heroMode ? { textShadow: '0 1px 6px rgba(0,0,0,0.5)' } : undefined}
        >
          {t.nav.templates}
        </Link>
        <Link
          href="/dashboard"
          className={`hidden sm:block font-body text-sm transition-colors duration-500 ${
            heroMode
              ? 'text-white/90 hover:text-white'
              : 'text-gold/80 hover:text-gold'
          }`}
          style={heroMode ? { textShadow: '0 1px 6px rgba(0,0,0,0.5)' } : undefined}
        >
          {t.nav.dashboard}
        </Link>
        <LanguageToggle scrolled={!heroMode} />
        <Link href="/templates">
          <Button size="sm">{t.nav.createNew}</Button>
        </Link>
      </div>
    </nav>
  )
}
