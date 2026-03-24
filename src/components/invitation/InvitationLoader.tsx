'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface Props {
  onComplete: () => void
}

// Refined elegant dove silhouette
function ElegantDove({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 160 100"
      fill="none"
      style={{ transform: flip ? 'scaleX(-1)' : 'none' }}
    >
      {/* Body */}
      <ellipse cx="72" cy="60" rx="34" ry="16" fill="rgba(255,255,255,0.92)" />
      {/* Neck */}
      <ellipse cx="98" cy="50" rx="14" ry="18" fill="rgba(255,255,255,0.95)" />
      {/* Head */}
      <circle cx="110" cy="38" r="13" fill="white" />
      {/* Beak */}
      <path d="M 122,36 L 134,33 L 122,40 Z" fill="rgba(201,168,76,0.9)" />
      {/* Eye */}
      <circle cx="114" cy="35" r="2.8" fill="#0d0b1e" />
      <circle cx="115" cy="34" r="1" fill="rgba(255,255,255,0.8)" />
      {/* Upper wing — flaps */}
      <path
        className="dove-wing"
        d="M 80,50 Q 55,12 8,22 Q 32,38 80,50 Z"
        fill="rgba(255,255,255,0.88)"
      />
      {/* Lower wing */}
      <path d="M 76,72 Q 42,88 14,76 Q 36,68 76,72 Z" fill="rgba(255,255,255,0.75)" />
      {/* Tail feathers */}
      <path d="M 36,62 L 8,50 L 12,68 Z" fill="rgba(255,255,255,0.8)" />
      <path d="M 38,68 L 6,64 L 14,78 Z" fill="rgba(255,255,255,0.7)" />
      <path d="M 40,74 L 10,76 L 20,88 Z" fill="rgba(255,255,255,0.6)" />
      {/* Elegant bouquet stem */}
      <line x1="126" y1="44" x2="140" y2="56" stroke="rgba(150,200,120,0.8)" strokeWidth="1.8" />
      <line x1="128" y1="44" x2="138" y2="50" stroke="rgba(150,200,120,0.6)" strokeWidth="1.2" />
      {/* Rose buds */}
      <circle cx="140" cy="57" r="5" fill="rgba(220,160,160,0.85)" />
      <circle cx="143" cy="53" r="4" fill="rgba(200,140,155,0.8)" />
      <circle cx="136" cy="54" r="3.5" fill="rgba(230,175,175,0.75)" />
      {/* Tiny leaves */}
      <ellipse cx="133" cy="50" rx="5" ry="2.5" fill="rgba(100,170,100,0.7)" transform="rotate(-30, 133, 50)" />
      <ellipse cx="142" cy="60" rx="4" ry="2" fill="rgba(100,170,100,0.6)" transform="rotate(20, 142, 60)" />
    </svg>
  )
}

// Star particle
function Star({ x, y, size, opacity, delay }: { x: number; y: number; size: number; opacity: number; delay: number }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: 'white',
        opacity,
        boxShadow: size > 2 ? `0 0 ${size * 2}px ${size}px rgba(255,255,255,0.3)` : 'none',
        animation: `loader-star-twinkle ${2 + delay}s ease-in-out ${delay}s infinite alternate`,
      }}
    />
  )
}

// Gold rising particle
function GoldDust({ x, delay }: { x: number; delay: number }) {
  return (
    <div
      className="absolute pointer-events-none rounded-full"
      style={{
        left: `${x}%`,
        bottom: '0',
        width: delay % 3 === 0 ? '3px' : '2px',
        height: delay % 3 === 0 ? '3px' : '2px',
        background: delay % 2 === 0 ? '#C9A84C' : '#E8C97A',
        boxShadow: '0 0 4px 2px rgba(201,168,76,0.5)',
        animation: `loader-gold-rise ${4 + (delay % 4)}s ease-out ${delay * 0.3}s infinite`,
        opacity: 0,
      }}
    />
  )
}

