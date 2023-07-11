import { ActionIcon } from '@mantine/core'
import { IconRefresh } from '@tabler/icons-react'

import { useUpdateSubscriptionsMutation } from '~/apis'

export const UpdateSubscriptionAction = ({ id, loading }: { id: string; loading?: boolean }) => {
  const updateSubscriptionsMutation = useUpdateSubscriptionsMutation()

  return (
    <ActionIcon
      loading={loading || updateSubscriptionsMutation.isLoading}
      size="xs"
      onClick={() => updateSubscriptionsMutation.mutate([id])}
    >
      <IconRefresh />
    </ActionIcon>
  )
}
