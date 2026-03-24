'use client'

import { useLanguage } from '@/lib/language-context'

const langs = [
  { code: 'uz' as const, label: "O'z" },
  { code: 'ru' as const, label: 'Рус' },
  { code: 'en' as const, label: 'En' },
]

interface Props {
  scrolled?: boolean
}

export function LanguageToggle({ scrolled = true }: Props) {
  const { lang, setLang } = useLanguage()
  return (
    <div className={`flex items-center rounded border overflow-hidden transition-colors duration-500 ${
      scrolled ? 'border-gold/30' : 'border-white/40'
    }`}>
      {langs.map(l => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`px-2.5 py-1 text-xs font-body font-medium transition-colors ${
            lang === l.code
              ? 'bg-gold text-dark'
              : scrolled
                ? 'text-brand-text/50 hover:text-gold'
                : 'text-white/70 hover:text-white'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
