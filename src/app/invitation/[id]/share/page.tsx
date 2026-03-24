import { notFound } from 'next/navigation'
import { readJson } from '@/lib/db'
import type { Invitation } from '@/types/invitation'
import { getTemplateById } from '@/lib/templates/templateConfigs'
import { ShareView } from './ShareView'

interface Props {
  params: { id: string }
}

export default async function SharePage({ params }: Props) {
  const invitations = await readJson<Invitation[]>('invitations.json')
  const invitation = invitations.find(i => i.id === params.id)
  if (!invitation) notFound()

  const template = getTemplateById(invitation.templateId)
  if (!template) notFound()

  return (
    <ShareView
      invitation={invitation}
      template={template}
      isPurchased={invitation.status === 'paid'}
    />
  )
}
