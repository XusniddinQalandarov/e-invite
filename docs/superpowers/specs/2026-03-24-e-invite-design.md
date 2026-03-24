# E-Invite Platform — Design Spec
_Date: 2026-03-24 (revised after spec review)_

## Overview
Full-stack web application for creating and purchasing animated wedding e-invitations, targeted at the Uzbekistan market. Local-first development phase: no Supabase, no auth, no real payment gateway.

## Tech Stack
- **Framework:** Next.js 14 (App Router), TypeScript strict mode
- **Styling:** TailwindCSS + CSS variables design system
- **Canvas/Animation:** Fabric.js, GSAP
- **Data Layer:** Local JSON files (`data/`) via `fs/promises` helpers
- **Payment:** Mocked — "Pay" button immediately marks invitation as `paid`
- **Auth:** None for local phase — all pages publicly accessible
- **Deployment target:** Vercel (future)

## Design System
```css
--color-cream: #FAF6F0
--color-gold: #C9A84C
--color-gold-light: #E8C97A
--color-dark: #1A1207
--color-text: #3D2B1F
--font-display: 'Cormorant Garamond', serif
--font-body: 'Jost', sans-serif
```
Aesthetic: luxury/refined. No generic AI look — every component hand-crafted with intentional spacing, typography hierarchy, and motion.

## Types

### `types/template.ts`
```typescript
export interface TextFieldConfig {
  left: number
  top: number
  width: number           // required — constrains Fabric IText wrapping
  fontSize: number
  fontFamily: string
  fontWeight?: string
  fill: string
  textAlign?: 'left' | 'center' | 'right'
  originX?: 'left' | 'center' | 'right'  // default 'left'
  originY?: 'top' | 'center' | 'bottom'  // default 'top'
}

// Discriminated union — no dead properties
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
  style: 'floral' | 'islamic' | 'uzbek'   // narrowed to MVP templates only
  backgroundUrl: string                     // path relative to /public, e.g. '/templates/islamic-bg.png'
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

### `types/invitation.ts`
```typescript
export interface Invitation {
  id: string
  templateId: string
  brideName: string
  groomName: string
  weddingDate: string      // ISO date string, e.g. "2026-09-15"
  weddingTime: string      // "HH:MM", e.g. "16:00"
  venueName: string
  venueAddress?: string
  photoUrl?: string        // base64 data URL; max 800 KB before encoding (enforced client-side)
  language: 'uz' | 'ru' | 'en'
  status: 'draft' | 'paid'
  paymentId?: string
  canvasJson?: string      // Fabric canvas JSON for restoring editor state across sessions
  createdAt: string        // ISO timestamp
  updatedAt: string        // ISO timestamp, updated on every PATCH
}

