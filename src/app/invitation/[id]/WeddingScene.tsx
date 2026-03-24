'use client'

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import gsap from 'gsap'

export interface WeddingSceneHandle {
  playReveal: () => gsap.core.Timeline
}

interface Props {
  groomName: string
  brideName: string
  onRevealComplete?: () => void
}

// SVG Dove facing right
function DoveSVG({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 110 70"
      fill="white"
      style={{ transform: flip ? 'scaleX(-1)' : 'none' }}
      className="drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]"
    >
      {/* Body */}
      <ellipse cx="52" cy="48" rx="28" ry="13" />
      {/* Head */}
      <circle cx="74" cy="38" r="11" />
      {/* Beak */}
      <ellipse cx="84" cy="36" rx="7" ry="3.5" fill="#E8C97A" />
      {/* Eye */}
      <circle cx="77" cy="36" r="2.5" fill="#1A1207" />
      <circle cx="78" cy="35.2" r="0.8" fill="white" />
      {/* Upper wing (animates) */}
      <path className="dove-wing-upper" d="M 58,40 Q 42,14 10,22 Q 28,34 58,40 Z" />
      {/* Lower wing */}
      <path d="M 55,55 Q 32,68 12,58 Q 30,52 55,55 Z" />
      {/* Tail feathers */}
      <path d="M 24,46 L 4,38 L 6,54 Z" />
      <path d="M 26,50 L 3,48 L 8,60 Z" />
      <path d="M 28,53 L 6,58 L 14,66 Z" />
      {/* Olive branch */}
      <line x1="80" y1="46" x2="88" y2="56" stroke="#6aad6a" strokeWidth="1.5" fill="none" />
      <ellipse cx="88" cy="56" rx="4" ry="2.5" fill="#5a9a5a" transform="rotate(-20, 88, 56)" />
      <ellipse cx="84" cy="52" rx="3" ry="2" fill="#6aad6a" transform="rotate(30, 84, 52)" />
    </svg>
  )
}

// Falling petal
function Petal({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={style}
    >
      <svg viewBox="0 0 30 40" width="20" height="28">
        <path
          d="M 15,2 Q 26,10 25,22 Q 24,34 15,38 Q 6,34 5,22 Q 4,10 15,2 Z"
          fill="rgba(255,200,200,0.7)"
          stroke="rgba(255,180,180,0.4)"
          strokeWidth="0.5"
        />
        <path
          d="M 15,4 Q 15,20 15,36"
          fill="none"
          stroke="rgba(255,150,150,0.4)"
          strokeWidth="0.8"
        />
      </svg>
    </div>
  )
}

// Cloud shape
function Cloud({ style }: { style: React.CSSProperties }) {
  return (
    <div className="absolute pointer-events-none" style={style}>
      <div className="relative">
        <div
          className="absolute"
          style={{
            width: '180px', height: '60px',
            background: 'rgba(255,255,255,0.75)',
            borderRadius: '50px',
            filter: 'blur(8px)',
          }}
        />
        <div
          className="absolute"
          style={{
            width: '100px', height: '70px',
            background: 'rgba(255,255,255,0.7)',
            borderRadius: '50%',
            top: '-30px', left: '25px',
            filter: 'blur(8px)',
          }}
        />
        <div
          className="absolute"
          style={{
            width: '80px', height: '55px',
            background: 'rgba(255,255,255,0.65)',
            borderRadius: '50%',
            top: '-18px', left: '80px',
            filter: 'blur(8px)',
          }}
        />
      </div>
    </div>
  )
}

