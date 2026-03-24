'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { uz, type Strings } from './i18n/uz'
import { ru } from './i18n/ru'
import { en } from './i18n/en'

type Lang = 'uz' | 'ru' | 'en'

const strings: Record<Lang, Strings> = { uz, ru, en }

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Strings
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('uz')

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null
    if (stored && (['uz', 'ru', 'en'] as const).includes(stored)) {
      setLangState(stored)
    }
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('lang', l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: strings[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
