import { Input, Stack, Text } from '@mantine/core'
import { forwardRef } from 'react'

interface SelectItemWithDescriptionProps extends React.ComponentPropsWithoutRef<'div'> {
  label: React.ReactNode
  description: React.ReactNode
}

export const SelectItemWithDescription = forwardRef<HTMLDivElement, SelectItemWithDescriptionProps>(
  ({ label, description, ...props }, ref) => (
    <Stack ref={ref} spacing={4} {...props}>
      <Text>{label}</Text>
      <Input.Description>{description}</Input.Description>
    </Stack>
  )
)
