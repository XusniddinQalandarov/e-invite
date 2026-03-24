'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { Button } from '@/components/ui/Button'

export function PricingSection() {
  const { t } = useLanguage()
  return (
    <section className="py-28 bg-dark">
      <div className="max-w-lg mx-auto px-4 text-center">
        <p className="font-body text-xs text-gold tracking-[0.3em] uppercase mb-4">Simple pricing</p>
        <h2 className="font-display text-4xl md:text-5xl text-cream mb-16">{t.pricing.title}</h2>

        <div className="relative border border-gold/25 rounded-sm p-10 bg-white/[0.03] backdrop-blur-sm">
          {/* Gold corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gold/50" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-gold/50" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-gold/50" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gold/50" />

          <p className="font-display text-5xl md:text-6xl text-gold mb-2">{t.pricing.price}</p>
          <p className="font-body text-cream/40 text-sm mb-2">per invitation</p>
          <p className="font-body text-cream/40 mb-10 text-sm">{t.pricing.description}</p>

          <div className="flex flex-col gap-3 text-left mb-10">
            {[
              'Animated canvas invitation',
              'Permanent shareable link',
              'High-resolution PNG download',
              'WhatsApp share button',
              '3 premium template styles',
            ].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-gold shrink-0" />
                <span className="font-body text-cream/60 text-sm">{f}</span>
              </div>
            ))}
          </div>

          <Link href="/templates">
            <Button size="lg" className="w-full">{t.pricing.cta}</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
