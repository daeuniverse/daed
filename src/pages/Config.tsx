import {
  ActionIcon,
  Checkbox,
  Flex,
  Group,
  Input,
  MultiSelect,
  NumberInput,
  Radio,
  Select,
  SimpleGrid,
  Slider,
  Stack,
  TextInput,
} from '@mantine/core'
import { UseFormReturnType, useForm, zodResolver } from '@mantine/form'
import { Prism } from '@mantine/prism'
import { useStore } from '@nanostores/react'
import { IconEdit, IconMinus, IconPlus } from '@tabler/icons-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import {
  useConfigsQuery,
  useCreateConfigMutation,
  useGeneralQuery,
  useRemoveConfigMutation,
  useSelectConfigMutation,
} from '~/apis'
import { FormActions } from '~/components/FormActions'
import { Table } from '~/components/Table'
import {
  DEFAULT_ALLOW_INSECURE,
  DEFAULT_AUTO_CONFIG_KERNEL_PARAMETER,
  DEFAULT_DIAL_MODE,
  DEFAULT_DISABLE_WAITING_NETWORK,
  DEFAULT_TCP_CHECK_HTTP_METHOD,
  DEFAULT_TCP_CHECK_URL,
  DEFAULT_TLS_IMPLEMENTATION,
  DEFAULT_TPROXY_PORT,
  DEFAULT_UDP_CHECK_DNS,
  DialMode,
  GET_LOG_LEVEL_STEPS,
  TLSImplementation,
  TcpCheckHttpMethod,
  UTLSImitate,
} from '~/constants'
import { defaultResourcesAtom } from '~/store'

const schema = z.object({
  name: z.string().nonempty(),
  logLevelNumber: z.number().min(0).max(4),
  tproxyPort: z.number(),
  allowInsecure: z.boolean(),
  checkIntervalSeconds: z.number(),
  checkToleranceMS: z.number(),
  sniffingTimeoutMS: z.number(),
  lanInterface: z.array(z.string()).min(1),
  wanInterface: z.array(z.string()).min(1),
  udpCheckDns: z.array(z.string()).min(1),
  tcpCheckUrl: z.array(z.string()).min(1),
  dialMode: z.string(),
  tcpCheckHttpMethod: z.string(),
  disableWaitingNetwork: z.boolean(),
  autoConfigKernelParameter: z.boolean(),
  tlsImplementation: z.string(),
  utlsImitate: z.string(),
})

const InputList = <T extends z.infer<typeof schema>>({
  form,
  label,
  fieldName,
  values,
}: {
  label: string
  fieldName: string
  values: string[]
  form: UseFormReturnType<T>
}) => {
  return (
    <Flex direction="column" gap={10}>
      <Group position="apart">
        <Input.Label required>{label}</Input.Label>
        <ActionIcon
          size={20}
          variant="filled"
          color="green"
          onClick={() => {
            form.insertListItem(fieldName, '')
          }}
        >
          <IconPlus />
        </ActionIcon>
      </Group>

      {values.map((_, i) => (
        <Flex key={i} align="start" gap={6}>
          <TextInput w="100%" {...form.getInputProps(`${fieldName}.${i}`)} />

          <ActionIcon
            variant="filled"
            color="red"
            mt={8}
            size={20}
            onClick={() => {
              form.removeListItem(fieldName, i)
            }}
          >
            <IconMinus />
          </ActionIcon>
        </Flex>
      ))}
    </Flex>
  )
}

