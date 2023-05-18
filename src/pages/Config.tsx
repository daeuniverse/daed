import { Flex, Group, MultiSelect, NumberInput, Radio, SimpleGrid, Slider, Switch, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { Prism } from '@mantine/prism'
import { useStore } from '@nanostores/react'
import { IconDeselect, IconSelect } from '@tabler/icons-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useConfigsQuery, useInterfacesQuery, useRemoveConfigMutation } from '~/apis'
import { FormActions } from '~/components/FormActions'
import { Table } from '~/components/Table'
import {
  DEFAULT_ALLOW_INSECURE,
  DEFAULT_DIAL_MODE,
  DEFAULT_TCP_CHECK_URL,
  DEFAULT_TPROXY_PORT,
  DEFAULT_UDP_CHECK_DNS,
  DialMode,
  GET_LOG_LEVEL_STEPS,
} from '~/constants'
import { defaultResourcesAtom } from '~/store'

const schema = z.object({
  logLevelNumber: z.number().min(0).max(4),
  tproxyPort: z.number(),
  allowInsecure: z.boolean(),
  checkIntervalSeconds: z.number(),
  checkToleranceMS: z.number(),
  lanInterface: z.array(z.string()).min(1),
  wanInterface: z.array(z.string()).min(1),
  udpCheckDns: z.string(),
  tcpCheckUrl: z.string().url(),
  dialMode: z.enum(['ip', 'domain', 'domain+', 'domain++']),
})

export const ConfigPage = () => {
  const { t } = useTranslation()
  const { defaultConfigID } = useStore(defaultResourcesAtom)
  const { isLoading, data } = useConfigsQuery()
  const removeConfigMutation = useRemoveConfigMutation()
  const form = useForm<z.infer<typeof schema>>({
    validate: zodResolver(schema),
    initialValues: {
      logLevelNumber: 2,
      tproxyPort: DEFAULT_TPROXY_PORT,
      allowInsecure: DEFAULT_ALLOW_INSECURE,
      checkIntervalSeconds: 10,
      checkToleranceMS: 1000,
      lanInterface: [],
      wanInterface: [],
      udpCheckDns: DEFAULT_UDP_CHECK_DNS,
      tcpCheckUrl: DEFAULT_TCP_CHECK_URL,
      dialMode: DEFAULT_DIAL_MODE,
    },
  })

  const logLevelMarks = useMemo(() => {
    const steps = GET_LOG_LEVEL_STEPS(t)

    return steps.map(([label], value) => ({
      value,
      label,
    }))
  }, [t])

  const { data: interfacesQuery } = useInterfacesQuery()

  const interfacesData: { value: string; label: string }[] = useMemo(() => {
    const interfaces = interfacesQuery?.general.interfaces

    if (interfaces) {
      return interfaces.map(({ name }) => ({
        label: name,
        value: name,
      }))
    }

    return []
  }, [interfacesQuery?.general.interfaces])

  return (
    <Table
      fetching={isLoading}
      columns={[
        {
          title: 'id',
          accessor: 'id',
        },
        {
          title: t('name'),
          accessor: 'name',
        },
        {
          title: t('selected'),
          accessor: 'selected',
          render: (record) => (record.selected ? <IconSelect /> : <IconDeselect />),
        },
      ]}
      records={data?.configs || []}
      isRecordSelectable={(record) => record.id !== defaultConfigID}
      rowExpansion={{
        content: ({ record }) => <Prism language="json">{JSON.stringify(record.global, null, 2)}</Prism>,
      }}
      createModalTitle={t('config')}
      createModalContent={(close) => (
        <form
          onSubmit={form.onSubmit(
            (values) => {
              console.log(values)
              close()
              form.reset()
            },
            (err) => {
              console.log(err)
            }
          )}
        >
          <Flex gap={20} direction="column">
            <div className="px-4 py-8">
              <Slider
                min={0}
                max={4}
                step={1}
                label={null}
                marks={logLevelMarks}
                {...form.getInputProps('logLevelNumber')}
              />
            </div>

            <NumberInput label={t('tproxyPort')} withAsterisk {...form.getInputProps('tproxyPort')} />

            <SimpleGrid cols={2}>
              <NumberInput
                label={`${t('checkInterval')} (s)`}
                withAsterisk
                {...form.getInputProps('checkIntervalSeconds')}
              />

              <NumberInput
                label={`${t('checkTolerance')} (ms)`}
                withAsterisk
                step={500}
                {...form.getInputProps('checkToleranceMS')}
              />
            </SimpleGrid>

            <SimpleGrid cols={2}>
              <MultiSelect
                label={t('lanInterface')}
                withAsterisk
                data={interfacesData}
                {...form.getInputProps('lanInterface')}
              />

              <MultiSelect
                label={t('wanInterface')}
                withAsterisk
                data={interfacesData}
                {...form.getInputProps('wanInterface')}
              />
            </SimpleGrid>

            <SimpleGrid cols={2}>
              <TextInput label={t('udpCheckDns')} withAsterisk {...form.getInputProps('udpCheckDns')} />

              <TextInput label={t('tcpCheckUrl')} withAsterisk {...form.getInputProps('tcpCheckUrl')} />
            </SimpleGrid>

            <Radio.Group label={t('dialMode')} {...form.getInputProps('dialMode')}>
              <Group>
                {Object.values(DialMode).map((dialMode) => (
                  <Radio key={dialMode} value={dialMode} label={dialMode} />
                ))}
              </Group>
            </Radio.Group>

            <Switch
              label={t('allowInsecure')}
              {...form.getInputProps('allowInsecure', {
                type: 'checkbox',
              })}
            />
          </Flex>

          <FormActions />
        </form>
      )}
      onRemove={async (records) => {
        await Promise.all(records.map(({ id }) => removeConfigMutation.mutateAsync(id)))
      }}
    />
  )
}
