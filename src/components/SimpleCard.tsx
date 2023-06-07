import { ActionIcon, Card, Group, HoverCard, Indicator, Title, UnstyledButton } from '@mantine/core'
import { modals } from '@mantine/modals'
import { IconTrash } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export const SimpleCard = ({
  name,
  selected,
  onSelect,
  onRemove,
  children,
}: {
  name: string
  selected: boolean
  onSelect?: () => void
  onRemove?: () => void
  children: React.ReactNode
}) => {
  const { t } = useTranslation()

  return (
    <HoverCard withArrow withinPortal>
      <HoverCard.Target>
        <Indicator position="bottom-center" size={18} disabled={!selected}>
          <Card withBorder shadow="sm" p="sm">
            <Card.Section withBorder inheritPadding py="sm">
              <Group position="apart">
                <UnstyledButton onClick={onSelect}>
                  <Title order={4}>{name}</Title>
                </UnstyledButton>

                <Group>
                  {onRemove && (
                    <ActionIcon
                      color="red"
                      size="xs"
                      onClick={() => {
                        modals.openConfirmModal({
                          title: t('actions.remove'),
                          labels: {
                            cancel: t('confirmModal.cancel'),
                            confirm: t('confirmModal.confirm'),
                          },
                          children: t('confirmModal.removeConfirmDescription'),
                          onConfirm: onRemove,
                        })
                      }}
                    >
                      <IconTrash />
                    </ActionIcon>
                  )}
                </Group>
              </Group>
            </Card.Section>
          </Card>
        </Indicator>
      </HoverCard.Target>

      <HoverCard.Dropdown>{children}</HoverCard.Dropdown>
    </HoverCard>
  )
}
