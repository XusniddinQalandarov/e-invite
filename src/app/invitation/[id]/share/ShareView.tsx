'use client'

import { useRef, useState } from 'react'
import { MapPin } from 'lucide-react'
import { InvitationCanvas } from '@/components/canvas/InvitationCanvas'
import { InvitationLoader } from '@/components/invitation/InvitationLoader'
import type { Invitation, InvitationCanvasHandle } from '@/types/invitation'
import type { TemplateConfig } from '@/types/template'

interface Props {
  invitation: Invitation
  template: TemplateConfig
  isPurchased: boolean
}

export function ShareView({ invitation, template, isPurchased }: Props) {
  const canvasRef = useRef<InvitationCanvasHandle>(null)
  const [loading, setLoading] = useState(true)

  function handleOpenMap() {
    if (invitation.mapUrl) {
      window.open(invitation.mapUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <>
      {loading && <InvitationLoader onComplete={() => setLoading(false)} />}

      {/* True fullscreen — card fills 100% of viewport */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #fdf9f4 0%, #f5ede2 40%, #fdf0ea 70%, #faf7f3 100%)',
        }}
      >
        {/* Subtle photo background tint */}
        {invitation.photoUrl && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${invitation.photoUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(40px) saturate(0.4) brightness(1.5)',
              transform: 'scale(1.2)',
              opacity: 0.15,
            }}
          />
        )}

        {/* Invitation card — fills the full viewport */}
        <div
          className="relative overflow-hidden"
          style={{
            height: '100dvh',
            width: 'min(100vw, calc(100dvh * 0.8))',
          }}
        >
          <InvitationCanvas
            ref={canvasRef}
            template={template}
            data={invitation}
            isPurchased={isPurchased}
            autoplay
          />
        </div>

        {/* Map link — floating bottom center, only when mapUrl exists */}
        {invitation.mapUrl && (
          <button
            onClick={handleOpenMap}
            className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-body font-medium text-dark/70 hover:text-dark transition-colors"
            style={{
              background: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
              border: '1px solid rgba(201,168,76,0.25)',
            }}
          >
            <MapPin size={13} strokeWidth={1.8} className="text-gold" />
            <span>{invitation.venueName}</span>
            <span className="text-gold/60">→</span>
          </button>
        )}
      </div>
    </>
  )
}
