# E-Invite Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack local-first wedding e-invitation platform with animated Fabric.js/GSAP canvas, 3 MVP templates, mock payment, and shareable invitation links.

**Architecture:** Next.js 14 App Router with TypeScript strict mode. Data lives in `data/*.json` files, accessed via a single `lib/db.ts` boundary (write-then-rename for atomicity). Canvas logic is entirely in `components/canvas/` — Fabric.js for rendering, GSAP for animation, communicating via proxy objects so GSAP drives all `renderAll()` calls.

**Tech Stack:** Next.js 14, TypeScript 5, TailwindCSS 3, Fabric.js 6, GSAP 3, Google Fonts (Cormorant Garamond, Jost)

---

## File Map

```
e-invite/
├── data/
│   ├── templates.json                  # seed — 3 template records, never written at runtime
│   └── invitations.json                # starts as [], PATCH/POST via API
├── public/
│   └── templates/
│       ├── islamic-bg.png              # placeholder: 800×1000 navy PNG
│       ├── floral-bg.png              # placeholder: 800×1000 cream PNG
│       └── uzbek-bg.png               # placeholder: 800×1000 burgundy PNG
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # root layout: fonts, LanguageProvider, globals.css
│   │   ├── globals.css                 # CSS custom properties, Tailwind base
│   │   ├── (public)/
│   │   │   ├── page.tsx               # Landing page
│   │   │   ├── templates/
│   │   │   │   └── page.tsx           # Template gallery
│   │   │   └── invitation/
│   │   │       └── [id]/
│   │   │           └── page.tsx       # Shareable page (server fetch + client canvas)
│   │   ├── editor/
│   │   │   └── [templateId]/
│   │   │       └── page.tsx           # Editor page (client)
│   │   ├── checkout/
│   │   │   └── [invitationId]/
│   │   │       └── page.tsx           # Checkout (mocked)
│   │   ├── dashboard/
│   │   │   └── page.tsx               # Dashboard — all invitations
│   │   └── api/
│   │       ├── templates/
│   │       │   └── route.ts           # GET /api/templates
│   │       └── invitations/
│   │           ├── route.ts           # GET (list), POST (create)
│   │           └── [id]/
│   │               └── route.ts       # GET (one), PATCH (update)
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── InvitationCanvas.tsx   # forwardRef wrapper, exposes exportPNG handle
│   │   │   ├── useCanvas.ts           # Fabric canvas lifecycle, object map, photo composite
│   │   │   └── useGSAPAnimations.ts   # GSAP timeline factory; proxy-based renderAll
│   │   ├── editor/
│   │   │   └── EditorForm.tsx         # Controlled form; calls onDataChange, onSave, onPurchase
│   │   ├── templates/
│   │   │   ├── TemplateCard.tsx       # Card with hover animation, CTA
│   │   │   └── TemplateGrid.tsx       # Filtered grid
│   │   ├── landing/
│   │   │   ├── Hero.tsx               # Hero section with GSAP loop
│   │   │   ├── HowItWorks.tsx         # 3-step section
│   │   │   └── PricingSection.tsx     # Pricing card
│   │   └── ui/
│   │       ├── Button.tsx             # variant: primary | secondary | ghost
│   │       ├── Input.tsx              # label + error state
│   │       ├── Select.tsx             # styled native select
│   │       ├── Badge.tsx              # status / style tags
│   │       ├── LanguageToggle.tsx     # UZ / RU / EN switcher
│   │       └── Navbar.tsx             # site navigation
│   ├── lib/
│   │   ├── db.ts                      # readJson<T>, writeJson<T> (write-then-rename)
│   │   ├── i18n/
│   │   │   ├── uz.ts                  # Uzbek strings
│   │   │   ├── ru.ts                  # Russian strings
│   │   │   └── en.ts                  # English strings
│   │   ├── language-context.tsx       # LanguageContext + LanguageProvider + useLanguage hook
│   │   └── templates/
│   │       └── templateConfigs.ts     # 3 TemplateConfig objects
│   └── types/
│       ├── invitation.ts              # Invitation, InvitationCanvasHandle
│       └── template.ts               # TemplateConfig, TextFieldConfig, DecorativeElement
```

---

## Task 1: Project Initialisation

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `next.config.js`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `data/templates.json`, `data/invitations.json`
- Create: `public/templates/islamic-bg.png`, `floral-bg.png`, `uzbek-bg.png` (placeholder images)

- [ ] **Step 1: Scaffold Next.js 14 project**

```bash
cd /Users/macstore.uz/Documents/projects/e-invite
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
```

Expected: project files created, `npm run dev` works at localhost:3000.

- [ ] **Step 2: Install dependencies**

```bash
npm install fabric gsap
npm install --save-dev @types/fabric
```

- [ ] **Step 3: Configure TypeScript strict mode**

In `tsconfig.json`, ensure these are set:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

- [ ] **Step 4: Set up design system in `globals.css`**

Replace the contents of `src/app/globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@300;400;500&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-cream: #FAF6F0;
  --color-gold: #C9A84C;
  --color-gold-light: #E8C97A;
  --color-dark: #1A1207;
  --color-text: #3D2B1F;
  --font-display: 'Cormorant Garamond', serif;
  --font-body: 'Jost', sans-serif;
}

body {
  font-family: var(--font-body);
  background-color: var(--color-cream);
  color: var(--color-text);
}

h1, h2, h3 {
  font-family: var(--font-display);
}
```

- [ ] **Step 5: Configure Tailwind to expose CSS variables**

In `tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: 'var(--color-cream)',
        gold: 'var(--color-gold)',
        'gold-light': 'var(--color-gold-light)',
        dark: 'var(--color-dark)',
        'brand-text': 'var(--color-text)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 6: Create placeholder background PNGs**

Use any image tool or a simple Node script to create 800×1000 solid-colour PNGs:
- `public/templates/islamic-bg.png` — `#0D1B2A` (deep navy)
- `public/templates/floral-bg.png` — `#FAF6F0` (cream)
- `public/templates/uzbek-bg.png` — `#6B1F2A` (burgundy)

Alternatively, create them with sharp in a one-off script:
```bash
npm install --save-dev sharp
node -e "
const sharp = require('sharp');
const path = require('path');
const templates = [
  { file: 'islamic-bg.png', r: 13, g: 27, b: 42 },
  { file: 'floral-bg.png', r: 250, g: 246, b: 240 },
  { file: 'uzbek-bg.png', r: 107, g: 31, b: 42 },
];
Promise.all(templates.map(t =>
  sharp({ create: { width: 800, height: 1000, channels: 3, background: { r: t.r, g: t.g, b: t.b } } })
    .png().toFile(path.join('public/templates', t.file))
)).then(() => console.log('done'));
"
```

- [ ] **Step 7: Create JSON data files**

`data/templates.json`:
```json
[]
```
(Will be populated in Task 3.)

`data/invitations.json`:
```json
[]
```

- [ ] **Step 8: Add `data/` to `.gitignore` invitations only**

Append to `.gitignore`:
```
# Keep templates.json tracked, ignore invitations data
data/invitations.json
```

- [ ] **Step 9: Commit**

```bash
git init
git add -A
git commit -m "feat: init Next.js 14 project with design system and placeholder assets"
```

---

## Task 2: Types, i18n, Language Context, and DB Layer

**Files:**
- Create: `src/types/template.ts`
- Create: `src/types/invitation.ts`
- Create: `src/lib/db.ts`
- Create: `src/lib/i18n/uz.ts`, `ru.ts`, `en.ts`
- Create: `src/lib/language-context.tsx`

- [ ] **Step 1: Write `src/types/template.ts`**

```typescript
export interface TextFieldConfig {
  left: number
  top: number
  width: number
  fontSize: number
  fontFamily: string
  fontWeight?: string
  fill: string
  textAlign?: 'left' | 'center' | 'right'
  originX?: 'left' | 'center' | 'right'
  originY?: 'top' | 'center' | 'bottom'
}

export type DecorativeElement =
  | {
      type: 'text'
      content: string
      left: number
      top: number
      fontSize: number
      fontFamily: string
      fill: string
      fontWeight?: string
    }
  | {
      type: 'line'
      left: number
      top: number
      width: number
      stroke: string
      strokeWidth?: number
    }

export interface TemplateConfig {
  id: string
  name: string
  style: 'floral' | 'islamic' | 'uzbek'
  backgroundUrl: string
  previewUrl: string
  textFields: {
    brideName: TextFieldConfig
    groomName: TextFieldConfig
    date: TextFieldConfig
    time: TextFieldConfig
    venue: TextFieldConfig
    address?: TextFieldConfig
  }
  photoArea?: {
    left: number
    top: number
    width: number
    height: number
    clipShape: 'circle' | 'rect'
  }
  decorativeElements?: DecorativeElement[]
}
```

