import { RefreshCw } from 'lucide-react'

import { useUpdateSubscriptionsMutation } from '~/apis'
import { Button } from '~/components/ui/button'

export const UpdateSubscriptionAction = ({ id, loading }: { id: string; loading?: boolean }) => {
  const updateSubscriptionsMutation = useUpdateSubscriptionsMutation()

  return (
    <Button
      variant="ghost"
      size="xs"
      loading={loading || updateSubscriptionsMutation.isPending}
      onClick={() => updateSubscriptionsMutation.mutate([id])}
    >
      <RefreshCw className="h-4 w-4" />
    </Button>
  )
}
