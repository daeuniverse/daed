import { useTranslation } from 'react-i18next'

import { Button } from '~/components/ui/button'

export function FormActions({ loading, reset }: { loading?: boolean, reset?: () => void }) {
  const { t } = useTranslation()

  return (
    <div className="flex justify-end gap-2">
      <Button type="reset" variant="destructive" onClick={() => reset && reset()} uppercase>
        {t('actions.reset')}
      </Button>

      <Button type="submit" loading={loading} uppercase>
        {t('actions.submit')}
      </Button>
    </div>
  )
}
