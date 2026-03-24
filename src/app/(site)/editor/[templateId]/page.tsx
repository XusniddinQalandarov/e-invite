'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import { Check } from 'lucide-react'
import { InvitationCanvas } from '@/components/canvas/InvitationCanvas'
import { EditorForm, type InvitationFormData } from '@/components/editor/EditorForm'
import { getTemplateById } from '@/lib/templates/templateConfigs'
import type { InvitationCanvasHandle, Invitation } from '@/types/invitation'

export default function EditorPage() {
  const { templateId } = useParams<{ templateId: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()

  const canvasRef = useRef<InvitationCanvasHandle>(null)
  const [formData, setFormData] = useState<Partial<InvitationFormData>>({})
  const [invitationId, setInvitationId] = useState<string | null>(
    searchParams.get('invitationId'),
  )
  const [isSaving, setIsSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)

  const template = getTemplateById(templateId)

  // Load existing draft if invitationId is in query
  useEffect(() => {
    const id = searchParams.get('invitationId')
    if (!id) return
    fetch(`/api/invitations/${id}`)
      .then(r => r.json())
      .then((inv: Invitation) => {
        setInvitationId(inv.id)
        setFormData({
          brideName: inv.brideName,
          groomName: inv.groomName,
          weddingDate: inv.weddingDate,
          weddingTime: inv.weddingTime,
          venueName: inv.venueName,
          venueAddress: inv.venueAddress,
          mapUrl: inv.mapUrl,
          language: inv.language,
          photoUrl: inv.photoUrl,
        })
      })
      .catch(console.error)
  }, [searchParams])

  const handleSave = useCallback(
    async (data: InvitationFormData) => {
      setIsSaving(true)
      try {
        const payload = {
          ...data,
          templateId,
          status: 'draft' as const,
        }

        let result: Invitation
        if (invitationId) {
          const res = await fetch(`/api/invitations/${invitationId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
          result = await res.json()
        } else {
          const res = await fetch('/api/invitations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
          result = await res.json()
          setInvitationId(result.id)
          window.history.replaceState(
            {},
            '',
            `/editor/${templateId}?invitationId=${result.id}`,
          )
        }

        setSavedMsg(true)
        setTimeout(() => setSavedMsg(false), 2000)
      } finally {
        setIsSaving(false)
      }
    },
    [invitationId, templateId],
  )

  const handlePurchase = useCallback(() => {
    if (!invitationId) {
      alert('Please save your draft first.')
      return
    }
    router.push(`/checkout/${invitationId}`)
  }, [invitationId, router])

  if (!template) return notFound()

  return (
    <div className="min-h-screen pt-20 bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left: Form */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-display text-2xl text-dark">{template.name}</h1>
                {savedMsg && (
                  <span className="inline-flex items-center gap-1 text-xs font-body text-emerald-600 animate-pulse">
                    <Check size={13} strokeWidth={2.5} />
                    Saved
                  </span>
                )}
              </div>
              <EditorForm
                initialData={formData}
                onDataChange={setFormData}
                onSave={handleSave}
                onPurchase={handlePurchase}
                isSaving={isSaving}
              />
            </div>
          </div>

          {/* Right: Canvas */}
          <div className="flex-1 w-full max-w-[480px] mx-auto lg:mx-0">
            <p className="text-xs font-body text-brand-text/40 text-center mb-3 tracking-wide uppercase">
              Live Preview
            </p>
            <InvitationCanvas
              ref={canvasRef}
              template={template}
              data={formData}
              isPurchased={false}
              autoplay
            />
          </div>
        </div>
      </div>
    </div>
  )
}
