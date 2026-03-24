'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/lib/language-context'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { TemplateConfig } from '@/types/template'

interface Props {
  template: TemplateConfig
}

export function TemplateCard({ template }: Props) {
  const { t } = useLanguage()
  return (
    <div className="group relative flex flex-col rounded-sm overflow-hidden border border-gold/20 bg-white/40 backdrop-blur-sm transition-all duration-300 hover:border-gold/50 hover:shadow-[0_8px_32px_rgba(201,168,76,0.18)]">
      {/* Preview image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={template.previewUrl}
          alt={template.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/10 transition-colors duration-300" />
        {/* Label badge overlaid on image */}
        {template.label && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-[10px] font-body font-medium tracking-wider uppercase rounded bg-gold text-dark shadow-sm">
              {template.label}
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg text-dark leading-tight">{template.name}</h3>
          <Badge variant="style">{t.styles[template.style]}</Badge>
        </div>
        <p className="font-body text-sm text-gold font-medium">{template.priceLabel}</p>
        <Link href={`/editor/${template.id}`} className="block">
          <Button variant="primary" size="sm" className="w-full">
            {t.common.customize}
          </Button>
        </Link>
      </div>
    </div>
  )
}
