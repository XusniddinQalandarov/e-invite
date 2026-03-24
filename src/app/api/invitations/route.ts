import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { readJson, writeJson } from '@/lib/db'
import { templateConfigs } from '@/lib/templates/templateConfigs'
import type { Invitation } from '@/types/invitation'

export async function GET() {
  const invitations = await readJson<Invitation[]>('invitations.json')
  return NextResponse.json(invitations)
}

export async function POST(req: NextRequest) {
  const body = await req.json() as Omit<Invitation, 'id' | 'createdAt' | 'updatedAt' | 'status'>

  const templateExists = templateConfigs.some(t => t.id === body.templateId)
  if (!templateExists) {
    return NextResponse.json({ error: 'Invalid templateId' }, { status: 400 })
  }

  const now = new Date().toISOString()
  const invitation: Invitation = {
    ...body,
    id: randomUUID(),
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  }

  const invitations = await readJson<Invitation[]>('invitations.json')
  invitations.push(invitation)
  await writeJson('invitations.json', invitations)

  return NextResponse.json(invitation, { status: 201 })
}
