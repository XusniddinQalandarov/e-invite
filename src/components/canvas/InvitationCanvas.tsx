'use client'

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from 'react'
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
    const wrapperRef = useRef<HTMLDivElement>(null)
    const canvasElRef = useRef<HTMLCanvasElement>(null)
    const exportFnRef = useRef<(() => string) | null>(null)

    // Pass canvas element after mount
    const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null)
    useEffect(() => {
      setCanvasEl(canvasElRef.current)
    }, [])

    const { fabricRef } = useCanvas(
      canvasEl,
      template,
      data,
      isPurchased,
      ({ objectMap, decorObjects, exportPNG }) => {
        exportFnRef.current = exportPNG
        if (autoplay) {
          playEntrance(objectMap as Map<string, unknown>, decorObjects)
        }
      },
    )

    const { playEntrance, killAll } = useGSAPAnimations(fabricRef)

    useImperativeHandle(ref, () => ({
      exportPNG: () => exportFnRef.current?.() ?? '',
    }))

    useEffect(() => () => killAll(), [killAll])

    // Responsive scaling
    useEffect(() => {
      const wrapper = wrapperRef.current
      const canvas = canvasElRef.current
      if (!wrapper || !canvas) return

      function applyScale() {
        if (!wrapper || !canvas) return
        const scale = wrapper.offsetWidth / 800
        canvas.style.transform = `scale(${scale})`
        canvas.style.transformOrigin = 'top left'
        wrapper.style.height = `${1000 * scale}px`
      }

      applyScale()
      const ro = new ResizeObserver(applyScale)
      ro.observe(wrapper)
      return () => ro.disconnect()
    }, [])

    return (
      <div
        ref={wrapperRef}
        className="relative w-full overflow-hidden rounded-sm shadow-2xl"
      >
        <canvas ref={canvasElRef} />
      </div>
    )
  },
)
InvitationCanvas.displayName = 'InvitationCanvas'