- [ ] **Step 2: Write `src/types/invitation.ts`**

```typescript
export interface Invitation {
  id: string
  templateId: string
  brideName: string
  groomName: string
  weddingDate: string
  weddingTime: string
  venueName: string
  venueAddress?: string
  photoUrl?: string
  language: 'uz' | 'ru' | 'en'
  status: 'draft' | 'paid'
  paymentId?: string
  canvasJson?: string
  createdAt: string
  updatedAt: string
}

export interface InvitationCanvasHandle {
  exportPNG: () => string
}
```

- [ ] **Step 3: Write `src/lib/db.ts`**

```typescript
import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

export async function readJson<T>(filename: string): Promise<T> {
  const filepath = path.join(DATA_DIR, filename)
  const raw = await fs.readFile(filepath, 'utf-8')
  return JSON.parse(raw) as T
}

export async function writeJson<T>(filename: string, data: T): Promise<void> {
  const filepath = path.join(DATA_DIR, filename)
  const tmp = filepath + '.tmp'
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8')
  await fs.rename(tmp, filepath)
}
```

- [ ] **Step 4: Write i18n string files**

`src/lib/i18n/uz.ts`:
```typescript
export const uz = {
  nav: {
    templates: "Shablonlar",
    dashboard: "Mening taklifnomalarim",
    createNew: "Yangi yaratish",
  },
  hero: {
    headline: "Nikohingizni Ulashing",
    subheadline: "Chiroyli animatsiyali elektron taklifnomalar",
    cta: "Shablonni tanlash",
  },
  howItWorks: {
    title: "Qanday ishlaydi",
    step1: { title: "Tanlang", desc: "O'zingizga yoqqan shablonni tanlang" },
    step2: { title: "Moslashtiring", desc: "Ma'lumotlaringizni kiriting" },
    step3: { title: "Ulashing", desc: "Havolani do'stlaringizga yuboring" },
  },
  pricing: {
    title: "Narx",
    price: "150 000 so'm",
    description: "Bir martalik to'lov, umrbod havola",
    cta: "Hozir boshlash",
  },
  editor: {
    brideName: "Kelinchak ismi",
    groomName: "Kuyov ismi",
    weddingDate: "To'y sanasi",
    weddingTime: "To'y vaqti",
    venueName: "To'y joyi",
    venueAddress: "Manzil",
    photo: "Juft surati (ixtiyoriy)",
    language: "Taklifnoma tili",
    saveDraft: "Qoralamani saqlash",
    purchase: "Sotib olish",
    photoSizeError: "Rasm 800 KB dan oshmasligi kerak",
  },
  checkout: {
    title: "To'lov",
    price: "150 000 so'm",
    pay: "Payme orqali to'lash",
    summary: "Taklifnoma ma'lumotlari",
  },
  invitation: {
    download: "Yuklab olish",
    copyLink: "Havolani nusxalash",
    linkCopied: "Nusxalandi!",
    whatsapp: "WhatsApp orqali ulashish",
  },
  dashboard: {
    title: "Mening taklifnomalarim",
    empty: "Hali taklifnoma yo'q",
    createNew: "Yangi yaratish",
    status: { draft: "Qoralama", paid: "To'langan" },
  },
  styles: {
    floral: "Gullar",
    islamic: "Islomiy",
    uzbek: "O'zbek milliy",
  },
  common: {
    customize: "Moslashtirish",
    price: "150 000 so'm",
    loading: "Yuklanmoqda...",
  },
} as const

export type Strings = typeof uz
```

`src/lib/i18n/ru.ts`:
```typescript
import type { Strings } from './uz'

export const ru: Strings = {
  nav: {
    templates: "Шаблоны",
    dashboard: "Мои приглашения",
    createNew: "Создать новое",
  },
  hero: {
    headline: "Поделитесь своей свадьбой",
    subheadline: "Красивые анимированные электронные приглашения",
    cta: "Выбрать шаблон",
  },
  howItWorks: {
    title: "Как это работает",
    step1: { title: "Выберите", desc: "Выберите понравившийся шаблон" },
    step2: { title: "Настройте", desc: "Введите свои данные" },
    step3: { title: "Поделитесь", desc: "Отправьте ссылку гостям" },
  },
  pricing: {
    title: "Цена",
    price: "150 000 сум",
    description: "Единоразовая оплата, вечная ссылка",
    cta: "Начать сейчас",
  },
  editor: {
    brideName: "Имя невесты",
    groomName: "Имя жениха",
    weddingDate: "Дата свадьбы",
    weddingTime: "Время свадьбы",
    venueName: "Место проведения",
    venueAddress: "Адрес",
    photo: "Фото пары (необязательно)",
    language: "Язык приглашения",
    saveDraft: "Сохранить черновик",
    purchase: "Купить",
    photoSizeError: "Фото не должно превышать 800 КБ",
  },
  checkout: {
    title: "Оплата",
    price: "150 000 сум",
    pay: "Оплатить через Payme",
    summary: "Данные приглашения",
  },
  invitation: {
    download: "Скачать",
    copyLink: "Копировать ссылку",
    linkCopied: "Скопировано!",
    whatsapp: "Поделиться в WhatsApp",
  },
  dashboard: {
    title: "Мои приглашения",
    empty: "Приглашений пока нет",
    createNew: "Создать новое",
    status: { draft: "Черновик", paid: "Оплачено" },
  },
  styles: {
    floral: "Цветочный",
    islamic: "Исламский",
    uzbek: "Узбекский",
  },
  common: {
    customize: "Настроить",
    price: "150 000 сум",
    loading: "Загрузка...",
  },
}
```

`src/lib/i18n/en.ts`:
```typescript
import type { Strings } from './uz'

export const en: Strings = {
  nav: {
    templates: "Templates",
    dashboard: "My Invitations",
    createNew: "Create New",
  },
  hero: {
    headline: "Share Your Wedding",
    subheadline: "Beautiful animated e-invitations",
    cta: "Browse Templates",
  },
  howItWorks: {
    title: "How It Works",
    step1: { title: "Choose", desc: "Pick a template you love" },
    step2: { title: "Customize", desc: "Enter your wedding details" },
    step3: { title: "Share", desc: "Send the link to your guests" },
  },
  pricing: {
    title: "Pricing",
    price: "150,000 UZS",
    description: "One-time payment, permanent link",
    cta: "Get Started",
  },
  editor: {
    brideName: "Bride's name",
    groomName: "Groom's name",
    weddingDate: "Wedding date",
    weddingTime: "Wedding time",
    venueName: "Venue name",
    venueAddress: "Address",
    photo: "Couple photo (optional)",
    language: "Invitation language",
    saveDraft: "Save Draft",
    purchase: "Purchase",
    photoSizeError: "Photo must be under 800 KB",
  },
  checkout: {
    title: "Checkout",
    price: "150,000 UZS",
    pay: "Pay with Payme",
    summary: "Invitation details",
  },
  invitation: {
    download: "Download",
    copyLink: "Copy Link",
    linkCopied: "Copied!",
    whatsapp: "Share on WhatsApp",
  },
  dashboard: {
    title: "My Invitations",
    empty: "No invitations yet",
    createNew: "Create New",
    status: { draft: "Draft", paid: "Paid" },
  },
  styles: {
    floral: "Floral",
    islamic: "Islamic",
    uzbek: "Traditional Uzbek",
  },
  common: {
    customize: "Customize",
    price: "150,000 UZS",
    loading: "Loading...",
  },
}
```

- [ ] **Step 5: Write `src/lib/language-context.tsx`**

```typescript
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { uz, Strings } from './i18n/uz'
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
    if (stored && ['uz', 'ru', 'en'].includes(stored)) {
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
```

- [ ] **Step 6: Update `src/app/layout.tsx`**

```typescript
import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/lib/language-context'
import { Navbar } from '@/components/ui/Navbar'

export const metadata: Metadata = {
  title: 'Sening Toy — Wedding E-Invitations',
  description: 'Beautiful animated wedding e-invitations for Uzbekistan',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
        </LanguageProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add types, db layer, i18n strings, and language context"
```

---

## Task 3: Template Configs and Seed Data

**Files:**
- Create: `src/lib/templates/templateConfigs.ts`
- Modify: `data/templates.json`

- [ ] **Step 1: Write `src/lib/templates/templateConfigs.ts`**

