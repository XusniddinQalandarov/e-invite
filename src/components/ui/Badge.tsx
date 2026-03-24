import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'draft' | 'paid' | 'style'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'style', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-body font-medium tracking-wide',
        variant === 'draft' && 'bg-amber-100 text-amber-800',
        variant === 'paid' && 'bg-emerald-100 text-emerald-800',
        variant === 'style' && 'bg-gold/15 text-gold border border-gold/30',
        className,
      )}
    >
      {children}
    </span>
  )
}
