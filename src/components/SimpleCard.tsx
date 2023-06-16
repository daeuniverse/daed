import { ActionIcon, Card, Drawer, Group, Indicator, Title, UnstyledButton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { IconDetails, IconTrash } from '@tabler/icons-react'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

export const SimpleCard = ({
  name,
  selected,
  onSelect,
  onRemove,
  actions,
  children,
}: {
  name: string
  selected: boolean
  onSelect?: () => void
  onRemove?: () => void
  actions?: React.ReactNode
  children: React.ReactNode
}) => {
  const { t } = useTranslation()

  const [openedDetailsModal, { open: openDetailsModal, close: closeDetailsModal }] = useDisclosure(false)

  return (
    <Fragment>
      <Indicator position="bottom-center" size={18} disabled={!selected}>
        <Card withBorder shadow="sm" p="sm">
          <Card.Section withBorder inheritPadding py="sm">
            <Group position="apart">
              <UnstyledButton onClick={onSelect}>
                <Title order={4}>{name}</Title>
              </UnstyledButton>

              <Group>
                {actions}

                <ActionIcon size="xs" onClick={openDetailsModal}>
                  <IconDetails />
                </ActionIcon>

                {!selected && onRemove && (
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

      <Drawer title={name} opened={openedDetailsModal} onClose={closeDetailsModal}>
        {children}
      </Drawer>
    </Fragment>
  )
}
