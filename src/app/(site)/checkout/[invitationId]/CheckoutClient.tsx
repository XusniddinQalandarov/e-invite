'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/lib/language-context'
import type { Invitation } from '@/types/invitation'

interface Props {
  invitation: Invitation
  templateName: string
  templatePrice: string
}

export function CheckoutClient({ invitation, templateName, templatePrice }: Props) {
  const { t } = useLanguage()
  const router = useRouter()
  const [paying, setPaying] = useState(false)

  async function handlePay() {
    setPaying(true)
    try {
      const res = await fetch(`/api/invitations/${invitation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'paid',
          paymentId: `mock_${Date.now()}`,
        }),
      })
      if (res.ok) {
        router.push(`/invitation/${invitation.id}`)
      } else {
        alert('Payment failed. Please try again.')
      }
    } finally {
      setPaying(false)
    }
  }

  const details = [
    { label: 'Template', value: templateName },
    { label: 'Bride', value: invitation.brideName },
    { label: 'Groom', value: invitation.groomName },
    { label: 'Date', value: invitation.weddingDate },
    { label: 'Time', value: invitation.weddingTime },
    { label: 'Venue', value: invitation.venueName },
    ...(invitation.venueAddress ? [{ label: 'Address', value: invitation.venueAddress }] : []),
  ]

  return (
    <div className="min-h-screen pt-24 bg-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <p className="font-body text-xs text-gold tracking-[0.3em] uppercase mb-3">
          Final Step
        </p>
        <h1 className="font-display text-4xl text-dark mb-10">{t.checkout.title}</h1>

        {/* Summary */}
        <div className="relative border border-gold/20 rounded-sm p-6 mb-6 bg-white/50">
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gold/40" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gold/40" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-gold/40" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gold/40" />

          <h2 className="font-body text-[10px] text-brand-text/40 uppercase tracking-[0.25em] mb-5">
            {t.checkout.summary}
          </h2>
          <div className="flex flex-col gap-2.5">
            {details.map(d => (
              <div key={d.label} className="flex items-baseline justify-between gap-4">
                <span className="font-body text-xs text-brand-text/40 shrink-0">{d.label}</span>
                <span className="font-body text-sm text-dark text-right">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between py-5 border-t border-b border-gold/15 mb-8">
          <span className="font-body text-sm text-brand-text/50">Total</span>
          <span className="font-display text-3xl text-gold">{templatePrice}</span>
        </div>

        <Button onClick={handlePay} disabled={paying} size="lg" className="w-full">
          {paying ? t.common.loading : t.checkout.pay}
        </Button>

        <p className="text-center font-body text-xs text-brand-text/30 mt-4">
          Payment is simulated in local development mode
        </p>
      </div>
    </div>
  )
}
