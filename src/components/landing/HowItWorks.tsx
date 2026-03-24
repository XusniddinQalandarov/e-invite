'use client'

import { useLanguage } from '@/lib/language-context'

export function HowItWorks() {
  const { t } = useLanguage()
  const steps = [t.howItWorks.step1, t.howItWorks.step2, t.howItWorks.step3]

  return (
    <section id="how-it-works" className="py-28 bg-cream">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-20">
          <p className="font-body text-xs text-gold tracking-[0.3em] uppercase mb-4">Process</p>
          <h2 className="font-display text-4xl md:text-5xl text-dark">{t.howItWorks.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-5">
              <div className="relative w-20 h-20 rounded-full border border-gold/30 bg-cream flex items-center justify-center shadow-[0_0_30px_rgba(201,168,76,0.08)]">
                <span className="font-display text-2xl text-gold">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div>
                <h3 className="font-display text-2xl text-dark mb-2">{step.title}</h3>
                <p className="font-body text-brand-text/55 leading-relaxed text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
