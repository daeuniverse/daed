import { Button, Group } from '@mantine/core'
import { useTranslation } from 'react-i18next'

export const FormActions = () => {
  const { t } = useTranslation()

  return (
    <Group position="right" spacing="xs" mt={20}>
      <Button type="reset" color="red">
        {t('actions.reset')}
      </Button>

      <Button type="submit">{t('actions.submit')}</Button>
    </Group>
  )
}
