'use client'

import { useLanguage } from '@/lib/language-context'

const langs = [
  { code: 'uz' as const, label: "O'z" },
  { code: 'ru' as const, label: 'Рус' },
  { code: 'en' as const, label: 'En' },
]

export function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  return (
    <div className="flex items-center rounded border border-gold/30 overflow-hidden">
      {langs.map(l => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`px-2.5 py-1 text-xs font-body font-medium transition-colors ${
            lang === l.code
              ? 'bg-gold text-dark'
              : 'text-brand-text/50 hover:text-gold'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
