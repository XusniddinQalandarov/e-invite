import type { TemplateConfig } from '@/types/template'

export const islamicTemplate: TemplateConfig = {
  id: 'islamic-gold',
  name: 'Gold Islamic',
  style: 'islamic',
  backgroundUrl: '/templates/islamic-bg.png',
  previewUrl: '/templates/islamic-bg.png',
  textFields: {
    brideName: {
      left: 400, top: 490, width: 600,
      fontSize: 48, fontFamily: 'Cormorant Garamond', fontWeight: '600',
      fill: '#C9A84C', textAlign: 'center', originX: 'center', originY: 'center',
    },
    groomName: {
      left: 400, top: 410, width: 600,
      fontSize: 48, fontFamily: 'Cormorant Garamond', fontWeight: '600',
      fill: '#C9A84C', textAlign: 'center', originX: 'center', originY: 'center',
    },
    date: {
      left: 400, top: 600, width: 400,
      fontSize: 24, fontFamily: 'Cormorant Garamond',
      fill: '#E8C97A', textAlign: 'center', originX: 'center', originY: 'center',
    },
    time: {
      left: 400, top: 645, width: 300,
      fontSize: 18, fontFamily: 'Jost',
      fill: '#E8C97A', textAlign: 'center', originX: 'center', originY: 'center',
    },
    venue: {
      left: 400, top: 705, width: 500,
      fontSize: 22, fontFamily: 'Cormorant Garamond',
      fill: '#FAF6F0', textAlign: 'center', originX: 'center', originY: 'center',
    },
    address: {
      left: 400, top: 745, width: 500,
      fontSize: 15, fontFamily: 'Jost',
      fill: '#FAF6F0', textAlign: 'center', originX: 'center', originY: 'center',
    },
  },
  photoArea: { left: 260, top: 100, width: 280, height: 280, clipShape: 'circle' },
  decorativeElements: [
    {
      type: 'text',
      content: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم',
      left: 400, top: 45,
      fontSize: 20, fontFamily: 'serif', fill: '#C9A84C',
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
      left: 400, top: 530, width: 600,
      fontSize: 52, fontFamily: 'Cormorant Garamond', fontWeight: '300',
      fill: '#8B3A52', textAlign: 'center', originX: 'center', originY: 'center',
    },
    groomName: {
      left: 400, top: 445, width: 600,
      fontSize: 52, fontFamily: 'Cormorant Garamond', fontWeight: '300',
      fill: '#8B3A52', textAlign: 'center', originX: 'center', originY: 'center',
    },
    date: {
      left: 400, top: 635, width: 400,
      fontSize: 24, fontFamily: 'Cormorant Garamond',
      fill: '#C9A84C', textAlign: 'center', originX: 'center', originY: 'center',
    },
    time: {
      left: 400, top: 675, width: 300,
      fontSize: 18, fontFamily: 'Jost',
      fill: '#3D2B1F', textAlign: 'center', originX: 'center', originY: 'center',
    },
    venue: {
      left: 400, top: 730, width: 500,
      fontSize: 22, fontFamily: 'Cormorant Garamond',
      fill: '#3D2B1F', textAlign: 'center', originX: 'center', originY: 'center',
    },
    address: {
      left: 400, top: 768, width: 500,
      fontSize: 15, fontFamily: 'Jost',
      fill: '#3D2B1F', textAlign: 'center', originX: 'center', originY: 'center',
    },
  },
  photoArea: { left: 520, top: 80, width: 220, height: 280, clipShape: 'rect' },
  decorativeElements: [
    { type: 'line', left: 150, top: 487, width: 500, stroke: '#C9A84C', strokeWidth: 1 },
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
      left: 400, top: 530, width: 600,
      fontSize: 50, fontFamily: 'Cormorant Garamond', fontWeight: '600',
      fill: '#E8C97A', textAlign: 'center', originX: 'center', originY: 'center',
    },
    groomName: {
      left: 400, top: 445, width: 600,
      fontSize: 50, fontFamily: 'Cormorant Garamond', fontWeight: '600',
      fill: '#E8C97A', textAlign: 'center', originX: 'center', originY: 'center',
    },
    date: {
      left: 400, top: 635, width: 400,
      fontSize: 26, fontFamily: 'Cormorant Garamond',
      fill: '#FAF6F0', textAlign: 'center', originX: 'center', originY: 'center',
    },
    time: {
      left: 400, top: 675, width: 300,
      fontSize: 18, fontFamily: 'Jost',
      fill: '#FAF6F0', textAlign: 'center', originX: 'center', originY: 'center',
    },
    venue: {
      left: 400, top: 730, width: 500,
      fontSize: 22, fontFamily: 'Cormorant Garamond',
      fill: '#FAF6F0', textAlign: 'center', originX: 'center', originY: 'center',
    },
    address: {
      left: 400, top: 768, width: 500,
      fontSize: 15, fontFamily: 'Jost',
      fill: '#FAF6F0', textAlign: 'center', originX: 'center', originY: 'center',
    },
  },
  decorativeElements: [
    { type: 'line', left: 100, top: 395, width: 600, stroke: '#E8C97A', strokeWidth: 1 },
    { type: 'line', left: 100, top: 585, width: 600, stroke: '#E8C97A', strokeWidth: 1 },
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
