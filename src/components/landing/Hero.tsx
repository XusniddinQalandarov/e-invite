'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/lib/language-context'

export function Hero() {
  const { t } = useLanguage()
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 })
    tl.fromTo(
      taglineRef.current,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
    )
      .fromTo(
        headlineRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        '-=0.3',
      )
      .fromTo(
        subRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.6',
      )
      .fromTo(
        ctaRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.4',
      )
    return () => { tl.kill() }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-[#1A1207] via-dark to-[#0D0A05]" />

      {/* Gold shimmer lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.15) 50%, transparent 100%)',
              top: `${30 + i * 20}%`,
              animation: `shimmer-line ${4 + i}s ease-in-out ${i * 1.5}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: i % 3 === 0 ? '2px' : '1px',
              height: i % 3 === 0 ? '2px' : '1px',
              background: '#C9A84C',
              left: `${(i * 13 + 7) % 100}%`,
              top: `${(i * 19 + 5) % 100}%`,
              boxShadow: '0 0 8px 2px rgba(201,168,76,0.3)',
              animation: `float ${3 + (i % 5)}s ease-in-out ${i * 0.4}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p
          ref={taglineRef}
          className="font-body text-gold text-xs tracking-[0.4em] uppercase mb-8 opacity-0"
        >
          sening·toy
        </p>
        <h1
          ref={headlineRef}
          className="font-display text-5xl md:text-7xl lg:text-8xl text-cream leading-[1.05] mb-6 opacity-0"
        >
          {t.hero.headline}
        </h1>
        <p
          ref={subRef}
          className="font-body text-cream/50 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed opacity-0"
        >
          {t.hero.subheadline}
        </p>
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0">
          <Link href="/templates">
            <Button size="lg">{t.hero.cta}</Button>
          </Link>
          <Link href="#how-it-works">
            <Button size="lg" variant="ghost" className="text-cream/60 hover:text-gold">
              Learn more ↓
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-8 bg-gradient-to-b from-gold/40 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
