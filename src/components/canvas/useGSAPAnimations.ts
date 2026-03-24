import { useCallback, useRef } from 'react'
import gsap from 'gsap'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FabricLike = any

export function useGSAPAnimations(canvasRef: React.MutableRefObject<FabricLike | null>) {
  const timelinesRef = useRef<gsap.core.Timeline[]>([])

  const killAll = useCallback(() => {
    timelinesRef.current.forEach(tl => tl.kill())
    timelinesRef.current = []
  }, [])

  const playEntrance = useCallback(
    (objectMap: Map<string, FabricLike>, decorObjects: FabricLike[]) => {
      if (!canvasRef.current) return
      killAll()

      const canvas = canvasRef.current
      const tl = gsap.timeline()
      timelinesRef.current.push(tl)

      function animateProp(
        obj: FabricLike,
        from: Record<string, number>,
        to: gsap.TweenVars,
      ) {
        const proxy = { ...from }
        obj.set(from)
        return gsap.to(proxy, {
          ...to,
          onUpdate() {
            obj.set(proxy)
            canvas.renderAll()
          },
        })
      }

      // 1. Background fade in
      const bg = canvas.backgroundImage
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
      decorObjects.forEach((obj: FabricLike, i: number) => {
        const origLeft = obj.left ?? 0
        const proxy = { opacity: 0, left: origLeft - 30 }
        obj.set({ opacity: 0, left: origLeft - 30 })
        tl.to(proxy, {
          opacity: 1,
          left: origLeft,
          duration: 0.5,
          ease: 'power2.out',
          onUpdate() { obj.set({ opacity: proxy.opacity, left: proxy.left }); canvas.renderAll() },
        }, i === 0 ? '-=0.3' : `-=${Math.max(0.05, 0.5 - i * 0.1)}`)
      })

      // 3. Groom name fades up
      const groom = objectMap.get('groomName')
      if (groom) {
        const origTop = groom.top ?? 0
        tl.add(animateProp(groom, { opacity: 0, top: origTop + 20 }, { opacity: 1, top: origTop, duration: 0.6, ease: 'power2.out' }))
      }

      // 4. Bride name fades up
      const bride = objectMap.get('brideName')
      if (bride) {
        const origTop = bride.top ?? 0
        tl.add(
          animateProp(bride, { opacity: 0, top: origTop + 20 }, { opacity: 1, top: origTop, duration: 0.6, ease: 'power2.out' }),
          '-=0.3',
        )
      }

      // 5. Date, time, venue, address fade in
      const keys = ['date', 'time', 'venue', 'address']
      keys.forEach((key, i) => {
        const obj = objectMap.get(key)
        if (!obj) return
        const proxy = { opacity: 0 }
        obj.set('opacity', 0)
        tl.to(proxy, {
          opacity: 1,
          duration: 0.4,
          onUpdate() { obj.set('opacity', proxy.opacity); canvas.renderAll() },
        }, `-=${Math.max(0.05, 0.3 - i * 0.05)}`)
      })

      return tl
    },
    [canvasRef, killAll],
  )

  return { playEntrance, killAll }
}
