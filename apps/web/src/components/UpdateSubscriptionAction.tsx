import { RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useUpdateSubscriptionsMutation } from '~/apis'
import { Button } from '~/components/ui/button'
import { SimpleTooltip } from '~/components/ui/tooltip'

export function UpdateSubscriptionAction({ id, loading }: { id: string; loading?: boolean }) {
  const { t } = useTranslation()
  const updateSubscriptionsMutation = useUpdateSubscriptionsMutation()

  return (
    <SimpleTooltip label={t('actions.update')}>
      <Button
        variant="ghost"
        size="xs"
        loading={loading || updateSubscriptionsMutation.isPending}
        onClick={() => updateSubscriptionsMutation.mutate([id])}
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </SimpleTooltip>
  )
}
