import * as React from 'react'

import { cn } from '~/lib/utils'

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  block?: boolean
  color?: 'default' | 'blue' | 'red' | 'green' | 'yellow'
}

function Code({
  ref,
  className,
  children,
  block = false,
  color = 'default',
  ...props
}: CodeProps & { ref?: React.RefObject<HTMLElement | null> }) {
  const colorClasses = {
    default: 'bg-muted text-foreground',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    green: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  }

  if (block) {
    return (
      <pre
        ref={ref as React.Ref<HTMLPreElement>}
        className={cn('rounded-md p-4 font-mono text-sm overflow-x-auto', colorClasses[color], className)}
        {...(props as React.HTMLAttributes<HTMLPreElement>)}
      >
        <code>{children}</code>
      </pre>
    )
  }

  return (
    <code
      ref={ref}
      className={cn('relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm', colorClasses[color], className)}
      {...props}
    >
      {children}
    </code>
  )
}
Code.displayName = 'Code'

export { Code }
