import { useTranslation } from 'react-i18next'

import { Button } from '~/components/ui/button'

import { cn } from '~/lib/utils'

export function FormActions({
  className,
  loading,
  reset,
}: {
  className?: string
  loading?: boolean
  reset?: () => void
}) {
  const { t } = useTranslation()

  return (
    <div className={cn('flex justify-end gap-2', className)}>
      <Button type="reset" variant="destructive" onClick={() => reset && reset()} uppercase>
        {t('actions.reset')}
      </Button>

      <Button type="submit" loading={loading} uppercase>
        {t('actions.submit')}
      </Button>
    </div>
  )
}
