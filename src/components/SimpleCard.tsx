import { ActionIcon, Card, Group, Indicator, Modal, Title, UnstyledButton } from '@mantine/core'
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
      <Indicator position="bottom-center" size={12} disabled={!selected}>
        <Card withBorder shadow="sm">
          <Card.Section withBorder>
            <Group position="apart" spacing={0}>
              <UnstyledButton p="sm" sx={{ flex: 1 }} onClick={onSelect}>
                <Title order={4}>{name}</Title>
              </UnstyledButton>

              <Group spacing="sm" p="sm">
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

      <Modal title={name} opened={openedDetailsModal} onClose={closeDetailsModal}>
        {children}
      </Modal>
    </Fragment>
  )
}
