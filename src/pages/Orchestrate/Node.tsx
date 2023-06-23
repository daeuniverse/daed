import { Spoiler, Text, useMantineTheme } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconCloud } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { useImportNodesMutation, useNodesQuery, useRemoveNodesMutation } from '~/apis'
import { DraggableResourceCard } from '~/components/DraggableResourceCard'
import { ImportResourceFormModal } from '~/components/ImportResourceFormModal'
import { Section } from '~/components/Section'
import { DraggableResourceType } from '~/constants'

export const NodeResource = () => {
  const { t } = useTranslation()
  const theme = useMantineTheme()

  const [openedImportNodeFormModal, { open: openImportNodeFormModal, close: closeImportNodeFormModal }] =
    useDisclosure(false)
  const { data: nodesQuery } = useNodesQuery()
  const removeNodesMutation = useRemoveNodesMutation()
  const importNodesMutation = useImportNodesMutation()

  return (
    <Section title={t('node')} icon={<IconCloud />} onCreate={openImportNodeFormModal} bordered>
      {nodesQuery?.nodes.edges.map(({ id, name, tag, protocol, link }) => (
        <DraggableResourceCard
          key={id}
          id={`node-${id}`}
          nodeID={id}
          type={DraggableResourceType.node}
          name={tag}
          leftSection={
            <Text fz="xs" fw={600}>
              {protocol}
            </Text>
          }
          onRemove={() => removeNodesMutation.mutate([id])}
        >
          <Text fw={600} color={theme.primaryColor}>
            {name}
          </Text>

          <Spoiler
            maxHeight={0}
            showLabel={<Text fz="xs">{t('actions.show content')}</Text>}
            hideLabel={<Text fz="xs">{t('actions.hide')}</Text>}
          >
            <Text
              fz="sm"
              style={{
                wordBreak: 'break-all',
              }}
            >
              {link}
            </Text>
          </Spoiler>
        </DraggableResourceCard>
      ))}

      <ImportResourceFormModal
        title={t('node')}
        opened={openedImportNodeFormModal}
        onClose={closeImportNodeFormModal}
        handleSubmit={async (values) => {
          await importNodesMutation.mutateAsync(values.resources.map(({ link, tag }) => ({ link, tag })))
        }}
      />
    </Section>
  )
}