const ModalContent = <T extends z.infer<typeof schema>>({
  form,
  handleSubmit,
}: {
  form: UseFormReturnType<T>
  handleSubmit: (values: T) => void
}) => {
  const { t } = useTranslation()

  const { data: generalQuery } = useGeneralQuery()

  const interfacesData: { value: string; label: string }[] = useMemo(() => {
    const interfaces = generalQuery?.general.interfaces

    if (interfaces) {
      return interfaces.map(({ name }) => ({
        label: name,
        value: name,
      }))
    }

    return []
  }, [generalQuery?.general.interfaces])

  const logLevelSteps = GET_LOG_LEVEL_STEPS(t)

  const logLevelMarks = useMemo(
    () =>
      logLevelSteps.map(([label], value) => ({
        value,
        label,
      })),
    [logLevelSteps]
  )

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput label={t('name')} withAsterisk {...form.getInputProps('name')} />

        <Stack>
          <Input.Label>{t('logLevel')}</Input.Label>

          <div className="px-4 pb-4">
            <Slider
              min={0}
              max={4}
              step={1}
              label={null}
              marks={logLevelMarks}
              {...form.getInputProps('logLevelNumber')}
            />
          </div>
        </Stack>

        <Radio.Group label={t('dialMode')} {...form.getInputProps('dialMode')}>
          <Group>
            {Object.values(DialMode).map((dialMode) => (
              <Radio key={dialMode} value={dialMode} label={dialMode} />
            ))}
          </Group>
        </Radio.Group>

        <SimpleGrid cols={3}>
          <NumberInput label={t('tproxyPort')} withAsterisk {...form.getInputProps('tproxyPort')} />

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

        <SimpleGrid cols={3}>
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

          <NumberInput label={`${t('sniffingTimeout')} (ms)`} step={500} {...form.getInputProps('sniffingTimeoutMS')} />
        </SimpleGrid>

        <Select
          label={t('tcpCheckHttpMethod')}
          data={Object.values(TcpCheckHttpMethod).map((tcpCheckHttpMethod) => ({
            label: tcpCheckHttpMethod,
            value: tcpCheckHttpMethod,
          }))}
          {...form.getInputProps('tcpCheckHttpMethod')}
        />

        <SimpleGrid cols={2}>
          <InputList form={form} label={t('udpCheckDns')} fieldName="udpCheckDns" values={form.values.udpCheckDns} />

          <InputList form={form} label={t('tcpCheckUrl')} fieldName="tcpCheckUrl" values={form.values.tcpCheckUrl} />
        </SimpleGrid>

        <SimpleGrid cols={2}>
          <Select
            label={t('tlsImplementation')}
            data={Object.values(TLSImplementation).map((tlsImplementation) => ({
              label: tlsImplementation,
              value: tlsImplementation,
            }))}
            {...form.getInputProps('tlsImplementation')}
          />

          <Select
            label={t('utlsImitate')}
            data={Object.values(UTLSImitate).map((utlsImitate) => ({
              label: utlsImitate,
              value: utlsImitate,
            }))}
            {...form.getInputProps('utlsImitate')}
          />
        </SimpleGrid>

        <SimpleGrid cols={2}>
          <Checkbox
            label={t('allowInsecure')}
            {...form.getInputProps('allowInsecure', {
              type: 'checkbox',
            })}
          />

          <Checkbox
            label={t('autoConfigKernelParameter')}
            {...form.getInputProps('autoConfigKernelParameter', {
              type: 'checkbox',
            })}
          />

          <Checkbox
            label={t('disableWaitingNetwork')}
            {...form.getInputProps('disableWaitingNetwork', {
              type: 'checkbox',
            })}
          />
        </SimpleGrid>

        <FormActions reset={form.reset} />
      </Stack>
    </form>
  )
}

export const ConfigPage = () => {
  const { t } = useTranslation()
  const { defaultConfigID } = useStore(defaultResourcesAtom)
  const { isLoading, data } = useConfigsQuery()
  const selectConfigMutation = useSelectConfigMutation()
  const removeConfigMutation = useRemoveConfigMutation()
  const createForm = useForm<z.infer<typeof schema>>({
    validate: zodResolver(schema),
    initialValues: {
      name: '',
      logLevelNumber: 2,
      tproxyPort: DEFAULT_TPROXY_PORT,
      allowInsecure: DEFAULT_ALLOW_INSECURE,
      checkIntervalSeconds: 10,
      checkToleranceMS: 1000,
      sniffingTimeoutMS: 100,
      lanInterface: [],
      wanInterface: [],
      udpCheckDns: DEFAULT_UDP_CHECK_DNS,
      tcpCheckUrl: DEFAULT_TCP_CHECK_URL,
      dialMode: DEFAULT_DIAL_MODE,
      tcpCheckHttpMethod: DEFAULT_TCP_CHECK_HTTP_METHOD,
      disableWaitingNetwork: DEFAULT_DISABLE_WAITING_NETWORK,
      autoConfigKernelParameter: DEFAULT_AUTO_CONFIG_KERNEL_PARAMETER,
      tlsImplementation: DEFAULT_TLS_IMPLEMENTATION,
      utlsImitate: '',
    },
  })

  const logLevelSteps = GET_LOG_LEVEL_STEPS(t)

  const createConfigMutation = useCreateConfigMutation()

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
          title: t('operations'),
          accessor: 'actions',
          render: (record) => (
            <Group
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <ActionIcon>
                <IconEdit />
              </ActionIcon>

              <Radio
                label={t('selected')}
                checked={record.selected}
                onChange={() => {
                  selectConfigMutation.mutate({
                    id: record.id,
                  })
                }}
              />
            </Group>
          ),
        },
      ]}
      records={data?.configs || []}
      isRecordSelectable={(record) => record.id !== defaultConfigID}
      rowExpansion={{
        content: ({ record }) => <Prism language="json">{JSON.stringify(record.global, null, 2)}</Prism>,
      }}
      createModalTitle={t('config')}
      createModalContent={(close) => (
        <ModalContent
          form={createForm}
          handleSubmit={async (values) => {
            const logLevel = logLevelSteps[values.logLevelNumber][1]

            await createConfigMutation.mutateAsync({
              name: values.name,
              global: {
                logLevel,
                tproxyPort: values.tproxyPort,
                tcpCheckUrl: values.tcpCheckUrl,
                udpCheckDns: values.udpCheckDns,
                allowInsecure: values.allowInsecure,
                checkInterval: `${values.checkIntervalSeconds}s`,
                checkTolerance: `${values.checkToleranceMS}ms`,
                sniffingTimeout: `${values.sniffingTimeoutMS}ms`,
                lanInterface: values.lanInterface,
                wanInterface: values.wanInterface,
                dialMode: values.dialMode,
              },
            })
            close()
            createForm.reset()
          }}
        />
      )}
      onRemove={async (records) => {
        await Promise.all(records.map(({ id }) => removeConfigMutation.mutateAsync(id)))
      }}
    />
  )
}