// Ref handle exposed by InvitationCanvas via useImperativeHandle
export interface InvitationCanvasHandle {
  exportPNG: () => string  // returns data URL (image/png)
}
```

## Data Layer — `lib/db.ts`

Exports two generic helpers:
```typescript
readJson<T>(filename: string): Promise<T>
writeJson<T>(filename: string, data: T): Promise<void>
```

`writeJson` uses write-then-rename: data is written to `<filename>.tmp`, then renamed to `<filename>` atomically via `fs.rename`. This prevents partial writes. Concurrent write races are acknowledged as a known limitation of the local JSON phase — acceptable for single-developer local use.

**Photo storage:** Photos are stored as base64 data URLs inside the `Invitation.photoUrl` field. A hard limit of 800 KB is enforced client-side before encoding (via `File.size` check before `FileReader.readAsDataURL`). This keeps `invitations.json` manageable for the local phase. This approach is incompatible with Vercel serverless (read-only filesystem for `data/`) — when migrating to Supabase, `photoUrl` becomes a Storage URL and the base64 field is dropped.

## Project Structure
```
e-invite/
├── data/
│   ├── templates.json          # 3 template seed records (never modified at runtime)
│   └── invitations.json        # starts as []
├── public/
│   └── templates/
│       ├── islamic-bg.png
│       ├── floral-bg.png
│       └── uzbek-bg.png
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx                      # Landing
│   │   │   ├── templates/page.tsx            # Template gallery
│   │   │   └── invitation/[id]/page.tsx      # Shareable page (server fetch + client canvas)
│   │   ├── editor/[templateId]/page.tsx      # Invitation editor (client)
│   │   ├── checkout/[invitationId]/page.tsx  # Checkout (mocked)
│   │   ├── dashboard/page.tsx                # Dashboard (all invitations, no identity filter)
│   │   └── api/
│   │       ├── templates/route.ts            # GET → returns templates.json
│   │       └── invitations/
│   │           ├── route.ts                  # GET (list all), POST (create)
│   │           └── [id]/route.ts             # GET (one), PATCH (update fields or status)
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── InvitationCanvas.tsx          # forwardRef + useImperativeHandle(exportPNG)
│   │   │   ├── useCanvas.ts                  # canvas lifecycle, object management
│   │   │   └── useGSAPAnimations.ts          # timeline factory functions
│   │   ├── editor/
│   │   │   └── EditorForm.tsx
│   │   ├── templates/
│   │   │   ├── TemplateCard.tsx
│   │   │   └── TemplateGrid.tsx
│   │   └── ui/                               # Button, Input, Badge, Select, etc.
│   ├── lib/
│   │   ├── db.ts
│   │   └── templates/
│   │       └── templateConfigs.ts            # 3 TemplateConfig objects (Islamic, Floral, Uzbek)
│   └── types/
│       ├── invitation.ts
│       └── template.ts
```

## API Routes

All error responses use `{ error: string }` shape. All success responses return the full entity or array.

| Method | Route | Request body | Response | Notes |
|---|---|---|---|---|
| GET | `/api/templates` | — | `TemplateConfig[]` | reads templates.json |
| GET | `/api/invitations` | — | `Invitation[]` | reads invitations.json |
| POST | `/api/invitations` | `Omit<Invitation, 'id' \| 'createdAt' \| 'updatedAt' \| 'status'>` | `Invitation` (201) | validates templateId exists; 400 if not |
| GET | `/api/invitations/[id]` | — | `Invitation` | 404 if not found |
| PATCH | `/api/invitations/[id]` | `Partial<Invitation>` | `Invitation` | always sets `updatedAt`; 404 if not found |

`POST /api/invitations` validates that `templateId` exists in `templates.json` before writing. Returns 400 `{ error: 'Invalid templateId' }` if not found.

## Pages

### Landing (`/`)
- Full-viewport hero: autoplay GSAP loop cycling through invitation card previews, headline ("Nikohingizni Ulashing"), CTA button
- Template preview strip (3 cards, hover reveal animation)
- Pricing: 150,000 UZS single tier
- "How it works": 3-step visual (Choose → Customize → Share)
- Language toggle: UZ / RU (global, stored in `localStorage`, consumed via React context)
- Hero background: subtle gold particle or petal CSS/canvas animation

### Template Gallery (`/templates`)
- Responsive grid (1 → 2 → 3 cols)
- Filter by style: Floral | Islamic | Uzbek (only active MVP styles shown)
- Each card: name, style badge, 150,000 UZS, "Customize" CTA, hover animation
- Smooth filter transitions (GSAP or CSS)

### Editor (`/editor/[templateId]`)
- Left panel: form with fields (brideName, groomName, weddingDate, weddingTime, venueName, venueAddress, photo upload, language select)
  - Photo upload: enforces 800 KB client-side before encoding; preview thumbnail shown
  - `maxLength` limits: names 80 chars, venue 120 chars, address 200 chars
- Right panel: `InvitationCanvas` (800×1000 logical pixels, scaled via CSS transform)
  - Canvas wrapper: `div` with `overflow: hidden`, `height: containerWidth * (1000/800)px`, canvas inside with `transform: scale(containerWidth/800)`, `transform-origin: top left`
  - Live update: PATCH only the changed Fabric text object — no full canvas re-init
  - Watermark on unpurchased canvas (semi-transparent "sening-toy.uz" text, diagonal)
  - GSAP entrance animation on mount
- "Save Draft" → POST/PATCH `/api/invitations`, saves `canvasJson` (from `canvas.toJSON()`)
- "Purchase" → navigates to `/checkout/[id]`
- On mount: if `canvasJson` exists in a loaded draft, restore via `canvas.loadFromJSON()`

### Checkout (`/checkout/[invitationId]`)
- Fetches invitation server-side (404 redirect if not found)
- Summary: bride + groom names, date, venue, template name, price
- "Pay with Payme" button → PATCH `/api/invitations/[id]` `{ status: 'paid', paymentId: 'mock_<timestamp>' }` → redirect to `/invitation/[id]`

### Shareable Page (`/invitation/[id]`)
- Server component fetches invitation; passes `isPurchased` as prop to client canvas
- `isPurchased` is derived from `invitation.status === 'paid'` — server-verified, not client-guessable
- Client mounts `InvitationCanvas` with `isPurchased` prop; canvas omits watermark only when true
- Autoplay GSAP entrance animation on mount, no editing controls
- "Download" button (visible only when `isPurchased`): calls `canvasRef.current.exportPNG()` → triggers browser download
- "Copy Link" button, WhatsApp share button (pre-filled Uzbek/Russian message)
- Note: dashboard shows all invitations to all visitors — no identity filter (known local-phase limitation)

### Dashboard (`/dashboard`)
- Fetches all invitations server-side
- Known limitation: all invitations visible to all visitors (no auth/session filter in local phase)
- List: bride + groom names, template name, status badge (draft/paid), created date
- Actions per row: View (→ `/invitation/[id]`), Edit (→ `/editor/[templateId]`), Download (paid only)
- "Create New" CTA → `/templates`

## Canvas Architecture

### `useCanvas(template, data, isPurchased, canvasEl)`
- Initialises `fabric.Canvas` on `canvasEl`
- Loads background image from `template.backgroundUrl`
- Places `fabric.IText` objects for each field in `template.textFields`, keyed by field name (stored in a `Map<string, fabric.IText>`)
- Places decorative elements (text, lines) from `template.decorativeElements`
- Composites photo into `template.photoArea` if `data.photoUrl` is set
- Adds diagonal watermark if `!isPurchased`
- Returns `{ canvas, objectMap, exportPNG }`

Text object updates (when form data changes): look up the object in `objectMap` by key, call `.set('text', newValue)`, call `canvas.renderAll()`. No full re-init.

On unmount: `canvas.dispose()`

### `useGSAPAnimations(canvas, objectMap)`
Returns `{ playEntrance, playShimmer, killAll }`.

GSAP animates Fabric objects via proxy objects: each proxy holds `{ opacity, x, y }` and the GSAP `onUpdate` callback syncs these to the Fabric object's properties and calls `canvas.renderAll()`. This avoids double-rendering: GSAP drives all render calls via `onUpdate`, Fabric's own render loop is not running concurrently.

On unmount: `killAll()` kills all GSAP timelines created by the hook.

### `InvitationCanvas`
- `forwardRef<InvitationCanvasHandle, Props>` wraps a `<canvas>` element
- Calls `useCanvas` and `useGSAPAnimations` hooks
- Exposes `exportPNG(): string` via `useImperativeHandle`
- `exportPNG` returns `canvas.toDataURL('image/png', 1.0)` — the canvas must be fully rendered before calling

## GSAP Animation Sequence
1. Background fade in (0.8s ease-out)
2. Decorative ornaments slide in from edges (stagger 0.15s)
3. Groom name fades up (y: 20→0, opacity: 0→1, 0.6s)
4. Divider/ampersand scales in (scaleX: 0→1, 0.4s)
5. Bride name fades up (y: 20→0, opacity: 0→1, 0.6s)
6. Date + venue fade in (stagger 0.2s)
7. Gold shimmer sweep on names: GSAP ticker updates a Fabric gradient's `x1`/`x2` coords each frame, `canvas.renderAll()` called in `onUpdate`

## Internationalisation
Language toggle stored in `localStorage` as `lang: 'uz' | 'ru' | 'en'`, exposed via a `LanguageContext`. Landing page respects `lang` for all UI strings. Editor form respects `lang` for labels and placeholder text.

**Dev order correction:** Language context is set up at step 2 (alongside design system), so the landing page (step 9) can consume it without rework. Translation strings live in `lib/i18n/uz.ts`, `lib/i18n/ru.ts`, `lib/i18n/en.ts` as plain key→value objects (no external i18n library for MVP).

## 3 MVP Templates

### 1. Gold Islamic
- Background: deep navy `#0D1B2A` + arabesque border PNG
- Names: Cormorant Garamond 600, `#C9A84C`, `originX: 'center'`, centered
- Decorative: Bismillah Arabic text at top (DecorativeElement type: 'text')
- Circular photo area, center-top

