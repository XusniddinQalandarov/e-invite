import { useEffect, useRef, useCallback } from 'react'
import type { TemplateConfig, DecorativeElement } from '@/types/template'
import type { Invitation } from '@/types/invitation'

export interface CanvasObjects {
  objectMap: Map<string, object>
  decorObjects: object[]
}

export interface UseCanvasReturn extends CanvasObjects {
  exportPNG: () => string
}

// Fabric is loaded dynamically to avoid SSR issues
async function getFabric() {
  const fabric = await import('fabric')
  return fabric
}

function getFieldValue(data: Partial<Invitation>, key: string): string {
  const map: Record<string, keyof Invitation> = {
    brideName: 'brideName',
    groomName: 'groomName',
    date: 'weddingDate',
    time: 'weddingTime',
    venue: 'venueName',
    address: 'venueAddress',
  }
  const field = map[key]
  if (!field) return ''
  const val = data[field]
  return val ? String(val) : ''
}

export function useCanvas(
  canvasEl: HTMLCanvasElement | null,
  template: TemplateConfig,
  data: Partial<Invitation>,
  isPurchased: boolean,
  onReady?: (result: UseCanvasReturn) => void,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fabricRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const objectMapRef = useRef<Map<string, any>>(new Map())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decorObjectsRef = useRef<any[]>([])
  const readyRef = useRef(false)

  useEffect(() => {
    if (!canvasEl) return
    let cancelled = false

    async function setup() {
      const { Canvas, IText, Line, FabricImage, Circle } = await getFabric()

      if (cancelled) return

      const canvas = new Canvas(canvasEl!, {
        width: 800,
        height: 1000,
        selection: false,
        renderOnAddRemove: false,
      })
      fabricRef.current = canvas

      // Background
      const bg = await FabricImage.fromURL(template.backgroundUrl, { crossOrigin: 'anonymous' })
      if (cancelled) { canvas.dispose(); return }
      bg.scaleToWidth(800)
      bg.scaleToHeight(1000)
      canvas.set('backgroundImage', bg)

      // Text fields
      const map = new Map<string, InstanceType<typeof IText>>()
      const fields = template.textFields as Record<string, typeof template.textFields.brideName>
      for (const [key, cfg] of Object.entries(fields)) {
        if (!cfg) continue
        const text = new IText(getFieldValue(data, key), {
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
          editable: false,
        })
        canvas.add(text)
        map.set(key, text)
      }
      objectMapRef.current = map

      // Decorative elements
      const decors: (InstanceType<typeof IText> | InstanceType<typeof Line>)[] = []
      for (const el of template.decorativeElements ?? []) {
        const obj = buildDecorElement(el, IText, Line)
        canvas.add(obj)
        decors.push(obj)
      }
      decorObjectsRef.current = decors

      // Photo
      if (data.photoUrl && template.photoArea) {
        const area = template.photoArea
        const img = await FabricImage.fromURL(data.photoUrl)
        if (!cancelled) {
          img.scaleToWidth(area.width)
          img.scaleToHeight(area.height)
          img.set({ left: area.left, top: area.top, selectable: false, evented: false })
          if (area.clipShape === 'circle') {
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
      }

      // Watermark
      if (!isPurchased) {
        const wm = new IText('sening-toy.uz', {
          left: 400,
          top: 500,
          fontSize: 36,
          fontFamily: 'Jost',
          fill: 'rgba(255,255,255,0.15)',
          angle: -30,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
          editable: false,
        })
        canvas.add(wm)
      }

      canvas.renderAll()
      readyRef.current = true

      onReady?.({
        objectMap: map,
        decorObjects: decors,
        exportPNG: () =>
          canvas.toDataURL({ format: 'png', multiplier: 1 }),
      })
    }

    setup()

    return () => {
      cancelled = true
      if (fabricRef.current) {
        fabricRef.current.dispose()
        fabricRef.current = null
      }
      readyRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasEl, template.id, isPurchased])

  // Live-update text fields when form data changes
  const updateField = useCallback((key: string, value: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj = objectMapRef.current.get(key) as any
    if (obj && readyRef.current) {
      obj.set('text', value)
      fabricRef.current?.renderAll()
    }
  }, [])

  useEffect(() => {
    updateField('brideName', data.brideName ?? '')
  }, [data.brideName, updateField])

  useEffect(() => {
    updateField('groomName', data.groomName ?? '')
  }, [data.groomName, updateField])

  useEffect(() => {
    updateField('date', data.weddingDate ?? '')
  }, [data.weddingDate, updateField])

  useEffect(() => {
    updateField('time', data.weddingTime ?? '')
  }, [data.weddingTime, updateField])

  useEffect(() => {
    updateField('venue', data.venueName ?? '')
  }, [data.venueName, updateField])

  useEffect(() => {
    updateField('address', data.venueAddress ?? '')
  }, [data.venueAddress, updateField])

  return { fabricRef, objectMapRef, decorObjectsRef }
}

function buildDecorElement(
  el: DecorativeElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IText: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Line: any,
) {
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
      editable: false,
      originX: 'center',
      originY: 'top',
    })
  }
  return new Line([el.left, el.top, el.left + el.width, el.top], {
    stroke: el.stroke,
    strokeWidth: el.strokeWidth ?? 1,
    selectable: false,
    evented: false,
  })
}
