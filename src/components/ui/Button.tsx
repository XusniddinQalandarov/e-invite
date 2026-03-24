'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-body font-medium tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'primary' && 'bg-gold text-dark hover:bg-gold-light active:scale-95',
          variant === 'secondary' && 'border border-gold text-gold hover:bg-gold/10 active:scale-95',
          variant === 'ghost' && 'text-brand-text hover:text-gold underline-offset-4 hover:underline',
          size === 'sm' && 'text-sm px-4 py-2 rounded',
          size === 'md' && 'text-base px-6 py-3 rounded-sm',
          size === 'lg' && 'text-lg px-8 py-4 rounded-sm tracking-wider',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
