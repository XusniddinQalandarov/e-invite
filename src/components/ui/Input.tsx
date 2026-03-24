'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-body text-brand-text/60 tracking-wide"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'bg-white/60 border border-gold/25 rounded px-3 py-2.5 text-brand-text font-body text-sm placeholder:text-brand-text/30 focus:outline-none focus:border-gold/60 focus:bg-white/80 transition-all',
            error && 'border-red-400 focus:border-red-400',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 font-body">{error}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'
