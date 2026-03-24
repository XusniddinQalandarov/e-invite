import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { templateConfigs } from '@/lib/templates/templateConfigs'
import { TemplateGrid } from '@/components/templates/TemplateGrid'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />

      {/* Templates preview */}
      <section className="py-28 bg-cream">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="font-body text-xs text-gold tracking-[0.3em] uppercase mb-4">
              Designs
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-dark">
              Choose Your Style
            </h2>
          </div>
          <TemplateGrid templates={templateConfigs} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark border-t border-gold/10 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display text-cream/40 text-sm">
            sening<span className="text-gold/60">·</span>toy
          </span>
          <p className="font-body text-cream/25 text-xs">
            © {new Date().getFullYear()} Sening Toy. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