export function InvitationLoader({ onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const doveLeftRef = useRef<HTMLDivElement>(null)
  const doveRightRef = useRef<HTMLDivElement>(null)
  const burstRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const moonGlowRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return

    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false)
        onComplete()
      },
    })

    // Wing flap — both doves
    const wingsLeft = doveLeftRef.current?.querySelectorAll('.dove-wing')
    const wingsRight = doveRightRef.current?.querySelectorAll('.dove-wing')
    ;[wingsLeft, wingsRight].forEach((wings) => {
      wings?.forEach((wing) => {
        gsap.to(wing, {
          attr: { d: 'M 80,50 Q 55,0 8,8 Q 32,30 80,50 Z' },
          duration: 0.28,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        })
      })
    })

    // Moon glow pulse
    if (moonGlowRef.current) {
      gsap.to(moonGlowRef.current, {
        scale: 1.15,
        opacity: 0.5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }

    tl
      // Fade in background
      .fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' })

      // Dove entrance from far sides
      .set(doveLeftRef.current, { x: -500, y: 40, opacity: 0, scale: 0.5 })
      .set(doveRightRef.current, { x: 500, y: 60, opacity: 0, scale: 0.5 })

      .to([doveLeftRef.current, doveRightRef.current], { opacity: 1, duration: 0.5 }, 0.6)

      .to(
        doveLeftRef.current,
        { x: -55, y: -5, scale: 1, duration: 2.4, ease: 'power2.inOut' },
        0.6,
      )
      .to(
        doveRightRef.current,
        { x: 55, y: -5, scale: 1, duration: 2.4, ease: 'power2.inOut' },
        0.7,
      )

      // Gold radiance burst when doves meet
      .fromTo(
        burstRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: 'power3.out' },
        2.8,
      )

      // Elegant text reveal
      .fromTo(
        textRef.current,
        { opacity: 0, y: 18, letterSpacing: '0.3em' },
        { opacity: 1, y: 0, letterSpacing: '0.6em', duration: 1.0, ease: 'power3.out' },
        3.0,
      )

      // Doves gently hover after meeting (spawned outside timeline to avoid blocking onComplete)
      .call(() => {
        gsap.to(doveLeftRef.current, { y: -20, duration: 1.8, ease: 'sine.inOut', repeat: -1, yoyo: true })
        gsap.to(doveRightRef.current, { y: 10, duration: 1.8, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.4 })
      }, [], 3.2)

      // Hold
      .to({}, { duration: 1.4 }, 3.2)

      // Gold shimmer sweep over the overlay
      .fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.0, ease: 'power2.inOut' },
      )
      // Full fade out
      .to(containerRef.current, { opacity: 0, duration: 0.4, ease: 'power2.out' }, '-=0.3')

    return () => { tl.kill() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!visible) return null

  const stars = Array.from({ length: 80 }, (_, i) => ({
    x: (i * 31 + 7) % 100,
    y: (i * 17 + 11) % 70,
    size: i % 8 === 0 ? 3 : i % 4 === 0 ? 2 : 1,
    opacity: 0.2 + (i % 5) * 0.12,
    delay: (i * 0.4) % 4,
  }))

  const goldDust = Array.from({ length: 30 }, (_, i) => ({
    x: (i * 13 + 3) % 100,
    delay: i * 0.5,
  }))

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden opacity-0"
      style={{
        background: 'linear-gradient(175deg, #060412 0%, #0d0b1e 25%, #12091a 50%, #0a0810 75%, #050308 100%)',
      }}
    >
      {/* Stars */}
      {stars.map((s, i) => (
        <Star key={i} {...s} />
      ))}

      {/* Moon glow */}
      <div
        ref={moonGlowRef}
        className="absolute pointer-events-none"
        style={{
          width: '280px',
          height: '280px',
          top: '6%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0.06) 40%, transparent 70%)',
          borderRadius: '50%',
          opacity: 0.35,
        }}
      />

      {/* Thin crescent moon */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '4%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          boxShadow: '-14px 4px 0 2px rgba(232,201,122,0.55)',
          border: '1px solid rgba(232,201,122,0.1)',
          opacity: 0.7,
        }}
      />

      {/* Gold dust rising */}
      {goldDust.map((g, i) => (
        <GoldDust key={i} x={g.x} delay={g.delay} />
      ))}

      {/* Dove pair */}
      <div
        className="absolute flex items-center"
        style={{ top: '34%', left: '50%', transform: 'translateX(-50%)' }}
      >
        <div ref={doveLeftRef} style={{ width: '160px', opacity: 0 }}>
          <ElegantDove />
        </div>

        {/* Gold radiance burst between doves */}
        <div
          ref={burstRef}
          className="mx-1"
          style={{ opacity: 0, width: '50px', textAlign: 'center', flexShrink: 0 }}
        >
          <svg viewBox="0 0 60 60" width="50" height="50">
            {/* Radiance lines */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, j) => (
              <line
                key={j}
                x1={30 + Math.cos(angle * Math.PI / 180) * 12}
                y1={30 + Math.sin(angle * Math.PI / 180) * 12}
                x2={30 + Math.cos(angle * Math.PI / 180) * (24 + (j % 3) * 4)}
                y2={30 + Math.sin(angle * Math.PI / 180) * (24 + (j % 3) * 4)}
                stroke={j % 2 === 0 ? '#C9A84C' : '#E8C97A'}
                strokeWidth={j % 4 === 0 ? 1.5 : 0.8}
                opacity={0.6 + (j % 3) * 0.1}
              />
            ))}
            {/* Center gold star */}
            <circle cx="30" cy="30" r="6" fill="#E8C97A" opacity="0.9" />
            <circle cx="30" cy="30" r="3" fill="white" opacity="0.8" />
          </svg>
        </div>

        <div ref={doveRightRef} style={{ width: '160px', opacity: 0 }}>
          <ElegantDove flip />
        </div>
      </div>

      {/* Thin horizontal gold line */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '58%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)',
          opacity: 0,
          animation: 'loader-line-appear 1s ease-out 3.2s forwards',
        }}
      />

      {/* Elegant text */}
      <div
        ref={textRef}
        className="absolute opacity-0"
        style={{ top: '61%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}
      >
        <p
          className="font-display text-base md:text-lg text-gold/80 uppercase"
          style={{ letterSpacing: '0.5em', textShadow: '0 0 30px rgba(201,168,76,0.4)' }}
        >
          Wedding Invitation
        </p>
      </div>

      {/* Shimmer reveal overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none opacity-0"
        style={{
          background: 'linear-gradient(165deg, #060412 0%, #0d0b1e 30%, #12091a 70%, #050308 100%)',
        }}
      />
    </div>
  )
}