```typescript
import type { TemplateConfig } from '@/types/template'

export const islamicTemplate: TemplateConfig = {
  id: 'islamic-gold',
  name: 'Gold Islamic',
  style: 'islamic',
  backgroundUrl: '/templates/islamic-bg.png',
  previewUrl: '/templates/islamic-bg.png',
  textFields: {
    brideName: {
      left: 400, top: 480, width: 600,
      fontSize: 48, fontFamily: 'Cormorant Garamond', fontWeight: '600',
      fill: '#C9A84C', textAlign: 'center', originX: 'center', originY: 'center',
    },
    groomName: {
      left: 400, top: 400, width: 600,
      fontSize: 48, fontFamily: 'Cormorant Garamond', fontWeight: '600',
      fill: '#C9A84C', textAlign: 'center', originX: 'center', originY: 'center',
    },
    date: {
      left: 400, top: 600, width: 400,
      fontSize: 24, fontFamily: 'Cormorant Garamond',
      fill: '#E8C97A', textAlign: 'center', originX: 'center', originY: 'center',
    },
    time: {
      left: 400, top: 640, width: 300,
      fontSize: 20, fontFamily: 'Jost',
      fill: '#E8C97A', textAlign: 'center', originX: 'center', originY: 'center',
    },
    venue: {
      left: 400, top: 700, width: 500,
      fontSize: 22, fontFamily: 'Cormorant Garamond',
      fill: '#FAF6F0', textAlign: 'center', originX: 'center', originY: 'center',
    },
    address: {
      left: 400, top: 740, width: 500,
      fontSize: 16, fontFamily: 'Jost',
      fill: '#FAF6F0', textAlign: 'center', originX: 'center', originY: 'center',
    },
  },
  photoArea: { left: 260, top: 100, width: 280, height: 280, clipShape: 'circle' },
  decorativeElements: [
    {
      type: 'text',
      content: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم',
      left: 400, top: 40,
      fontSize: 22, fontFamily: 'serif', fill: '#C9A84C',
    },
  ],
}

export const floralTemplate: TemplateConfig = {
  id: 'classic-floral',
  name: 'Classic Floral',
  style: 'floral',
  backgroundUrl: '/templates/floral-bg.png',
  previewUrl: '/templates/floral-bg.png',
  textFields: {
    brideName: {
      left: 400, top: 520, width: 600,
      fontSize: 52, fontFamily: 'Cormorant Garamond', fontWeight: '300',
      fill: '#8B3A52', textAlign: 'center', originX: 'center', originY: 'center',
    },
    groomName: {
      left: 400, top: 440, width: 600,
      fontSize: 52, fontFamily: 'Cormorant Garamond', fontWeight: '300',
      fill: '#8B3A52', textAlign: 'center', originX: 'center', originY: 'center',
    },
    date: {
      left: 400, top: 620, width: 400,
      fontSize: 24, fontFamily: 'Cormorant Garamond',
      fill: '#C9A84C', textAlign: 'center', originX: 'center', originY: 'center',
    },
    time: {
      left: 400, top: 660, width: 300,
      fontSize: 18, fontFamily: 'Jost',
      fill: '#3D2B1F', textAlign: 'center', originX: 'center', originY: 'center',
    },
    venue: {
      left: 400, top: 720, width: 500,
      fontSize: 22, fontFamily: 'Cormorant Garamond',
      fill: '#3D2B1F', textAlign: 'center', originX: 'center', originY: 'center',
    },
    address: {
      left: 400, top: 758, width: 500,
      fontSize: 15, fontFamily: 'Jost',
      fill: '#3D2B1F', textAlign: 'center', originX: 'center', originY: 'center',
    },
  },
  photoArea: { left: 520, top: 80, width: 220, height: 280, clipShape: 'rect' },
  decorativeElements: [
    { type: 'line', left: 150, top: 480, width: 500, stroke: '#C9A84C', strokeWidth: 1 },
  ],
}

export const uzbekTemplate: TemplateConfig = {
  id: 'traditional-uzbek',
  name: 'Traditional Uzbek',
  style: 'uzbek',
  backgroundUrl: '/templates/uzbek-bg.png',
  previewUrl: '/templates/uzbek-bg.png',
  textFields: {
    brideName: {
      left: 400, top: 520, width: 600,
      fontSize: 50, fontFamily: 'Cormorant Garamond', fontWeight: '600',
      fill: '#E8C97A', textAlign: 'center', originX: 'center', originY: 'center',
    },
    groomName: {
      left: 400, top: 440, width: 600,
      fontSize: 50, fontFamily: 'Cormorant Garamond', fontWeight: '600',
      fill: '#E8C97A', textAlign: 'center', originX: 'center', originY: 'center',
    },
    date: {
      left: 400, top: 620, width: 400,
      fontSize: 26, fontFamily: 'Cormorant Garamond',
      fill: '#FAF6F0', textAlign: 'center', originX: 'center', originY: 'center',
    },
    time: {
      left: 400, top: 660, width: 300,
      fontSize: 18, fontFamily: 'Jost',
      fill: '#FAF6F0', textAlign: 'center', originX: 'center', originY: 'center',
    },
    venue: {
      left: 400, top: 720, width: 500,
      fontSize: 22, fontFamily: 'Cormorant Garamond',
      fill: '#FAF6F0', textAlign: 'center', originX: 'center', originY: 'center',
    },
    address: {
      left: 400, top: 758, width: 500,
      fontSize: 15, fontFamily: 'Jost',
      fill: '#FAF6F0', textAlign: 'center', originX: 'center', originY: 'center',
    },
  },
  decorativeElements: [
    { type: 'line', left: 100, top: 390, width: 600, stroke: '#E8C97A', strokeWidth: 1 },
    { type: 'line', left: 100, top: 580, width: 600, stroke: '#E8C97A', strokeWidth: 1 },
  ],
}

export const templateConfigs: TemplateConfig[] = [
  islamicTemplate,
  floralTemplate,
  uzbekTemplate,
]

export function getTemplateById(id: string): TemplateConfig | undefined {
  return templateConfigs.find(t => t.id === id)
}
```

- [ ] **Step 2: Write seed data to `data/templates.json`**

```json
[
  {
    "id": "islamic-gold",
    "name": "Gold Islamic",
    "style": "islamic",
    "backgroundUrl": "/templates/islamic-bg.png",
    "previewUrl": "/templates/islamic-bg.png",
    "isActive": true
  },
  {
    "id": "classic-floral",
    "name": "Classic Floral",
    "style": "floral",
    "backgroundUrl": "/templates/floral-bg.png",
    "previewUrl": "/templates/floral-bg.png",
    "isActive": true
  },
  {
    "id": "traditional-uzbek",
    "name": "Traditional Uzbek",
    "style": "uzbek",
    "backgroundUrl": "/templates/uzbek-bg.png",
    "previewUrl": "/templates/uzbek-bg.png",
    "isActive": true
  }
]
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add template configs and seed data"
```

---

## Task 4: API Routes

**Files:**
- Create: `src/app/api/templates/route.ts`
- Create: `src/app/api/invitations/route.ts`
- Create: `src/app/api/invitations/[id]/route.ts`

- [ ] **Step 1: Write `src/app/api/templates/route.ts`**

```typescript
import { NextResponse } from 'next/server'
import { templateConfigs } from '@/lib/templates/templateConfigs'

export async function GET() {
  return NextResponse.json(templateConfigs)
}
```

Note: templates are served from the in-memory `templateConfigs` — no file read needed since templates never change at runtime.

- [ ] **Step 2: Write `src/app/api/invitations/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { readJson, writeJson } from '@/lib/db'
import { templateConfigs } from '@/lib/templates/templateConfigs'
import type { Invitation } from '@/types/invitation'

export async function GET() {
  const invitations = await readJson<Invitation[]>('invitations.json')
  return NextResponse.json(invitations)
}

export async function POST(req: NextRequest) {
  const body = await req.json() as Omit<Invitation, 'id' | 'createdAt' | 'updatedAt' | 'status'>

  const templateExists = templateConfigs.some(t => t.id === body.templateId)
  if (!templateExists) {
    return NextResponse.json({ error: 'Invalid templateId' }, { status: 400 })
  }

  const now = new Date().toISOString()
  const invitation: Invitation = {
    ...body,
    id: randomUUID(),
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  }

  const invitations = await readJson<Invitation[]>('invitations.json')
  invitations.push(invitation)
  await writeJson('invitations.json', invitations)

  return NextResponse.json(invitation, { status: 201 })
}
```

