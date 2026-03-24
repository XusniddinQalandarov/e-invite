'use client'

import { useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapPin, Download, Link2, MessageCircle, Maximize2, Check } from 'lucide-react'
import { InvitationCanvas } from '@/components/canvas/InvitationCanvas'
import { InvitationLoader } from '@/components/invitation/InvitationLoader'
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
  const [loading, setLoading] = useState(true)

  // Share link always points to the clean share page
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/invitation/${invitation.id}/share`
    : `/invitation/${invitation.id}/share`

  function handleDownload() {
    const dataUrl = canvasRef.current?.exportPNG()
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `invitation-${invitation.id.slice(0, 8)}.png`
    a.click()
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  function handleWhatsApp() {
    const msg =
      `${invitation.groomName} & ${invitation.brideName}\n` +
      `${invitation.weddingDate} — ${invitation.weddingTime}\n` +
      `${invitation.venueName}\n\n` +
      shareUrl
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  function handleOpenMap() {
    if (invitation.mapUrl) {
      window.open(invitation.mapUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }, [])

  return (
    <>
      {loading && <InvitationLoader onComplete={() => setLoading(false)} />}

      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center isolate overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #fdf9f4 0%, #f5ede2 40%, #fdf0ea 70%, #faf7f3 100%)',
        }}
      >
        {/* Subtle photo tint in background */}
        {invitation.photoUrl && (
          <div
            className="absolute inset-0 pointer-events-none -z-10"
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

        {/* Back button — top left, subtle */}
        <Link
          href="/"
          className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 text-brand-text/30 hover:text-gold text-xs font-body tracking-wide transition-colors"
        >
          <ArrowLeft size={13} strokeWidth={1.75} />
          sening·toy
        </Link>

        {/* Invitation card — fills the viewport height */}
        <div
          className="relative w-full overflow-hidden rounded-none sm:rounded-lg shadow-[0_8px_60px_rgba(0,0,0,0.12)] ring-1 ring-gold/15"
          style={{
            // Portrait 4:5 ratio (800:1000), fill viewport height on mobile, constrained on desktop
            height: 'min(100dvh, calc(100dvw * 1.25))',
            maxHeight: '100dvh',
            width: 'min(100vw, calc(100dvh * 0.8))',
            maxWidth: '600px',
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

        {/* Floating action bar — bottom center */}
        <div
          className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3"
          style={{
            background: 'linear-gradient(to top, rgba(250,247,243,0.95) 60%, transparent)',
          }}
        >
          {isPurchased && (
            <ActionBtn onClick={handleDownload} title={t.invitation.download}>
              <Download size={15} strokeWidth={1.8} />
            </ActionBtn>
          )}
          <ActionBtn onClick={handleCopyLink} title={copied ? t.invitation.linkCopied : t.invitation.copyLink} active={copied}>
            {copied ? <Check size={15} strokeWidth={2} /> : <Link2 size={15} strokeWidth={1.8} />}
          </ActionBtn>
          <ActionBtn onClick={handleWhatsApp} title={t.invitation.whatsapp}>
            <MessageCircle size={15} strokeWidth={1.8} />
          </ActionBtn>
          {invitation.mapUrl && (
            <ActionBtn onClick={handleOpenMap} title="Open Map">
              <MapPin size={15} strokeWidth={1.8} />
            </ActionBtn>
          )}
          <ActionBtn onClick={toggleFullscreen} title="Fullscreen">
            <Maximize2 size={15} strokeWidth={1.8} />
          </ActionBtn>

          {!isPurchased && (
            <a
              href={`/checkout/${invitation.id}`}
              className="ml-2 px-4 py-2 text-xs font-body font-medium bg-gold text-dark rounded hover:bg-gold-light transition-colors active:scale-95"
            >
              {template.priceLabel} →
            </a>
          )}
        </div>
      </div>
    </>
  )
}

function ActionBtn({
  onClick,
  title,
  active,
  children,
}: {
  onClick: () => void
  title: string
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-all active:scale-95 ${
        active
          ? 'text-gold bg-gold/10'
          : 'text-brand-text/40 hover:text-gold hover:bg-gold/5'
      }`}
    >
      {children}
      <span className="text-[10px] font-body leading-none tracking-wide">{title}</span>
    </button>
  )
}