### 2. Classic Floral
- Background: cream `#FAF6F0` + watercolor flowers PNG
- Names: Cormorant Garamond 300, deep rose `#8B3A52`, `originX: 'center'`
- Gold line divider between names (DecorativeElement type: 'line')
- Rectangular photo area, top-right

### 3. Traditional Uzbek
- Background: burgundy `#6B1F2A` + ikat pattern PNG
- Names: Cormorant Garamond 600, `#E8C97A`, `originX: 'center'`
- National ornament elements as DecorativeElement[] entries
- No photo area

## Development Order
1. Init Next.js 14 + TypeScript + TailwindCSS, `tsconfig` strict mode
2. Design system (CSS variables, Google Fonts, base UI components in `components/ui/`), language context + i18n strings
3. Types (`types/`) + `lib/db.ts` + `lib/i18n/` + JSON seed data (`data/templates.json`, `data/invitations.json`)
4. API routes (GET templates, CRUD invitations with templateId validation)
5. `useCanvas` + `useGSAPAnimations` + `InvitationCanvas` using Islamic template config from `templateConfigs.ts`
6. `EditorForm` + live canvas wiring (form state → canvas text updates)
7. Photo upload (client-side 800 KB cap, base64 encode, display thumbnail, store in invitation)
8. Template gallery page (`/templates`)
9. Landing page (`/`)
10. Save/load invitations via API (POST on first save, PATCH on updates; restore `canvasJson` on editor mount)
11. Checkout page (mocked payment → PATCH status to paid → redirect)
12. Shareable `/invitation/[id]` page (server fetch, `isPurchased` prop, download + share buttons)
13. Watermark logic (present when `!isPurchased`, absent when `isPurchased` — server-derived)
14. Dashboard page
15. Polish: mobile canvas scaling, animation QA, accessibility, WhatsApp share

## Engineering Principles
- No `any` types — TypeScript strict throughout
- Canvas logic exclusively in `components/canvas/` — never in page files
- `lib/db.ts` is the only file that imports `fs` — clean single boundary
- API routes: validate → db helper → respond; no business logic in routes
- Components are small and single-purpose; shared UI in `components/ui/`
- Mobile canvas: wrapper `div` with computed height; canvas `transform: scale()` with `transform-origin: top left`
- No premature abstraction — build for current needs only
- `maxLength` enforced on all form fields (names: 80, venue: 120, address: 200)
