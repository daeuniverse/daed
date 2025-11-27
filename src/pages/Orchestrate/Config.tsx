import { useStore } from '@nanostores/react'
import { Pencil, Settings, Type } from 'lucide-react'
import { Fragment, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useConfigsQuery, useRemoveConfigMutation, useSelectConfigMutation } from '~/apis'
import { ConfigFormDrawer, ConfigFormModalRef } from '~/components/ConfigFormModal'
import { RenameFormModal, RenameFormModalRef } from '~/components/RenameFormModal'
import { Section } from '~/components/Section'
import { SimpleCard } from '~/components/SimpleCard'
import { Button } from '~/components/ui/button'
import { Code } from '~/components/ui/code'
import { GET_LOG_LEVEL_STEPS, RuleType } from '~/constants'
import { useDisclosure } from '~/hooks'
import { defaultResourcesAtom } from '~/store'
import { deriveTime } from '~/utils'

export const Config = () => {
  const { t } = useTranslation()

  const { defaultConfigID } = useStore(defaultResourcesAtom)

  const { data: configsQuery } = useConfigsQuery()
  const selectConfigMutation = useSelectConfigMutation()
  const removeConfigMutation = useRemoveConfigMutation()
  const updateConfigFormModalRef = useRef<ConfigFormModalRef>(null)

  const [openedRenameFormModal, { open: openRenameFormModal, close: closeRenameFormModal }] = useDisclosure(false)
  const renameFormModalRef = useRef<RenameFormModalRef>(null)

  const [openedCreateConfigFormDrawer, { open: openCreateConfigFormDrawer, close: closeCreateConfigFormDrawer }] =
    useDisclosure(false)
  const [openedUpdateConfigFormDrawer, { open: openUpdateConfigFormDrawer, close: closeUpdateConfigFormDrawer }] =
    useDisclosure(false)

  return (
    <Section title={t('config')} icon={<Settings className="h-5 w-5" />} onCreate={openCreateConfigFormDrawer} bordered>
      {configsQuery?.configs.map((config) => (
        <SimpleCard
          key={config.id}
          name={config.name}
          actions={
            <Fragment>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  if (renameFormModalRef.current) {
                    renameFormModalRef.current.setProps({
                      id: config.id,
                      type: RuleType.config,
                      oldName: config.name,
                    })
                  }

                  openRenameFormModal()
                }}
              >
                <Type className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  updateConfigFormModalRef.current?.setEditingID(config.id)

                  const { checkInterval, checkTolerance, sniffingTimeout, logLevel, ...global } = config.global

                  const logLevelSteps = GET_LOG_LEVEL_STEPS(t)
                  const logLevelNumber = logLevelSteps.findIndex(([, l]) => l === logLevel)

                  updateConfigFormModalRef.current?.initOrigins({
                    name: config.name,
                    logLevelNumber,
                    checkIntervalSeconds: deriveTime(checkInterval, 's'),
                    checkToleranceMS: deriveTime(checkTolerance, 'ms'),
                    sniffingTimeoutMS: deriveTime(sniffingTimeout, 'ms'),
                    ...global,
                  })

                  openUpdateConfigFormDrawer()
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </Fragment>
          }
          selected={config.selected}
          onSelect={() => selectConfigMutation.mutate({ id: config.id })}
          onRemove={config.id !== defaultConfigID ? () => removeConfigMutation.mutate(config.id) : undefined}
        >
          <Code block>{JSON.stringify(config, null, 2)}</Code>
        </SimpleCard>
      ))}

      <ConfigFormDrawer opened={openedCreateConfigFormDrawer} onClose={closeCreateConfigFormDrawer} />
      <ConfigFormDrawer
        ref={updateConfigFormModalRef}
        opened={openedUpdateConfigFormDrawer}
        onClose={closeUpdateConfigFormDrawer}
      />

      <RenameFormModal ref={renameFormModalRef} opened={openedRenameFormModal} onClose={closeRenameFormModal} />
    </Section>
  )
}
