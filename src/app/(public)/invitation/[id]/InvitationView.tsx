'use client'

import { useRef, useState } from 'react'
import { InvitationCanvas } from '@/components/canvas/InvitationCanvas'
import { Button } from '@/components/ui/Button'
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

  function handleDownload() {
    const dataUrl = canvasRef.current?.exportPNG()
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `invitation-${invitation.id.slice(0, 8)}.png`
    a.click()
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  function handleWhatsApp() {
    const msg =
      `🎊 ${invitation.groomName} & ${invitation.brideName}\n` +
      `📅 ${invitation.weddingDate} — ${invitation.weddingTime}\n` +
      `📍 ${invitation.venueName}\n\n` +
      window.location.href
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="min-h-screen pt-20 bg-dark">
      <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col items-center">
        {/* Names header */}
        <div className="text-center mb-8">
          <p className="font-body text-gold/60 text-xs tracking-[0.3em] uppercase mb-2">
            Wedding Invitation
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-cream">
            {invitation.groomName} & {invitation.brideName}
          </h1>
          <p className="font-body text-cream/40 text-sm mt-2">
            {invitation.weddingDate} · {invitation.weddingTime} · {invitation.venueName}
          </p>
        </div>

        {/* Canvas */}
        <div className="w-full max-w-sm mx-auto mb-8">
          <InvitationCanvas
            ref={canvasRef}
            template={template}
            data={invitation}
            isPurchased={isPurchased}
            autoplay
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          {isPurchased && (
            <Button variant="primary" onClick={handleDownload}>
              {t.invitation.download}
            </Button>
          )}
          <Button variant="secondary" onClick={handleCopyLink}>
            {copied ? t.invitation.linkCopied : t.invitation.copyLink}
          </Button>
          <Button variant="ghost" className="text-cream/60 hover:text-gold" onClick={handleWhatsApp}>
            {t.invitation.whatsapp}
          </Button>
        </div>

        {!isPurchased && (
          <div className="mt-8 border border-gold/20 rounded-sm px-6 py-4 text-center bg-white/5 max-w-sm">
            <p className="font-body text-cream/50 text-sm mb-3">
              Purchase to remove watermark and unlock HD download
            </p>
            <a href={`/checkout/${invitation.id}`}>
              <Button variant="primary" size="sm">Purchase — {t.checkout.price}</Button>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
