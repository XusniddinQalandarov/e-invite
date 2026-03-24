import { NextRequest, NextResponse } from 'next/server'
import { readJson, writeJson } from '@/lib/db'
import type { Invitation } from '@/types/invitation'

interface Params { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  const invitations = await readJson<Invitation[]>('invitations.json')
  const invitation = invitations.find(i => i.id === params.id)
  if (!invitation) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(invitation)
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const body = await req.json() as Partial<Invitation>
  const invitations = await readJson<Invitation[]>('invitations.json')
  const index = invitations.findIndex(i => i.id === params.id)
  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const updated: Invitation = {
    ...invitations[index]!,
    ...body,
    id: params.id,
    updatedAt: new Date().toISOString(),
  }

  invitations[index] = updated
  await writeJson('invitations.json', invitations)
  return NextResponse.json(updated)
}
