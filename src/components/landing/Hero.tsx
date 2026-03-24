'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/lib/language-context'

export function Hero() {
  const { t } = useLanguage()
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 })
    tl.fromTo(taglineRef.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' })
      .fromTo(headlineRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out' }, '-=0.4')
      .fromTo(subRef.current, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.7')
      .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.5')
    return () => { tl.kill() }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 20%, #2d0a1f 40%, #1a0f08 65%, #0d0a05 100%)',
      }}
    >
      {/* Deep background image overlay - romantic floral */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=60')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 20%, rgba(5,3,10,0.7) 100%)',
        }}
      />

      {/* Large golden glow behind content */}
      <div
        className="absolute"
        style={{
          width: '600px',
          height: '600px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Animated shimmer bands */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="absolute w-full pointer-events-none"
          style={{
            height: '1px',
            top: `${15 + i * 22}%`,
            background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.12) 30%, rgba(232,201,122,0.2) 50%, rgba(201,168,76,0.12) 70%, transparent 100%)',
            animation: `shimmer-line ${5 + i * 1.5}s ease-in-out ${i * 1.2}s infinite alternate`,
          }}
        />
      ))}

      {/* Gold dust particles */}
      {[...Array(24)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: i % 4 === 0 ? '3px' : i % 3 === 0 ? '2px' : '1px',
            height: i % 4 === 0 ? '3px' : i % 3 === 0 ? '2px' : '1px',
            background: i % 5 === 0 ? '#E8C97A' : '#C9A84C',
            left: `${(i * 17 + 3) % 100}%`,
            top: `${(i * 23 + 7) % 100}%`,
            opacity: 0.4 + (i % 4) * 0.1,
            boxShadow: `0 0 ${4 + (i % 3) * 3}px ${1 + (i % 2)}px rgba(201,168,76,0.4)`,
            animation: `float ${3 + (i % 5)}s ease-in-out ${i * 0.35}s infinite alternate`,
          }}
        />
      ))}

      {/* Decorative SVG floral silhouette left */}
      <svg
        className="absolute left-0 bottom-0 opacity-10 pointer-events-none"
        width="400" height="500" viewBox="0 0 400 500"
        fill="none"
      >
        <path d="M0,500 C50,400 150,300 200,200 C150,250 100,300 50,400 C30,450 10,480 0,500Z" fill="#C9A84C"/>
        <circle cx="200" cy="200" r="60" fill="#C9A84C" opacity="0.5"/>
        <circle cx="160" cy="240" r="40" fill="#E8C97A" opacity="0.4"/>
        <circle cx="240" cy="230" r="35" fill="#C9A84C" opacity="0.3"/>
        <path d="M180,180 Q200,150 220,180 Q240,210 200,220 Q160,210 180,180Z" fill="#E8C97A" opacity="0.6"/>
        {[...Array(8)].map((_, i) => (
          <ellipse
            key={i}
            cx={180 + Math.cos(i * 45 * Math.PI / 180) * 70}
            cy={200 + Math.sin(i * 45 * Math.PI / 180) * 70}
            rx="25" ry="12"
            transform={`rotate(${i * 45}, ${180 + Math.cos(i * 45 * Math.PI / 180) * 70}, ${200 + Math.sin(i * 45 * Math.PI / 180) * 70})`}
            fill="#C9A84C" opacity="0.4"
          />
        ))}
      </svg>

      {/* Decorative SVG floral silhouette right */}
      <svg
        className="absolute right-0 top-0 opacity-10 pointer-events-none"
        width="350" height="450" viewBox="0 0 350 450"
        fill="none"
      >
        <path d="M350,0 C300,100 200,200 150,300 C200,250 250,200 300,100 C320,50 340,20 350,0Z" fill="#C9A84C"/>
        <circle cx="150" cy="300" r="50" fill="#E8C97A" opacity="0.5"/>
        {[...Array(6)].map((_, i) => (
          <ellipse
            key={i}
            cx={150 + Math.cos(i * 60 * Math.PI / 180) * 60}
            cy={300 + Math.sin(i * 60 * Math.PI / 180) * 60}
            rx="22" ry="10"
            transform={`rotate(${i * 60}, ${150 + Math.cos(i * 60 * Math.PI / 180) * 60}, ${300 + Math.sin(i * 60 * Math.PI / 180) * 60})`}
            fill="#C9A84C" opacity="0.45"
          />
        ))}
      </svg>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p
          ref={taglineRef}
          className="font-body text-gold text-xs tracking-[0.5em] uppercase mb-8 opacity-0"
          style={{ textShadow: '0 0 20px rgba(201,168,76,0.5)' }}
        >
          sening·toy
        </p>
        <h1
          ref={headlineRef}
          className="font-display text-5xl md:text-7xl lg:text-8xl text-cream leading-[1.05] mb-6 opacity-0"
          style={{ textShadow: '0 4px 40px rgba(0,0,0,0.8), 0 0 80px rgba(201,168,76,0.1)' }}
        >
          {t.hero.headline}
        </h1>
        <p
          ref={subRef}
          className="font-body text-cream/75 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed opacity-0"
          style={{ textShadow: '0 1px 12px rgba(0,0,0,0.6)' }}
        >
          {t.hero.subheadline}
        </p>
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0">
          <Link href="/templates">
            <Button size="lg" className="shadow-[0_0_30px_rgba(201,168,76,0.3)]">
              {t.hero.cta}
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button size="lg" variant="ghost" className="inline-flex items-center gap-2 text-cream/80 hover:text-gold">
              Learn more <ChevronDown size={18} strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--color-cream))' }}
      />

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="w-px h-10 bg-gradient-to-b from-gold/50 to-transparent animate-pulse mx-auto" />
      </div>
    </section>
  )
}