- [ ] **Step 3: Write `src/app/api/invitations/[id]/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { readJson, writeJson } from '@/lib/db'
import type { Invitation } from '@/types/invitation'

interface Params { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  const invitations = await readJson<Invitation[]>('invitations.json')
  const invitation = invitations.find(i => i.id === params.id)
  if (!invitation) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(invitation)
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const body = await req.json() as Partial<Invitation>
  const invitations = await readJson<Invitation[]>('invitations.json')
  const index = invitations.findIndex(i => i.id === params.id)
  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const updated: Invitation = {
    ...invitations[index]!,
    ...body,
    id: params.id,
    updatedAt: new Date().toISOString(),
  }

  invitations[index] = updated
  await writeJson('invitations.json', invitations)
  return NextResponse.json(updated)
}
```

- [ ] **Step 4: Test the API routes manually**

Start dev server: `npm run dev`

```bash
# GET templates
curl http://localhost:3000/api/templates

# POST invitation
curl -X POST http://localhost:3000/api/invitations \
  -H "Content-Type: application/json" \
  -d '{"templateId":"islamic-gold","brideName":"Zulfiya","groomName":"Jahongir","weddingDate":"2026-09-15","weddingTime":"16:00","venueName":"Mirzo Banquet Hall","language":"uz"}'

# Should return 201 with invitation object including generated id

# GET all invitations
curl http://localhost:3000/api/invitations

# GET invalid templateId
curl -X POST http://localhost:3000/api/invitations \
  -H "Content-Type: application/json" \
  -d '{"templateId":"invalid"}'
# Expected: 400 { "error": "Invalid templateId" }
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add API routes for templates and invitations CRUD"
```

---

## Task 5: Base UI Components

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Input.tsx`
- Create: `src/components/ui/Select.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/LanguageToggle.tsx`
- Create: `src/components/ui/Navbar.tsx`

- [ ] **Step 1: Write `src/components/ui/Button.tsx`**

```typescript
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-body font-medium tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-gold text-dark hover:bg-gold-light active:scale-95': variant === 'primary',
            'border border-gold text-gold hover:bg-gold/10 active:scale-95': variant === 'secondary',
            'text-brand-text hover:text-gold underline-offset-4 hover:underline': variant === 'ghost',
          },
          {
            'text-sm px-4 py-2 rounded': size === 'sm',
            'text-base px-6 py-3 rounded-sm': size === 'md',
            'text-lg px-8 py-4 rounded-sm tracking-wider': size === 'lg',
          },
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
```

Add `src/lib/utils.ts`:
```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Install: `npm install clsx tailwind-merge`

- [ ] **Step 2: Write `src/components/ui/Input.tsx`**

```typescript
import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-body text-brand-text/70 tracking-wide">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'bg-white/60 border border-gold/30 rounded px-3 py-2.5 text-brand-text font-body text-sm placeholder:text-brand-text/40 focus:outline-none focus:border-gold transition-colors',
          error && 'border-red-400',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'
```

- [ ] **Step 3: Write `src/components/ui/Select.tsx`**

```typescript
import { SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-body text-brand-text/70 tracking-wide">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          'bg-white/60 border border-gold/30 rounded px-3 py-2.5 text-brand-text font-body text-sm focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer',
          className,
        )}
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
)
Select.displayName = 'Select'
```

- [ ] **Step 4: Write `src/components/ui/Badge.tsx`**

```typescript
import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'draft' | 'paid' | 'style'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'style', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-body font-medium tracking-wide',
        {
          'bg-amber-100 text-amber-800': variant === 'draft',
          'bg-emerald-100 text-emerald-800': variant === 'paid',
          'bg-gold/15 text-gold border border-gold/30': variant === 'style',
        },
        className,
      )}
    >
      {children}
    </span>
  )
}
```

- [ ] **Step 5: Write `src/components/ui/LanguageToggle.tsx`**

