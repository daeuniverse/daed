import type { ToasterProps } from 'sonner'
import { useStore } from '@nanostores/react'
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from 'lucide-react'
import { Toaster as Sonner } from 'sonner'

import { colorSchemeAtom } from '~/store'

function Toaster({ ...props }: ToasterProps) {
  const colorScheme = useStore(colorSchemeAtom)

  return (
    <Sonner
      theme={colorScheme}
      className="toaster group"
      position="top-right"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: 'bg-card text-card-foreground border-border shadow-lg',
          title: 'text-foreground font-semibold',
          description: 'text-muted-foreground',
          success: 'border-green-500/50',
          error: 'border-destructive/50',
          warning: 'border-yellow-500/50',
          info: 'border-primary/50',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