export const WeddingScene = forwardRef<WeddingSceneHandle, Props>(
  ({ groomName, brideName, onRevealComplete }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const doveLeftRef = useRef<HTMLDivElement>(null)
    const doveRightRef = useRef<HTMLDivElement>(null)
    const burstRef = useRef<HTMLDivElement>(null)
    const cloud1Ref = useRef<HTMLDivElement>(null)
    const cloud2Ref = useRef<HTMLDivElement>(null)
    const cloud3Ref = useRef<HTMLDivElement>(null)
    const namesRef = useRef<HTMLDivElement>(null)

    const playReveal = () => {
      const tl = gsap.timeline({ onComplete: onRevealComplete })

      // Cloud drift (loop)
      if (cloud1Ref.current) {
        gsap.to(cloud1Ref.current, { x: 80, duration: 12, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      }
      if (cloud2Ref.current) {
        gsap.to(cloud2Ref.current, { x: -60, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2 })
      }
      if (cloud3Ref.current) {
        gsap.to(cloud3Ref.current, { x: 50, duration: 14, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 })
      }

      // Wing flap loop for both doves
      const wingLeft = doveLeftRef.current?.querySelector('.dove-wing-upper')
      const wingRight = doveRightRef.current?.querySelector('.dove-wing-upper')
      if (wingLeft) {
        gsap.to(wingLeft, {
          transformOrigin: 'right center',
          rotateZ: -25,
          duration: 0.35,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        })
      }
      if (wingRight) {
        gsap.to(wingRight, {
          transformOrigin: 'left center',
          rotateZ: 25,
          duration: 0.35,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: 0.1,
        })
      }

      // Dove entrance: fly from far edges toward center-top
      tl.set(doveLeftRef.current, { x: -220, y: 60, opacity: 0 })
        .set(doveRightRef.current, { x: 220, y: 80, opacity: 0 })
        .to([doveLeftRef.current, doveRightRef.current], {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        }, 0.4)
        .to(doveLeftRef.current, {
          x: -40,
          y: 0,
          duration: 2.2,
          ease: 'power2.inOut',
        }, 0.4)
        .to(doveRightRef.current, {
          x: 40,
          y: 0,
          duration: 2.2,
          ease: 'power2.inOut',
        }, 0.4)

      // Burst of petals when doves meet
      .to(burstRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.5)',
      }, 2.4)

      // Names appear
      .fromTo(
        namesRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        2.6,
      )

      // Doves circle each other gently after meeting
      .to(doveLeftRef.current, {
        x: -60,
        y: -15,
        duration: 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      }, 3)
      .to(doveRightRef.current, {
        x: 60,
        y: 15,
        duration: 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 0.5,
      }, 3)

      return tl
    }

    useImperativeHandle(ref, () => ({ playReveal }))

    useEffect(() => {
      const tl = playReveal()
      return () => { tl.kill() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const petals = Array.from({ length: 32 }, (_, i) => ({
      left: `${(i * 13 + Math.sin(i) * 20 + 50) % 100}%`,
      animationDelay: `${i * 0.4}s`,
      animationDuration: `${4 + (i % 5)}s`,
      opacity: 0.6 + (i % 4) * 0.1,
      fontSize: `${14 + (i % 4) * 4}px`,
    }))

    return (
      <div
        ref={containerRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 1 }}
      >
        {/* Clouds */}
        <div ref={cloud1Ref} className="absolute" style={{ top: '8%', left: '5%' }}>
          <Cloud style={{}} />
        </div>
        <div ref={cloud2Ref} className="absolute" style={{ top: '14%', right: '8%' }}>
          <Cloud style={{ opacity: 0.85 }} />
        </div>
        <div ref={cloud3Ref} className="absolute" style={{ top: '25%', left: '30%' }}>
          <Cloud style={{ opacity: 0.6, transform: 'scale(0.7)' }} />
        </div>

        {/* Falling petals */}
        {petals.map((p, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: p.left,
              top: '-40px',
              animation: `petal-fall ${p.animationDuration} linear ${p.animationDelay} infinite`,
              opacity: p.opacity,
            }}
          >
            <Petal style={{}} />
          </div>
        ))}

        {/* Dove pair — positioned at top-center */}
        <div
          className="absolute flex items-center gap-0"
          style={{
            top: '12%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {/* Left dove */}
          <div ref={doveLeftRef} style={{ width: '110px', opacity: 0 }}>
            <DoveSVG />
          </div>

          {/* Burst / heart between doves */}
          <div
            ref={burstRef}
            style={{ opacity: 0, scale: 0, width: '60px', textAlign: 'center' }}
          >
            <svg viewBox="0 0 60 60" width="50" height="50">
              {/* Heart */}
              <path
                d="M30,45 C30,45 8,32 8,18 C8,11 14,6 20,6 C24,6 28,9 30,12 C32,9 36,6 40,6 C46,6 52,11 52,18 C52,32 30,45 30,45Z"
                fill="rgba(255,100,120,0.85)"
              />
              {/* Gold sparkles */}
              {[0, 60, 120, 180, 240, 300].map((angle, j) => (
                <circle
                  key={j}
                  cx={30 + Math.cos(angle * Math.PI / 180) * 24}
                  cy={30 + Math.sin(angle * Math.PI / 180) * 24}
                  r="2"
                  fill="#E8C97A"
                />
              ))}
            </svg>
          </div>

          {/* Right dove (mirrored) */}
          <div ref={doveRightRef} style={{ width: '110px', opacity: 0 }}>
            <DoveSVG flip />
          </div>
        </div>

        {/* Names that appear */}
        <div
          ref={namesRef}
          className="absolute opacity-0"
          style={{
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            textAlign: 'center',
          }}
        >
          <p
            className="font-display text-white text-xl md:text-2xl"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6), 0 0 40px rgba(201,168,76,0.3)' }}
          >
            {groomName} <span className="text-[#E8C97A]">&</span> {brideName}
          </p>
        </div>
      </div>
    )
  },
)
WeddingScene.displayName = 'WeddingScene'