```typescript
'use client'
import { useLanguage } from '@/lib/language-context'

const langs = [
  { code: 'uz', label: "O'z" },
  { code: 'ru', label: 'Рус' },
  { code: 'en', label: 'En' },
] as const

export function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  return (
    <div className="flex items-center gap-0.5 rounded border border-gold/30 overflow-hidden">
      {langs.map(l => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`px-2.5 py-1 text-xs font-body font-medium transition-colors ${
            lang === l.code
              ? 'bg-gold text-dark'
              : 'text-brand-text/60 hover:text-gold'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 6: Write `src/components/ui/Navbar.tsx`**

```typescript
'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { LanguageToggle } from './LanguageToggle'
import { Button } from './Button'

export function Navbar() {
  const { t } = useLanguage()
  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-cream/80 border-b border-gold/10">
      <Link href="/" className="font-display text-xl text-dark tracking-wide">
        sening<span className="text-gold">·</span>toy
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/templates" className="font-body text-sm text-brand-text/70 hover:text-gold transition-colors">
          {t.nav.templates}
        </Link>
        <Link href="/dashboard" className="font-body text-sm text-brand-text/70 hover:text-gold transition-colors">
          {t.nav.dashboard}
        </Link>
        <LanguageToggle />
        <Link href="/templates">
          <Button size="sm">{t.nav.createNew}</Button>
        </Link>
      </div>
    </nav>
  )
}
```

- [ ] **Step 7: Verify dev server renders navbar with language toggle**

`npm run dev` → open http://localhost:3000 → navbar visible, language toggle switches UZ/RU/EN.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add base UI components (Button, Input, Select, Badge, Navbar, LanguageToggle)"
```

---

## Task 6: Canvas Components — `useCanvas` and `useGSAPAnimations`

**Files:**
- Create: `src/components/canvas/useCanvas.ts`
- Create: `src/components/canvas/useGSAPAnimations.ts`
- Create: `src/components/canvas/InvitationCanvas.tsx`

- [ ] **Step 1: Write `src/components/canvas/useGSAPAnimations.ts`**

```typescript
import { useCallback, useRef } from 'react'
import gsap from 'gsap'
import type { Canvas, Object as FabricObject } from 'fabric'

export function useGSAPAnimations(canvasRef: React.MutableRefObject<Canvas | null>) {
  const timelinesRef = useRef<gsap.core.Timeline[]>([])

  const killAll = useCallback(() => {
    timelinesRef.current.forEach(tl => tl.kill())
    timelinesRef.current = []
  }, [])

  // Animates a Fabric object property via a proxy, calling renderAll on each tick
  function animateObject(
    obj: FabricObject,
    fromVars: Record<string, number>,
    toVars: gsap.TweenVars,
  ) {
    const proxy = { ...fromVars }
    Object.assign(obj, fromVars)
    return gsap.to(proxy, {
      ...toVars,
      onUpdate() {
        Object.assign(obj, proxy)
        canvasRef.current?.renderAll()
      },
    })
  }

  const playEntrance = useCallback(
    (objectMap: Map<string, FabricObject>, decorObjects: FabricObject[]) => {
      if (!canvasRef.current) return
      killAll()

      const tl = gsap.timeline()
      timelinesRef.current.push(tl)

      const canvas = canvasRef.current
      const bg = canvas.backgroundImage as FabricObject | null

      // 1. Background fade
      if (bg) {
        const proxy = { opacity: 0 }
        bg.set('opacity', 0)
        tl.to(proxy, {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          onUpdate() { bg.set('opacity', proxy.opacity); canvas.renderAll() },
        })
      }

      // 2. Decorative elements slide in
      decorObjects.forEach((obj, i) => {
        const proxy = { opacity: 0, left: (obj.left ?? 0) - 30 }
        obj.set({ opacity: 0, left: proxy.left })
        tl.to(proxy, {
          opacity: 1,
          left: (obj.left ?? 0) + 30,
          duration: 0.5,
          ease: 'power2.out',
          delay: i * 0.15,
          onUpdate() { obj.set({ opacity: proxy.opacity, left: proxy.left }); canvas.renderAll() },
        }, '-=0.3')
      })

      // 3. Groom name fades up
      const groom = objectMap.get('groomName')
      if (groom) {
        const origTop = groom.top ?? 0
        const proxy = { opacity: 0, top: origTop + 20 }
        groom.set({ opacity: 0, top: proxy.top })
        tl.to(proxy, {
          opacity: 1, top: origTop, duration: 0.6, ease: 'power2.out',
          onUpdate() { groom.set({ opacity: proxy.opacity, top: proxy.top }); canvas.renderAll() },
        })
      }

      // 4. Divider line (first line in decorObjects)
      // (already handled above via decorObjects)

      // 5. Bride name fades up
      const bride = objectMap.get('brideName')
      if (bride) {
        const origTop = bride.top ?? 0
        const proxy = { opacity: 0, top: origTop + 20 }
        bride.set({ opacity: 0, top: proxy.top })
        tl.to(proxy, {
          opacity: 1, top: origTop, duration: 0.6, ease: 'power2.out',
          onUpdate() { bride.set({ opacity: proxy.opacity, top: proxy.top }); canvas.renderAll() },
        }, '-=0.3')
      }

      // 6. Date and venue fade in
      const dateObj = objectMap.get('date')
      const venueObj = objectMap.get('venue')
      ;[dateObj, venueObj].filter(Boolean).forEach((obj, i) => {
        const proxy = { opacity: 0 }
        obj!.set('opacity', 0)
        tl.to(proxy, {
          opacity: 1, duration: 0.5, delay: i * 0.2,
          onUpdate() { obj!.set('opacity', proxy.opacity); canvas.renderAll() },
        }, '-=0.2')
      })

      return tl
    },
    [canvasRef, killAll],
  )

  return { playEntrance, killAll }
}
```

- [ ] **Step 2: Write `src/components/canvas/useCanvas.ts`**

```typescript
import { useEffect, useRef, useCallback } from 'react'
import { Canvas, IText, Line, FabricImage, FabricObject } from 'fabric'
import type { TemplateConfig, DecorativeElement } from '@/types/template'
import type { Invitation } from '@/types/invitation'

export interface UseCanvasReturn {
  objectMap: Map<string, FabricObject>
  decorObjects: FabricObject[]
  exportPNG: () => string
}

export function useCanvas(
  canvasEl: HTMLCanvasElement | null,
  template: TemplateConfig,
  data: Partial<Invitation>,
  isPurchased: boolean,
  onReady?: (result: UseCanvasReturn) => void,
) {
  const fabricRef = useRef<Canvas | null>(null)
  const objectMapRef = useRef<Map<string, FabricObject>>(new Map())
  const decorObjectsRef = useRef<FabricObject[]>([])

  // Init canvas
  useEffect(() => {
    if (!canvasEl) return

    const canvas = new Canvas(canvasEl, {
      width: 800,
      height: 1000,
      selection: false,
      renderOnAddRemove: false,
    })
    fabricRef.current = canvas

    async function setup() {
      // 1. Load background
      const bg = await FabricImage.fromURL(template.backgroundUrl, { crossOrigin: 'anonymous' })
      bg.scaleToWidth(800)
      bg.scaleToHeight(1000)
      canvas.set('backgroundImage', bg)

      // 2. Add text fields
      const map = new Map<string, FabricObject>()
      const fields = template.textFields as Record<string, typeof template.textFields.brideName>

      for (const [key, cfg] of Object.entries(fields)) {
        if (!cfg) continue
        const text = new IText(getFieldValue(data, key as keyof typeof template.textFields), {
          left: cfg.left,
          top: cfg.top,
          width: cfg.width,
          fontSize: cfg.fontSize,
          fontFamily: cfg.fontFamily,
          fontWeight: cfg.fontWeight ?? 'normal',
          fill: cfg.fill,
          textAlign: cfg.textAlign ?? 'left',
          originX: cfg.originX ?? 'left',
          originY: cfg.originY ?? 'top',
          selectable: false,
          evented: false,
        })
        canvas.add(text)
        map.set(key, text)
      }
      objectMapRef.current = map

      // 3. Add decorative elements
      const decors: FabricObject[] = []
      for (const el of template.decorativeElements ?? []) {
        const obj = buildDecorElement(el)
        canvas.add(obj)
        decors.push(obj)
      }
      decorObjectsRef.current = decors

      // 4. Photo
      if (data.photoUrl && template.photoArea) {
        await addPhoto(canvas, data.photoUrl, template.photoArea)
      }

      // 5. Watermark
      if (!isPurchased) {
        addWatermark(canvas)
      }

      canvas.renderAll()
      onReady?.({
        objectMap: map,
        decorObjects: decors,
        exportPNG: () => canvas.toDataURL({ format: 'png', multiplier: 1 }),
      })
    }

    setup()

    return () => {
      canvas.dispose()
      fabricRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasEl, template.id, isPurchased])

  // Live update text fields when data changes
  const updateField = useCallback((key: string, value: string) => {
    const obj = objectMapRef.current.get(key) as IText | undefined
    if (obj) {
      obj.set('text', value)
      fabricRef.current?.renderAll()
    }
  }, [])

  useEffect(() => {
    updateField('brideName', data.brideName ?? '')
    updateField('groomName', data.groomName ?? '')
    updateField('date', data.weddingDate ?? '')
    updateField('time', data.weddingTime ?? '')
    updateField('venue', data.venueName ?? '')
    updateField('address', data.venueAddress ?? '')
  }, [data.brideName, data.groomName, data.weddingDate, data.weddingTime, data.venueName, data.venueAddress, updateField])

  return { fabricRef, objectMapRef, decorObjectsRef }
}

// ---- Helpers ----

function getFieldValue(data: Partial<Invitation>, key: keyof typeof data): string {
  const map: Record<string, keyof Invitation> = {
    brideName: 'brideName',
    groomName: 'groomName',
    date: 'weddingDate',
    time: 'weddingTime',
    venue: 'venueName',
    address: 'venueAddress',
  }
  const field = map[key]
  return field ? String(data[field] ?? '') : ''
}

function buildDecorElement(el: DecorativeElement): FabricObject {
  if (el.type === 'text') {
    return new IText(el.content, {
      left: el.left,
      top: el.top,
      fontSize: el.fontSize,
      fontFamily: el.fontFamily,
      fontWeight: el.fontWeight ?? 'normal',
      fill: el.fill,
      selectable: false,
      evented: false,
      originX: 'center',
    })
  }
  // line
  return new Line([el.left, el.top, el.left + el.width, el.top], {
    stroke: el.stroke,
    strokeWidth: el.strokeWidth ?? 1,
    selectable: false,
    evented: false,
  })
}

async function addPhoto(
  canvas: Canvas,
  photoUrl: string,
  area: NonNullable<TemplateConfig['photoArea']>,
) {
  const img = await FabricImage.fromURL(photoUrl)
  img.scaleToWidth(area.width)
  img.scaleToHeight(area.height)
  img.set({ left: area.left, top: area.top, selectable: false, evented: false })

  if (area.clipShape === 'circle') {
    const { Circle } = await import('fabric')
    const radius = Math.min(area.width, area.height) / 2
    img.clipPath = new Circle({
      radius,
      left: -radius,
      top: -radius,
      originX: 'left',
      originY: 'top',
    })
  }

  canvas.add(img)
}

function addWatermark(canvas: Canvas) {
  const text = new IText('sening-toy.uz', {
    left: 400,
    top: 500,
    fontSize: 36,
    fontFamily: 'Jost',
    fill: 'rgba(255,255,255,0.18)',
    angle: -30,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
  })
  canvas.add(text)
}
```

- [ ] **Step 3: Write `src/components/canvas/InvitationCanvas.tsx`**

```typescript
'use client'

import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react'
import { useCanvas } from './useCanvas'
import { useGSAPAnimations } from './useGSAPAnimations'
import type { TemplateConfig } from '@/types/template'
import type { Invitation, InvitationCanvasHandle } from '@/types/invitation'

interface Props {
  template: TemplateConfig
  data: Partial<Invitation>
  isPurchased?: boolean
  autoplay?: boolean
}

export const InvitationCanvas = forwardRef<InvitationCanvasHandle, Props>(
  ({ template, data, isPurchased = false, autoplay = false }, ref) => {
    const canvasElRef = useRef<HTMLCanvasElement>(null)
    const exportRef = useRef<(() => string) | null>(null)
    const fabricRef2 = useRef(null)

    const { fabricRef, objectMapRef, decorObjectsRef } = useCanvas(
      canvasElRef.current,
      template,
      data,
      isPurchased,
      ({ objectMap, decorObjects, exportPNG }) => {
        exportRef.current = exportPNG
        if (autoplay) {
          playEntrance(objectMap, decorObjects)
        }
      },
    )

    const { playEntrance, killAll } = useGSAPAnimations(fabricRef)

    useImperativeHandle(ref, () => ({
      exportPNG: () => exportRef.current?.() ?? '',
    }))

    // Clean up GSAP on unmount
    useEffect(() => () => killAll(), [killAll])

    return (
      <div
        className="canvas-wrapper relative"
        style={{ width: '100%', paddingBottom: '125%' /* 800:1000 ratio */ }}
      >
        <div className="absolute inset-0 flex items-start justify-start overflow-hidden">
          <canvas
            ref={canvasElRef}
            style={{
              transformOrigin: 'top left',
              // Scaling handled by parent container — JS sets scale on mount
            }}
          />
        </div>
      </div>
    )
  }
)
InvitationCanvas.displayName = 'InvitationCanvas'
```

Note on canvas scaling: Add a `useEffect` in `InvitationCanvas` to compute and apply `transform: scale()`:

```typescript
useEffect(() => {
  const el = canvasElRef.current
  if (!el) return
  const wrapper = el.parentElement
  if (!wrapper) return

  function applyScale() {
    const containerWidth = wrapper!.offsetWidth
    const scale = containerWidth / 800
    el!.style.transform = `scale(${scale})`
    // Set wrapper height to match scaled canvas
    wrapper!.style.height = `${1000 * scale}px`
  }

  applyScale()
  const ro = new ResizeObserver(applyScale)
  ro.observe(wrapper)
  return () => ro.disconnect()
}, [])
```

- [ ] **Step 4: Smoke-test canvas with hardcoded template**

Create a temporary test page `src/app/canvas-test/page.tsx`:
```typescript
'use client'
import { InvitationCanvas } from '@/components/canvas/InvitationCanvas'
import { islamicTemplate } from '@/lib/templates/templateConfigs'

export default function CanvasTest() {
  return (
    <div className="p-8 max-w-lg mx-auto mt-20">
      <InvitationCanvas
        template={islamicTemplate}
        data={{ brideName: 'Zulfiya', groomName: 'Jahongir', weddingDate: '2026-09-15', weddingTime: '16:00', venueName: 'Mirzo Banquet' }}
        autoplay
      />
    </div>
  )
}
```

Visit http://localhost:3000/canvas-test — should show navy canvas with gold names and GSAP entrance animation.

- [ ] **Step 5: Delete test page, commit**

```bash
rm src/app/canvas-test/page.tsx
git add -A
git commit -m "feat: add InvitationCanvas with useCanvas and useGSAPAnimations"
```

---

## Task 7: Editor Form and Live Canvas Wiring

**Files:**
- Create: `src/components/editor/EditorForm.tsx`
- Create: `src/app/editor/[templateId]/page.tsx`

- [ ] **Step 1: Write `src/components/editor/EditorForm.tsx`**

```typescript
'use client'

import { useState, ChangeEvent } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/lib/language-context'
import type { Invitation } from '@/types/invitation'

type InvitationFormData = Pick<
  Invitation,
  'brideName' | 'groomName' | 'weddingDate' | 'weddingTime' | 'venueName' | 'venueAddress' | 'language'
> & { photoFile?: File; photoUrl?: string }

interface Props {
  initialData?: Partial<InvitationFormData>
  onDataChange: (data: InvitationFormData) => void
  onSave: (data: InvitationFormData) => Promise<void>
  onPurchase: () => void
  isSaving?: boolean
}

export function EditorForm({ initialData, onDataChange, onSave, onPurchase, isSaving }: Props) {
  const { t } = useLanguage()
  const [data, setData] = useState<InvitationFormData>({
    brideName: initialData?.brideName ?? '',
    groomName: initialData?.groomName ?? '',
    weddingDate: initialData?.weddingDate ?? '',
    weddingTime: initialData?.weddingTime ?? '',
    venueName: initialData?.venueName ?? '',
    venueAddress: initialData?.venueAddress ?? '',
    language: initialData?.language ?? 'uz',
    photoUrl: initialData?.photoUrl,
  })
  const [photoError, setPhotoError] = useState<string>('')

  function update<K extends keyof InvitationFormData>(key: K, value: InvitationFormData[K]) {
    const next = { ...data, [key]: value }
    setData(next)
    onDataChange(next)
  }

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 800 * 1024) {
      setPhotoError(t.editor.photoSizeError)
      return
    }
    setPhotoError('')
    const reader = new FileReader()
    reader.onload = (ev) => {
      const url = ev.target?.result as string
      update('photoUrl', url)
    }
    reader.readAsDataURL(file)
  }

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={e => { e.preventDefault(); onSave(data) }}
    >
      <Input
        label={t.editor.groomName}
        value={data.groomName}
        onChange={e => update('groomName', e.target.value)}
        maxLength={80}
        required
      />
      <Input
        label={t.editor.brideName}
        value={data.brideName}
        onChange={e => update('brideName', e.target.value)}
        maxLength={80}
        required
      />
      <Input
        label={t.editor.weddingDate}
        type="date"
        value={data.weddingDate}
        onChange={e => update('weddingDate', e.target.value)}
        required
      />
      <Input
        label={t.editor.weddingTime}
        type="time"
        value={data.weddingTime}
        onChange={e => update('weddingTime', e.target.value)}
        required
      />
      <Input
        label={t.editor.venueName}
        value={data.venueName}
        onChange={e => update('venueName', e.target.value)}
        maxLength={120}
        required
      />
      <Input
        label={t.editor.venueAddress}
        value={data.venueAddress ?? ''}
        onChange={e => update('venueAddress', e.target.value)}
        maxLength={200}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-body text-brand-text/70 tracking-wide">
          {t.editor.photo}
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={handlePhotoChange}
          className="text-sm font-body text-brand-text/60"
        />
        {photoError && <p className="text-xs text-red-500">{photoError}</p>}
        {data.photoUrl && (
          <img src={data.photoUrl} alt="preview" className="mt-2 w-20 h-20 object-cover rounded" />
        )}
      </div>

      <Select
        label={t.editor.language}
        value={data.language}
        onChange={e => update('language', e.target.value as Invitation['language'])}
        options={[
          { value: 'uz', label: "O'zbek" },
          { value: 'ru', label: 'Русский' },
          { value: 'en', label: 'English' },
        ]}
      />

      <div className="flex flex-col gap-3 pt-4 border-t border-gold/20">
        <Button type="submit" variant="secondary" disabled={isSaving}>
          {isSaving ? t.common.loading : t.editor.saveDraft}
        </Button>
        <Button type="button" variant="primary" onClick={onPurchase}>
          {t.editor.purchase}
        </Button>
      </div>
    </form>
  )
}
```

- [ ] **Step 2: Write `src/app/editor/[templateId]/page.tsx`**

```typescript
'use client'

