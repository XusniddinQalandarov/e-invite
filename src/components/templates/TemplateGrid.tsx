'use client'

import { useState } from 'react'
import { TemplateCard } from './TemplateCard'
import { useLanguage } from '@/lib/language-context'
import type { TemplateConfig } from '@/types/template'

type StyleFilter = TemplateConfig['style'] | 'all'

interface Props {
  templates: TemplateConfig[]
}

export function TemplateGrid({ templates }: Props) {
  const { t } = useLanguage()
  const [filter, setFilter] = useState<StyleFilter>('all')

  const filters: { value: StyleFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'islamic', label: t.styles.islamic },
    { value: 'floral', label: t.styles.floral },
    { value: 'uzbek', label: t.styles.uzbek },
  ]

  const visible =
    filter === 'all' ? templates : templates.filter(tmpl => tmpl.style === filter)

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-body transition-all duration-200 ${
              filter === f.value
                ? 'bg-gold text-dark shadow-sm'
                : 'border border-gold/30 text-brand-text/60 hover:border-gold hover:text-gold'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map(template => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="text-center font-body text-brand-text/40 py-16">No templates found.</p>
      )}
    </div>
  )
}
