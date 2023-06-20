import { ActionIcon } from '@mantine/core'
import { IconDownload } from '@tabler/icons-react'

import { useUpdateSubscriptionsMutation } from '~/apis'

export const UpdateSubscriptionAction = ({ id, loading }: { id: string; loading?: boolean }) => {
  const updateSubscriptionsMutation = useUpdateSubscriptionsMutation()

  return (
    <ActionIcon
      loading={loading || updateSubscriptionsMutation.isLoading}
      size="sm"
      onClick={() => updateSubscriptionsMutation.mutate([id])}
    >
      <IconDownload />
    </ActionIcon>
  )
}
