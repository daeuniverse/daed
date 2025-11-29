import { cn } from '~/lib/utils'

interface SelectItemWithDescriptionProps extends React.ComponentPropsWithoutRef<'div'> {
  label: React.ReactNode
  description?: React.ReactNode
  selected?: boolean
}

export function SelectItemWithDescription({
  ref,
  label,
  description,
  selected,
  ...props
}: SelectItemWithDescriptionProps & { ref?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={ref} className="flex flex-col gap-1" {...props}>
      <span className="text-sm">{label}</span>

      {description && (
        <span className={cn('text-xs text-muted-foreground', selected && 'text-primary-foreground/70')}>
          {description}
        </span>
      )}
    </div>
  )
}
