import type { TemplateConfig } from '@/types/template'

const UNSPLASH_ISLAMIC = 'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=800&h=1000&q=80'
const UNSPLASH_FLORAL = 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?auto=format&fit=crop&w=800&h=1000&q=80'
const UNSPLASH_UZBEK = 'https://images.unsplash.com/photo-1534093607318-f025413f49cb?auto=format&fit=crop&w=800&h=1000&q=80'

export const islamicTemplate: TemplateConfig = {
  id: 'islamic-gold',
  name: 'Gold Islamic',
  label: 'Mashhur',
  price: 149000,
  priceLabel: '149 000 so\'m',
  style: 'islamic',
  backgroundUrl: UNSPLASH_ISLAMIC,
  previewUrl: UNSPLASH_ISLAMIC,
  textFields: {
    brideName: {
      left: 400, top: 580, width: 600,
      fontSize: 48, fontFamily: 'Cormorant Garamond', fontWeight: '600',
      fill: '#C9A84C', textAlign: 'center', originX: 'center', originY: 'center',
    },
    groomName: {
      left: 400, top: 500, width: 600,
      fontSize: 48, fontFamily: 'Cormorant Garamond', fontWeight: '600',
      fill: '#C9A84C', textAlign: 'center', originX: 'center', originY: 'center',
    },
    date: {
      left: 400, top: 670, width: 400,
      fontSize: 24, fontFamily: 'Cormorant Garamond',
      fill: '#E8C97A', textAlign: 'center', originX: 'center', originY: 'center',
    },
    time: {
      left: 400, top: 710, width: 300,
      fontSize: 18, fontFamily: 'Jost',
      fill: '#E8C97A', textAlign: 'center', originX: 'center', originY: 'center',
    },
    venue: {
      left: 400, top: 770, width: 500,
      fontSize: 22, fontFamily: 'Cormorant Garamond',
      fill: '#FAF6F0', textAlign: 'center', originX: 'center', originY: 'center',
    },
    address: {
      left: 400, top: 810, width: 500,
      fontSize: 15, fontFamily: 'Jost',
      fill: '#FAF6F0', textAlign: 'center', originX: 'center', originY: 'center',
    },
  },
  // 400×400 photo centered at x=400, top=60 → bottom=460
  photoArea: { left: 200, top: 60, width: 400, height: 400, clipShape: 'circle' },
  decorativeElements: [
    {
      type: 'text',
      content: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم',
      left: 400, top: 20,
      fontSize: 20, fontFamily: 'serif', fill: '#C9A84C',
    },
  ],
}

export const floralTemplate: TemplateConfig = {
  id: 'classic-floral',
  name: 'Classic Floral',
  label: 'Yangi',
  price: 99000,
  priceLabel: '99 000 so\'m',
  style: 'floral',
  backgroundUrl: UNSPLASH_FLORAL,
  previewUrl: UNSPLASH_FLORAL,
  textFields: {
    brideName: {
      left: 400, top: 590, width: 600,
      fontSize: 52, fontFamily: 'Cormorant Garamond', fontWeight: '300',
      fill: '#FFFFFF', textAlign: 'center', originX: 'center', originY: 'center',
    },
    groomName: {
      left: 400, top: 510, width: 600,
      fontSize: 52, fontFamily: 'Cormorant Garamond', fontWeight: '300',
      fill: '#FFFFFF', textAlign: 'center', originX: 'center', originY: 'center',
    },
    date: {
      left: 400, top: 680, width: 400,
      fontSize: 24, fontFamily: 'Cormorant Garamond',
      fill: '#E8C97A', textAlign: 'center', originX: 'center', originY: 'center',
    },
    time: {
      left: 400, top: 720, width: 300,
      fontSize: 18, fontFamily: 'Jost',
      fill: '#FAF6F0', textAlign: 'center', originX: 'center', originY: 'center',
    },
    venue: {
      left: 400, top: 780, width: 500,
      fontSize: 22, fontFamily: 'Cormorant Garamond',
      fill: '#FAF6F0', textAlign: 'center', originX: 'center', originY: 'center',
    },
    address: {
      left: 400, top: 820, width: 500,
      fontSize: 15, fontFamily: 'Jost',
      fill: '#FAF6F0', textAlign: 'center', originX: 'center', originY: 'center',
    },
  },
  // 400×400 photo centered at x=400, top=45 → bottom=445
  photoArea: { left: 200, top: 45, width: 400, height: 400, clipShape: 'circle' },
  decorativeElements: [
    { type: 'line', left: 150, top: 548, width: 500, stroke: '#C9A84C', strokeWidth: 1 },
  ],
}

export const uzbekTemplate: TemplateConfig = {
  id: 'traditional-uzbek',
  name: 'Traditional Uzbek',
  label: 'Premium',
  price: 199000,
  priceLabel: '199 000 so\'m',
  style: 'uzbek',
  backgroundUrl: UNSPLASH_UZBEK,
  previewUrl: UNSPLASH_UZBEK,
  textFields: {
    brideName: {
      left: 400, top: 575, width: 600,
      fontSize: 50, fontFamily: 'Cormorant Garamond', fontWeight: '600',
      fill: '#E8C97A', textAlign: 'center', originX: 'center', originY: 'center',
    },
    groomName: {
      left: 400, top: 490, width: 600,
      fontSize: 50, fontFamily: 'Cormorant Garamond', fontWeight: '600',
      fill: '#E8C97A', textAlign: 'center', originX: 'center', originY: 'center',
    },
    date: {
      left: 400, top: 680, width: 400,
      fontSize: 26, fontFamily: 'Cormorant Garamond',
      fill: '#FAF6F0', textAlign: 'center', originX: 'center', originY: 'center',
    },
    time: {
      left: 400, top: 720, width: 300,
      fontSize: 18, fontFamily: 'Jost',
      fill: '#FAF6F0', textAlign: 'center', originX: 'center', originY: 'center',
    },
    venue: {
      left: 400, top: 780, width: 500,
      fontSize: 22, fontFamily: 'Cormorant Garamond',
      fill: '#FAF6F0', textAlign: 'center', originX: 'center', originY: 'center',
    },
    address: {
      left: 400, top: 820, width: 500,
      fontSize: 15, fontFamily: 'Jost',
      fill: '#FAF6F0', textAlign: 'center', originX: 'center', originY: 'center',
    },
  },
  // 400×400 photo centered at x=400, top=50 → bottom=450
  photoArea: { left: 200, top: 50, width: 400, height: 400, clipShape: 'circle' },
  decorativeElements: [
    { type: 'line', left: 100, top: 440, width: 600, stroke: '#E8C97A', strokeWidth: 1 },
    { type: 'line', left: 100, top: 630, width: 600, stroke: '#E8C97A', strokeWidth: 1 },
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
