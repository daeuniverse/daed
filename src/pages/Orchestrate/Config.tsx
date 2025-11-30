import type { ConfigFormModalRef } from '~/components/ConfigFormModal'
import { useStore } from '@nanostores/react'
import { Settings, Settings2 } from 'lucide-react'

import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useConfigsQuery, useRemoveConfigMutation, useRenameConfigMutation, useSelectConfigMutation } from '~/apis'
import { ConfigDetailView } from '~/components/ConfigDetailView'
import { ConfigFormDrawer } from '~/components/ConfigFormModal'
import { Section } from '~/components/Section'
import { SimpleCard } from '~/components/SimpleCard'
import { Button } from '~/components/ui/button'
import { GET_LOG_LEVEL_STEPS } from '~/constants'
import { useDisclosure } from '~/hooks'
import { defaultResourcesAtom } from '~/store'
import { deriveTime } from '~/utils'

export function Config() {
  const { t } = useTranslation()

  const { defaultConfigID } = useStore(defaultResourcesAtom)

  const { data: configsQuery } = useConfigsQuery()
  const selectConfigMutation = useSelectConfigMutation()
  const removeConfigMutation = useRemoveConfigMutation()
  const renameConfigMutation = useRenameConfigMutation()
  const updateConfigFormModalRef = useRef<ConfigFormModalRef>(null)

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
              <Settings2 className="h-4 w-4" />
            </Button>
          }
          selected={config.selected}
          onSelect={() => selectConfigMutation.mutate({ id: config.id })}
          onRemove={config.id !== defaultConfigID ? () => removeConfigMutation.mutate(config.id) : undefined}
          onRename={(newName) => renameConfigMutation.mutate({ id: config.id, name: newName })}
        >
          <ConfigDetailView config={config} />
        </SimpleCard>
      ))}

      <ConfigFormDrawer opened={openedCreateConfigFormDrawer} onClose={closeCreateConfigFormDrawer} />
      <ConfigFormDrawer
        ref={updateConfigFormModalRef}
        opened={openedUpdateConfigFormDrawer}
        onClose={closeUpdateConfigFormDrawer}
      />
    </Section>
  )
}
