import { Button, Group } from '@mantine/core'
import { useTranslation } from 'react-i18next'

export const FormActions = ({ reset }: { reset: () => void }) => {
  const { t } = useTranslation()

  return (
    <Group position="right" spacing="xs">
      <Button type="reset" color="red" onClick={() => reset()}>
        {t('actions.reset')}
      </Button>

      <Button type="submit">{t('actions.submit')}</Button>
    </Group>
  )
}
