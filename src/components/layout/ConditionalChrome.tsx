'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/ui/Navbar'

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isInvitationShare = pathname?.startsWith('/invitation/') ?? false

  if (isInvitationShare) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}
