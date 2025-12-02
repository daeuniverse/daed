import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '~/lib/utils'

import { DialogOverlay, DialogPortal } from './dialog'

export type ScrollableDialogContentSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

const sizeClasses: Record<ScrollableDialogContentSize, string> = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
  full: 'sm:w-[90vw] sm:h-[90vh] sm:max-w-4xl',
}

export interface ScrollableDialogContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
  showCloseButton?: boolean
  size?: ScrollableDialogContentSize
}

function ScrollableDialogContent({
  className,
  children,
  showCloseButton = true,
  size = 'md',
  ...props
}: ScrollableDialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        aria-describedby={undefined}
        data-slot="dialog-content"
        className={cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'fixed top-[50%] left-[50%] z-50 translate-x-[-50%] translate-y-[-50%]',
          'flex flex-col w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)]',
          'rounded-lg border shadow-lg duration-200',
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 z-10"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function ScrollableDialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('shrink-0 flex flex-col gap-2 text-center sm:text-left p-6 border-b', className)}
      {...props}
    />
  )
}

function ScrollableDialogBody({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="dialog-body" className={cn('flex-1 overflow-y-auto min-h-0 p-6', className)} {...props} />
}

function ScrollableDialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn('shrink-0 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end p-6 border-t', className)}
      {...props}
    />
  )
}

export { ScrollableDialogBody, ScrollableDialogContent, ScrollableDialogFooter, ScrollableDialogHeader }
