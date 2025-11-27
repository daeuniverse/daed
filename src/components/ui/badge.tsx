'use client'

import * as React from 'react'

import { cn } from '~/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  color?: string
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', radius = 'full', color, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/80',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      success: 'bg-green-500 text-white hover:bg-green-500/80',
      warning: 'bg-yellow-500 text-white hover:bg-yellow-500/80',
    }

    const sizeClasses = {
      xs: 'px-1.5 py-0.5 text-xs',
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-sm',
    }

    const radiusClasses = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    }

    const style = color ? { backgroundColor: color } : undefined

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          !color && variantClasses[variant],
          sizeClasses[size],
          radiusClasses[radius],
          className,
        )}
        style={style}
        {...props}
      />
    )
  },
)
Badge.displayName = 'Badge'

export { Badge }
export type { BadgeProps }
