import Link from 'next/link'
import { readJson } from '@/lib/db'
import type { Invitation } from '@/types/invitation'
import { getTemplateById } from '@/lib/templates/templateConfigs'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const invitations = await readJson<Invitation[]>('invitations.json')
  const sorted = [...invitations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <div className="min-h-screen pt-24 pb-20 bg-cream">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="font-body text-xs text-gold tracking-[0.3em] uppercase mb-2">
              Your work
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-dark">My Invitations</h1>
          </div>
          <Link href="/templates">
            <Button variant="primary">+ Create New</Button>
          </Link>
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-24 border border-gold/15 rounded-sm bg-white/30">
            <p className="font-display text-2xl text-dark/40 mb-3">Nothing here yet</p>
            <p className="font-body text-brand-text/40 text-sm mb-8">
              Create your first wedding invitation
            </p>
            <Link href="/templates">
              <Button variant="secondary">Browse Templates</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sorted.map(inv => {
              const template = getTemplateById(inv.templateId)
              const formattedDate = (() => {
                try {
                  return new Date(inv.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                } catch {
                  return inv.createdAt.slice(0, 10)
                }
              })()

              return (
                <div
                  key={inv.id}
                  className="border border-gold/15 rounded-sm px-5 py-4 bg-white/40 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-gold/30 hover:bg-white/60 transition-all"
                >
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                      <span className="font-display text-lg text-dark leading-tight">
                        {inv.groomName} & {inv.brideName}
                      </span>
                      <Badge variant={inv.status === 'paid' ? 'paid' : 'draft'}>
                        {inv.status === 'paid' ? 'Paid' : 'Draft'}
                      </Badge>
                    </div>
                    <p className="font-body text-xs text-brand-text/45">
                      {template?.name ?? 'Unknown'} · {inv.weddingDate} · Created {formattedDate}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/invitation/${inv.id}`}>
                      <Button variant="secondary" size="sm">View</Button>
                    </Link>
                    <Link href={`/editor/${inv.templateId}?invitationId=${inv.id}`}>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
