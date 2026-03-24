import { templateConfigs } from '@/lib/templates/templateConfigs'
import { TemplateGrid } from '@/components/templates/TemplateGrid'

export default function TemplatesPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-cream">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-10">
          <p className="font-body text-xs text-gold tracking-[0.3em] uppercase mb-3">
            Collection
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-dark mb-3">
            Templates
          </h1>
          <p className="font-body text-brand-text/50 text-lg">
            Choose a design that tells your story
          </p>
        </div>
        <TemplateGrid templates={templateConfigs} />
      </div>
    </div>
  )
}
