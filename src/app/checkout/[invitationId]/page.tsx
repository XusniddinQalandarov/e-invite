import { notFound, redirect } from 'next/navigation'
import { readJson } from '@/lib/db'
import type { Invitation } from '@/types/invitation'
import { getTemplateById } from '@/lib/templates/templateConfigs'
import { CheckoutClient } from './CheckoutClient'

interface Props {
  params: { invitationId: string }
}

export default async function CheckoutPage({ params }: Props) {
  const invitations = await readJson<Invitation[]>('invitations.json')
  const invitation = invitations.find(i => i.id === params.invitationId)
  if (!invitation) notFound()
  if (invitation.status === 'paid') redirect(`/invitation/${invitation.id}`)

  const template = getTemplateById(invitation.templateId)

  return (
    <CheckoutClient
      invitation={invitation}
      templateName={template?.name ?? 'Unknown Template'}
    />
  )
}
