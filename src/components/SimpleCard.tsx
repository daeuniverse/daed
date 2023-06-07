import { ActionIcon, Card, Group, HoverCard, Indicator, Title } from '@mantine/core'
import { modals } from '@mantine/modals'
import { IconTrash } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export const SimpleCard = ({
  name,
  selected,
  onRemove,
  children,
}: {
  name: string
  selected: boolean
  onRemove: () => void
  children: React.ReactNode
}) => {
  const { t } = useTranslation()

  return (
    <HoverCard withArrow withinPortal>
      <HoverCard.Target>
        <Indicator position="bottom-center" size={18} disabled={!selected}>
          <Card withBorder shadow="sm">
            <Card.Section withBorder inheritPadding py="sm">
              <Group position="apart">
                <Title order={4}>{name}</Title>

                <Group>
                  <ActionIcon
                    color="red"
                    size="xs"
                    onClick={() => {
                      modals.openConfirmModal({
                        title: t('actions.remove'),
                        labels: {
                          cancel: 'No',
                          confirm: "Yes, I'm sure",
                        },
                        children: 'Are you sure you want to remove this?',
                        onConfirm: onRemove,
                      })
                    }}
                  >
                    <IconTrash />
                  </ActionIcon>
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