import { useRef, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { InvitationCanvas } from '@/components/canvas/InvitationCanvas'
import { EditorForm } from '@/components/editor/EditorForm'
import { getTemplateById } from '@/lib/templates/templateConfigs'
import type { InvitationCanvasHandle, Invitation } from '@/types/invitation'
import { notFound } from 'next/navigation'

type FormData = Partial<Pick<Invitation,
  'brideName' | 'groomName' | 'weddingDate' | 'weddingTime' |
  'venueName' | 'venueAddress' | 'language' | 'photoUrl'
>>

export default function EditorPage() {
  const { templateId } = useParams<{ templateId: string }>()
  const router = useRouter()
  const template = getTemplateById(templateId)
  if (!template) notFound()

  const canvasRef = useRef<InvitationCanvasHandle>(null)
  const [formData, setFormData] = useState<FormData>({})
  const [invitationId, setInvitationId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = useCallback(async (data: FormData) => {
    setIsSaving(true)
    try {
      // Capture Fabric canvas JSON for draft restore
      const fabricCanvas = fabricRef.current
      const canvasJson = fabricCanvas ? JSON.stringify(fabricCanvas.toJSON()) : undefined
      const payload = { ...data, templateId, canvasJson }

      let result: Invitation
      if (invitationId) {
        const res = await fetch(`/api/invitations/${invitationId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        result = await res.json()
      } else {
        const res = await fetch('/api/invitations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            templateId,
            status: 'draft',
          }),
        })
        result = await res.json()
        setInvitationId(result.id)
      }
    } finally {
      setIsSaving(false)
    }
  }, [invitationId, templateId])

  const handlePurchase = useCallback(async () => {
    if (!invitationId) {
      alert('Please save your draft first.')
      return
    }
    router.push(`/checkout/${invitationId}`)
  }, [invitationId, router])

  return (
    <div className="min-h-screen pt-20 bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left: form */}
        <div className="lg:w-80 shrink-0">
          <h1 className="font-display text-2xl text-dark mb-6">{template.name}</h1>
          <EditorForm
            onDataChange={setFormData}
            onSave={handleSave}
            onPurchase={handlePurchase}
            isSaving={isSaving}
          />
        </div>

        {/* Right: canvas */}
        <div className="flex-1 max-w-lg">
          <InvitationCanvas
            ref={canvasRef}
            template={template}
            data={formData}
            isPurchased={false}
            autoplay
          />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify live update works**

Visit `http://localhost:3000/editor/islamic-gold` — type in bride/groom name fields — canvas text updates in real time without full re-render.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add editor page with EditorForm and live canvas wiring"
```

---

## Task 8: Template Gallery Page

**Files:**
- Create: `src/components/templates/TemplateCard.tsx`
- Create: `src/components/templates/TemplateGrid.tsx`
- Create: `src/app/(public)/templates/page.tsx`

- [ ] **Step 1: Write `src/components/templates/TemplateCard.tsx`**

```typescript
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/lib/language-context'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { TemplateConfig } from '@/types/template'

interface Props { template: TemplateConfig }

export function TemplateCard({ template }: Props) {
  const { t } = useLanguage()
  return (
    <div className="group relative flex flex-col rounded-sm overflow-hidden border border-gold/20 bg-white/40 backdrop-blur-sm transition-all duration-300 hover:border-gold/50 hover:shadow-[0_8px_30px_rgb(201,168,76,0.15)]">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={template.previewUrl}
          alt={template.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg text-dark">{template.name}</h3>
          <Badge variant="style">{t.styles[template.style]}</Badge>
        </div>
        <p className="font-body text-sm text-brand-text/60">{t.common.price}</p>
        <Link href={`/editor/${template.id}`}>
          <Button variant="primary" size="sm" className="w-full">{t.common.customize}</Button>
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write `src/components/templates/TemplateGrid.tsx`**

```typescript
'use client'
import { useState } from 'react'
import { TemplateCard } from './TemplateCard'
import { useLanguage } from '@/lib/language-context'
import type { TemplateConfig } from '@/types/template'

type Style = TemplateConfig['style'] | 'all'

interface Props { templates: TemplateConfig[] }

export function TemplateGrid({ templates }: Props) {
  const { t } = useLanguage()
  const [filter, setFilter] = useState<Style>('all')

  const filters: { value: Style; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'islamic', label: t.styles.islamic },
    { value: 'floral', label: t.styles.floral },
    { value: 'uzbek', label: t.styles.uzbek },
  ]

  const visible = filter === 'all' ? templates : templates.filter(t => t.style === filter)

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-body transition-all ${
              filter === f.value
                ? 'bg-gold text-dark'
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
    </div>
  )
}
```

- [ ] **Step 3: Write `src/app/(public)/templates/page.tsx`**

```typescript
import { templateConfigs } from '@/lib/templates/templateConfigs'
import { TemplateGrid } from '@/components/templates/TemplateGrid'

export default function TemplatesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-cream">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-10">
          <h1 className="font-display text-4xl md:text-5xl text-dark mb-3">Templates</h1>
          <p className="font-body text-brand-text/60">Choose a design for your wedding invitation</p>
        </div>
        <TemplateGrid templates={templateConfigs} />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify**

Visit `http://localhost:3000/templates` — 3 cards shown, filter buttons work, "Customize" navigates to editor.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add template gallery with filter"
```

---

## Task 9: Landing Page

**Files:**
- Create: `src/components/landing/Hero.tsx`
- Create: `src/components/landing/HowItWorks.tsx`
- Create: `src/components/landing/PricingSection.tsx`
- Modify: `src/app/(public)/page.tsx`

- [ ] **Step 1: Write `src/components/landing/Hero.tsx`**

```typescript
'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/lib/language-context'

export function Hero() {
  const { t } = useLanguage()
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 })
    tl.fromTo(headlineRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
      .fromTo(subRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .fromTo(ctaRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
    return () => { tl.kill() }
  }, [])

  return (
    <section
      ref={bgRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark"
    >
      {/* Subtle gold gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark to-[#1A1207] opacity-90" />

      {/* Floating gold particles (CSS) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-gold rounded-full opacity-20"
            style={{
              left: `${(i * 17 + 5) % 100}%`,
              top: `${(i * 23 + 10) % 100}%`,
              boxShadow: '0 0 6px 2px rgba(201,168,76,0.4)',
              animation: `float ${3 + (i % 4)}s ease-in-out ${i * 0.3}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <p className="font-body text-gold text-sm tracking-[0.3em] uppercase mb-6">
          sening·toy
        </p>
        <h1 ref={headlineRef} className="font-display text-5xl md:text-7xl text-cream leading-tight mb-6">
          {t.hero.headline}
        </h1>
        <p ref={subRef} className="font-body text-cream/60 text-lg md:text-xl mb-10">
          {t.hero.subheadline}
        </p>
        <div ref={ctaRef}>
          <Link href="/templates">
            <Button size="lg">{t.hero.cta}</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
```

Add the CSS animation to `globals.css`:
```css
@keyframes float {
  from { transform: translateY(0px) scale(1); }
  to { transform: translateY(-20px) scale(1.5); }
}
```

- [ ] **Step 2: Write `src/components/landing/HowItWorks.tsx`**

```typescript
'use client'
import { useLanguage } from '@/lib/language-context'

const icons = ['01', '02', '03']

export function HowItWorks() {
  const { t } = useLanguage()
  const steps = [t.howItWorks.step1, t.howItWorks.step2, t.howItWorks.step3]

  return (
    <section className="py-24 bg-cream">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="font-display text-4xl md:text-5xl text-dark text-center mb-16">
          {t.howItWorks.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full border border-gold/40 flex items-center justify-center">
                <span className="font-display text-gold text-xl">{icons[i]}</span>
              </div>
              <h3 className="font-display text-2xl text-dark">{step.title}</h3>
              <p className="font-body text-brand-text/60 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Write `src/components/landing/PricingSection.tsx`**

```typescript
'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { Button } from '@/components/ui/Button'

export function PricingSection() {
  const { t } = useLanguage()
  return (
    <section className="py-24 bg-dark">
      <div className="max-w-md mx-auto px-4 text-center">
        <h2 className="font-display text-4xl md:text-5xl text-cream mb-12">{t.pricing.title}</h2>
        <div className="border border-gold/30 rounded-sm p-10 bg-white/5">
          <p className="font-display text-5xl text-gold mb-4">{t.pricing.price}</p>
          <p className="font-body text-cream/50 mb-10">{t.pricing.description}</p>
          <Link href="/templates">
            <Button size="lg">{t.pricing.cta}</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Write `src/app/(public)/page.tsx`**

```typescript
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { PricingSection } from '@/components/landing/PricingSection'
import { templateConfigs } from '@/lib/templates/templateConfigs'
import { TemplateGrid } from '@/components/templates/TemplateGrid'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <section className="py-24 bg-cream">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display text-4xl text-dark text-center mb-12">Templates</h2>
          <TemplateGrid templates={templateConfigs} />
        </div>
      </section>
      <PricingSection />
    </>
  )
}
```

- [ ] **Step 5: Verify**

Visit `http://localhost:3000` — hero animates on load, sections render, language toggle changes text.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add landing page with Hero, HowItWorks, PricingSection"
```

---

## Task 10: Checkout Page (Mocked Payment)

**Files:**
- Create: `src/app/checkout/[invitationId]/page.tsx`

- [ ] **Step 1: Write `src/app/checkout/[invitationId]/page.tsx`**

```typescript
import { notFound, redirect } from 'next/navigation'
import { readJson } from '@/lib/db'
import type { Invitation } from '@/types/invitation'
import { CheckoutClient } from './CheckoutClient'
import { getTemplateById } from '@/lib/templates/templateConfigs'

interface Props { params: { invitationId: string } }

export default async function CheckoutPage({ params }: Props) {
  const invitations = await readJson<Invitation[]>('invitations.json')
  const invitation = invitations.find(i => i.id === params.invitationId)
  if (!invitation) notFound()
  if (invitation.status === 'paid') redirect(`/invitation/${invitation.id}`)

  const template = getTemplateById(invitation.templateId)

  return <CheckoutClient invitation={invitation} templateName={template?.name ?? 'Unknown'} />
}
```

Create `src/app/checkout/[invitationId]/CheckoutClient.tsx`:
```typescript
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/lib/language-context'
import type { Invitation } from '@/types/invitation'

interface Props {
  invitation: Invitation
  templateName: string
}

export function CheckoutClient({ invitation, templateName }: Props) {
  const { t } = useLanguage()
  const router = useRouter()
  const [paying, setPaying] = useState(false)

  async function handlePay() {
    setPaying(true)
    const res = await fetch(`/api/invitations/${invitation.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'paid',
        paymentId: `mock_${Date.now()}`,
      }),
    })
    if (res.ok) {
      router.push(`/invitation/${invitation.id}`)
    } else {
      alert('Payment failed. Try again.')
      setPaying(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="font-display text-4xl text-dark mb-8">{t.checkout.title}</h1>

        <div className="border border-gold/20 rounded-sm p-6 mb-6 bg-white/40">
          <h2 className="font-body text-xs text-brand-text/50 uppercase tracking-widest mb-4">
            {t.checkout.summary}
          </h2>
          <div className="flex flex-col gap-2 font-body text-sm text-brand-text">
            <p><span className="text-brand-text/50">Template:</span> {templateName}</p>
            <p><span className="text-brand-text/50">Bride:</span> {invitation.brideName}</p>
            <p><span className="text-brand-text/50">Groom:</span> {invitation.groomName}</p>
            <p><span className="text-brand-text/50">Date:</span> {invitation.weddingDate}</p>
            <p><span className="text-brand-text/50">Venue:</span> {invitation.venueName}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <span className="font-body text-brand-text/60">Total</span>
          <span className="font-display text-3xl text-gold">{t.checkout.price}</span>
        </div>

        <Button onClick={handlePay} disabled={paying} size="lg" className="w-full">
          {paying ? t.common.loading : t.checkout.pay}
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify checkout flow**

1. Go to `/editor/islamic-gold`, fill in details, click "Save Draft"
2. Click "Purchase" → should navigate to `/checkout/[id]`
3. Click "Pay with Payme" → status set to paid → redirect to `/invitation/[id]` (404 for now, ok)

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add checkout page with mocked payment"
```

---

## Task 11: Shareable Invitation Page

**Files:**
- Create: `src/app/(public)/invitation/[id]/page.tsx`
- Create: `src/app/(public)/invitation/[id]/InvitationView.tsx`

- [ ] **Step 1: Write server page `src/app/(public)/invitation/[id]/page.tsx`**

```typescript
import { notFound } from 'next/navigation'
import { readJson } from '@/lib/db'
import type { Invitation } from '@/types/invitation'
import { getTemplateById } from '@/lib/templates/templateConfigs'
import { InvitationView } from './InvitationView'

interface Props { params: { id: string } }

export default async function InvitationPage({ params }: Props) {
  const invitations = await readJson<Invitation[]>('invitations.json')
  const invitation = invitations.find(i => i.id === params.id)
  if (!invitation) notFound()

  const template = getTemplateById(invitation.templateId)
  if (!template) notFound()

  return (
    <InvitationView
      invitation={invitation}
      template={template}
      isPurchased={invitation.status === 'paid'}
    />
  )
}
```

- [ ] **Step 2: Write `src/app/(public)/invitation/[id]/InvitationView.tsx`**

```typescript
'use client'
import { useRef, useState } from 'react'
import { InvitationCanvas } from '@/components/canvas/InvitationCanvas'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/lib/language-context'
import type { Invitation, InvitationCanvasHandle } from '@/types/invitation'
import type { TemplateConfig } from '@/types/template'

interface Props {
  invitation: Invitation
  template: TemplateConfig
  isPurchased: boolean
}

export function InvitationView({ invitation, template, isPurchased }: Props) {
  const { t } = useLanguage()
  const canvasRef = useRef<InvitationCanvasHandle>(null)
  const [copied, setCopied] = useState(false)

  function handleDownload() {
    const dataUrl = canvasRef.current?.exportPNG()
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `invitation-${invitation.id}.png`
    a.click()
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleWhatsApp() {
    const text = encodeURIComponent(
      `${invitation.groomName} & ${invitation.brideName} — ${invitation.weddingDate}\n${window.location.href}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <div className="min-h-screen pt-20 bg-dark flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-lg">
        <InvitationCanvas
          ref={canvasRef}
          template={template}
          data={invitation}
          isPurchased={isPurchased}
          autoplay
        />
      </div>

      <div className="flex flex-wrap gap-3 mt-8 justify-center">
        {isPurchased && (
          <Button variant="primary" onClick={handleDownload}>
            {t.invitation.download}
          </Button>
        )}
        <Button variant="secondary" onClick={handleCopyLink}>
          {copied ? t.invitation.linkCopied : t.invitation.copyLink}
        </Button>
        <Button variant="ghost" onClick={handleWhatsApp}>
          {t.invitation.whatsapp}
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify full flow**

1. Create invitation in editor → save → purchase → land on `/invitation/[id]`
2. Verify GSAP animation plays on load
3. Paid invitation: "Download" button visible, no watermark
4. Draft invitation (navigate directly): watermark visible, no download button

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add shareable invitation page with download and share"
```

---

## Task 12: Dashboard Page

**Files:**
- Create: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Write `src/app/dashboard/page.tsx`**

```typescript
import Link from 'next/link'
import { readJson } from '@/lib/db'
import type { Invitation } from '@/types/invitation'
import { getTemplateById } from '@/lib/templates/templateConfigs'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const invitations = await readJson<Invitation[]>('invitations.json')
  const sorted = [...invitations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="min-h-screen pt-24 pb-16 bg-cream">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-display text-4xl text-dark">My Invitations</h1>
          <Link href="/templates">
            <Button variant="primary">+ Create New</Button>
          </Link>
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-brand-text/40 mb-6">No invitations yet</p>
            <Link href="/templates">
              <Button variant="secondary">Browse Templates</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sorted.map(inv => {
              const template = getTemplateById(inv.templateId)
              return (
                <div
                  key={inv.id}
                  className="border border-gold/20 rounded-sm p-5 bg-white/40 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display text-lg text-dark truncate">
                        {inv.groomName} & {inv.brideName}
                      </span>
                      <Badge variant={inv.status === 'paid' ? 'paid' : 'draft'}>
                        {inv.status === 'paid' ? 'Paid' : 'Draft'}
                      </Badge>
                    </div>
                    <p className="font-body text-sm text-brand-text/50">
                      {template?.name} · {inv.weddingDate} · Created {new Date(inv.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link href={`/invitation/${inv.id}`}>
                      <Button variant="secondary" size="sm">View</Button>
                    </Link>
                    <Link href={`/editor/${inv.templateId}?invitationId=${inv.id}`}>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Visit `/dashboard` — shows all invitations, status badges, View/Edit links.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add dashboard page listing all invitations"
```

---

## Task 13: Polish and Mobile Responsiveness

**Files:**
- Modify: `src/components/canvas/InvitationCanvas.tsx` (canvas scaling)
- Modify: `src/app/editor/[templateId]/page.tsx` (mobile layout)
- Modify: `src/app/globals.css` (animations)

- [ ] **Step 1: Verify canvas scales on mobile**

Open Chrome DevTools → toggle mobile view (375px wide) on editor page.
Canvas should scale down and fit within the viewport without horizontal scroll.

If not, ensure the `ResizeObserver` in `InvitationCanvas` is correctly applying:
```
scale = containerWidth / 800
canvas.style.transform = `scale(${scale})`
wrapper.style.height = `${1000 * scale}px`
```

- [ ] **Step 2: Test editor layout on mobile**

On mobile, the left panel (form) should stack above the canvas. Verify `flex-col lg:flex-row` in editor page works correctly.

- [ ] **Step 3: Verify all 3 template styles render correctly**

Test each template in the editor: `/editor/islamic-gold`, `/editor/classic-floral`, `/editor/traditional-uzbek`.
Check: text positions, decorative elements, photo area compositing (upload a photo to islamic template).

- [ ] **Step 4: Verify language toggle persists across navigation**

Switch language to RU → navigate to templates → back to home → language should still be RU.

- [ ] **Step 5: Run linter and fix any issues**

```bash
npm run lint
```

Fix all errors. Warnings are acceptable if unavoidable.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: complete local-phase e-invite platform MVP"
```

---

## Quick Reference: Routes

| URL | Description |
|---|---|
| `/` | Landing page |
| `/templates` | Template gallery |
| `/editor/[templateId]` | Invitation editor |
| `/checkout/[invitationId]` | Mocked checkout |
| `/invitation/[id]` | Shareable invitation |
| `/dashboard` | All invitations |
| `GET /api/templates` | List template configs |
| `GET /api/invitations` | List all invitations |
| `POST /api/invitations` | Create invitation |
| `GET /api/invitations/[id]` | Get one invitation |
| `PATCH /api/invitations/[id]` | Update invitation |

## Known Limitations (Local Phase)
- Dashboard shows all invitations to all visitors — no identity/auth
- `invitations.json` write races on concurrent requests — acceptable for local dev
- Photo stored as base64 in JSON — not suitable for production/Vercel
- Payment is fully mocked — no real transaction
- Background PNGs are solid colours — replace with real template assets
