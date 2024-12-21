import {
  Accordion,
  ActionIcon,
  Box,
  Checkbox,
  Flex,
  Group,
  Input,
  Modal,
  MultiSelect,
  NumberInput,
  Radio,
  Select,
  Slider,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { UseFormReturnType, useForm, zodResolver } from '@mantine/form'
import { IconMinus, IconPlus } from '@tabler/icons-react'
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useCreateConfigMutation, useGeneralQuery, useUpdateConfigMutation } from '~/apis'
import {
  DEFAULT_ALLOW_INSECURE,
  DEFAULT_AUTO_CONFIG_KERNEL_PARAMETER,
  DEFAULT_BANDWIDTH_MAX_RX,
  DEFAULT_BANDWIDTH_MAX_TX,
  DEFAULT_CHECK_INTERVAL_SECONDS,
  DEFAULT_CHECK_TOLERANCE_MS,
  DEFAULT_DIAL_MODE,
  DEFAULT_DISABLE_WAITING_NETWORK,
  DEFAULT_ENABLE_LOCAL_TCP_FAST_REDIRECT,
  DEFAULT_MPTCP,
  DEFAULT_SNIFFING_TIMEOUT_MS,
  DEFAULT_SO_MARK_FROM_DAE,
  DEFAULT_TCP_CHECK_HTTP_METHOD,
  DEFAULT_TCP_CHECK_URL,
  DEFAULT_TLS_IMPLEMENTATION,
  DEFAULT_TPROXY_PORT,
  DEFAULT_TPROXY_PORT_PROTECT,
  DEFAULT_UDP_CHECK_DNS,
  DEFAULT_UTLS_IMITATE,
  DialMode,
  GET_LOG_LEVEL_STEPS,
  TLSImplementation,
  TcpCheckHttpMethod,
  UTLSImitate,
} from '~/constants'
import { GlobalInput } from '~/schemas/gql/graphql'

import { FormActions } from './FormActions'
import { SelectItemWithDescription } from './SelectItemWithDescription'

const schema = z.object({
  name: z.string().nonempty(),
  logLevelNumber: z.number().min(0).max(4),
  tproxyPort: z.number(),
  allowInsecure: z.boolean(),
  checkIntervalSeconds: z.number(),
  checkToleranceMS: z.number(),
  sniffingTimeoutMS: z.number(),
  lanInterface: z.array(z.string().nonempty()),
  wanInterface: z.array(z.string()),
  udpCheckDns: z.array(z.string()).min(1),
  tcpCheckUrl: z.array(z.string()).min(1),
  dialMode: z.string(),
  tcpCheckHttpMethod: z.string(),
  disableWaitingNetwork: z.boolean(),
  autoConfigKernelParameter: z.boolean(),
  tlsImplementation: z.string(),
  utlsImitate: z.string(),
  tproxyPortProtect: z.boolean(),
  soMarkFromDae: z.number(),
  mptcp: z.boolean(),
  enableLocalTcpFastRedirect: z.boolean(),
  bandwidthMaxTx: z.string(),
  bandwidthMaxRx: z.string(),
})

const InputList = <T extends z.infer<typeof schema>>({
  form,
  label,
  description,
  fieldName,
  values,
}: {
  label: string
  description?: string
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

      {description && <Input.Description>{description}</Input.Description>}

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

export type ConfigFormModalRef = {
  form: UseFormReturnType<z.infer<typeof schema>>
  setEditingID: (id: string) => void
  initOrigins: (origins: z.infer<typeof schema>) => void
}

export const ConfigFormDrawer = forwardRef(({ opened, onClose }: { opened: boolean; onClose: () => void }, ref) => {
  const { t } = useTranslation()
  const [editingID, setEditingID] = useState()
  const [origins, setOrigins] = useState<z.infer<typeof schema>>()

  const form = useForm<z.infer<typeof schema>>({
    validate: zodResolver(schema),
    initialValues: {
      name: '',
      mptcp: DEFAULT_MPTCP,
      enableLocalTcpFastRedirect: DEFAULT_ENABLE_LOCAL_TCP_FAST_REDIRECT,
      bandwidthMaxTx: DEFAULT_BANDWIDTH_MAX_TX,
      bandwidthMaxRx: DEFAULT_BANDWIDTH_MAX_RX,
      soMarkFromDae: DEFAULT_SO_MARK_FROM_DAE,
      logLevelNumber: 2,
      tproxyPort: DEFAULT_TPROXY_PORT,
      tproxyPortProtect: DEFAULT_TPROXY_PORT_PROTECT,
      allowInsecure: DEFAULT_ALLOW_INSECURE,
      checkIntervalSeconds: DEFAULT_CHECK_INTERVAL_SECONDS,
      checkToleranceMS: DEFAULT_CHECK_TOLERANCE_MS,
      sniffingTimeoutMS: DEFAULT_SNIFFING_TIMEOUT_MS,
      lanInterface: [],
      wanInterface: ['auto'],
      udpCheckDns: DEFAULT_UDP_CHECK_DNS,
      tcpCheckUrl: DEFAULT_TCP_CHECK_URL,
      dialMode: DEFAULT_DIAL_MODE,
      tcpCheckHttpMethod: DEFAULT_TCP_CHECK_HTTP_METHOD,
      disableWaitingNetwork: DEFAULT_DISABLE_WAITING_NETWORK,
      autoConfigKernelParameter: DEFAULT_AUTO_CONFIG_KERNEL_PARAMETER,
      tlsImplementation: DEFAULT_TLS_IMPLEMENTATION,
      utlsImitate: DEFAULT_UTLS_IMITATE,
    },
  })

  const initOrigins = (origins: z.infer<typeof schema>) => {
    form.setValues(origins)
    setOrigins(origins)
  }

  useImperativeHandle(ref, () => ({
    form,
    setEditingID,
    initOrigins,
  }))

  const { data: generalQuery } = useGeneralQuery()

  const wanInterfacesData = useMemo(() => {
    const interfaces = generalQuery?.general.interfaces

    if (interfaces) {
      return [
        {
          label: t('autoDetect'),
          value: 'auto',
        },
        ...interfaces
          .filter(({ flag }) => !!flag.default)
          .map(({ name, ip }) => ({
            label: name,
            value: name,
            description: (
              <Stack spacing="xs">
                {ip.map((addr, i) => (
                  <Text key={i}>{addr}</Text>
                ))}
              </Stack>
            ),
          })),
      ]
    }

    return []
  }, [generalQuery?.general.interfaces, t])

  const lanInterfacesData: { value: string; label: string }[] = useMemo(() => {
    const interfaces = generalQuery?.general.interfaces

    if (interfaces) {
      return interfaces.map(({ name, ip }) => ({
        label: name,
        value: name,
        description: (
          <Stack spacing="xs">
            {ip.map((addr, i) => (
              <Text key={i}>{addr}</Text>
            ))}
          </Stack>
        ),
      }))
    }

    return []
  }, [generalQuery?.general.interfaces])

  const logLevelSteps = GET_LOG_LEVEL_STEPS(t)

  const logLevelMarks = useMemo(() => logLevelSteps.map(([label], value) => ({ value, label })), [logLevelSteps])

  const createConfigMutation = useCreateConfigMutation()
  const updateConfigMutation = useUpdateConfigMutation()

  return (
    <Modal title={t('config')} opened={opened} onClose={onClose}>
      <form
        onSubmit={form.onSubmit(async (values) => {
          const logLevel = logLevelSteps[values.logLevelNumber][1]

          const global: GlobalInput = {
            logLevel,
            checkInterval: `${values.checkIntervalSeconds}s`,
            checkTolerance: `${values.checkToleranceMS}ms`,
            sniffingTimeout: `${values.sniffingTimeoutMS}ms`,
            ...values,
          }

          if (editingID) {
            await updateConfigMutation.mutateAsync({
              id: editingID,
              global,
            })
          } else {
            await createConfigMutation.mutateAsync({
              name: values.name,
              global,
            })
          }

          onClose()
          form.reset()
        })}
      >
        <Stack>
          <TextInput label={t('name')} withAsterisk {...form.getInputProps('name')} disabled={!!editingID} />

          <Accordion
            variant="separated"
            multiple
            defaultValue={[
              'software-options',
              'interface-and-kernel-options',
              'node-connectivity-check',
              'connecting-options',
            ]}
          >
            <Accordion.Item value="software-options">
              <Accordion.Control>
                <Title order={4}>{t('software options')}</Title>
              </Accordion.Control>

              <Accordion.Panel>
                <Stack>
                  <NumberInput
                    label={t('tproxyPort')}
                    description={t('descriptions.config.tproxyPort')}
                    withAsterisk
                    min={0}
                    max={65535}
                    {...form.getInputProps('tproxyPort')}
                  />

                  <Checkbox
                    label={t('tproxyPortProtect')}
                    description={t('descriptions.config.tproxyPortProtect')}
                    {...form.getInputProps('tproxyPortProtect', {
                      type: 'checkbox',
                    })}
                  />

                  <NumberInput
                    label={t('soMarkFromDae')}
                    description={t('descriptions.config.soMarkFromDae')}
                    withAsterisk
                    min={0}
                    max={Math.pow(2, 32) - 1}
                    {...form.getInputProps('soMarkFromDae')}
                  />

                  <Stack>
                    <Input.Label>{t('logLevel')}</Input.Label>

                    <Box px="sm" pb="lg">
                      <Slider
                        min={0}
                        max={4}
                        step={1}
                        label={null}
                        marks={logLevelMarks}
                        {...form.getInputProps('logLevelNumber')}
                      />
                    </Box>
                  </Stack>

                  <Checkbox
                    label={t('disableWaitingNetwork')}
                    description={t('descriptions.config.disableWaitingNetwork')}
                    {...form.getInputProps('disableWaitingNetwork', {
                      type: 'checkbox',
                    })}
                  />

                  <Checkbox
                    label={t('enableLocalTcpFastRedirect')}
                    {...form.getInputProps('enableLocalTcpFastRedirect', {
                      type: 'checkbox',
                    })}
                  />

                  <Checkbox
                    label={t('mptcp')}
                    {...form.getInputProps('mptcp', {
                      type: 'checkbox',
                    })}
                  />
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="interface-and-kernel-options">
              <Accordion.Control>
                <Title order={4}>{t('interface and kernel options')}</Title>
              </Accordion.Control>

              <Accordion.Panel>
                <Stack>
                  <MultiSelect
                    label={t('lanInterface')}
                    description={t('descriptions.config.lanInterface')}
                    itemComponent={SelectItemWithDescription}
                    data={lanInterfacesData}
                    {...form.getInputProps('lanInterface')}
                  />

                  <MultiSelect
                    label={t('wanInterface')}
                    description={t('descriptions.config.wanInterface')}
                    itemComponent={SelectItemWithDescription}
                    data={wanInterfacesData}
                    {...form.getInputProps('wanInterface')}
                  />

                  <Checkbox
                    label={t('autoConfigKernelParameter')}
                    description={t('descriptions.config.autoConfigKernelParameter')}
                    {...form.getInputProps('autoConfigKernelParameter', {
                      type: 'checkbox',
                    })}
                  />
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="node-connectivity-check">
              <Accordion.Control>
                <Title order={4}>{t('node connectivity check')}</Title>
              </Accordion.Control>

              <Accordion.Panel>
                <Stack>
                  <InputList
                    form={form}
                    label={t('tcpCheckUrl')}
                    description={t('descriptions.config.tcpCheckUrl')}
                    fieldName="tcpCheckUrl"
                    values={form.values.tcpCheckUrl}
                  />

                  <Select
                    label={t('tcpCheckHttpMethod')}
                    description={t('descriptions.config.tcpCheckHttpMethod')}
                    data={Object.values(TcpCheckHttpMethod).map((tcpCheckHttpMethod) => ({
                      label: tcpCheckHttpMethod,
                      value: tcpCheckHttpMethod,
                    }))}
                    {...form.getInputProps('tcpCheckHttpMethod')}
                  />

                  <InputList
                    form={form}
                    label={t('udpCheckDns')}
                    description={t('descriptions.config.udpCheckDns')}
                    fieldName="udpCheckDns"
                    values={form.values.udpCheckDns}
                  />

                  <NumberInput
                    label={`${t('checkInterval')} (s)`}
                    withAsterisk
                    {...form.getInputProps('checkIntervalSeconds')}
                  />

                  <NumberInput
                    label={`${t('checkTolerance')} (ms)`}
                    description={t('descriptions.config.checkTolerance')}
                    withAsterisk
                    step={500}
                    {...form.getInputProps('checkToleranceMS')}
                  />
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="connecting-options">
              <Accordion.Control>
                <Title order={4}>{t('connecting options')}</Title>
              </Accordion.Control>

              <Accordion.Panel>
                <Stack>
                  <Radio.Group label={t('dialMode')} {...form.getInputProps('dialMode')}>
                    <Group mt="xs">
                      <Radio
                        value={DialMode.ip}
                        label={DialMode.ip}
                        description={t('descriptions.config.dialMode.ip')}
                      />
                      <Radio
                        value={DialMode.domain}
                        label={DialMode.domain}
                        description={t('descriptions.config.dialMode.domain')}
                      />
                      <Radio
                        value={DialMode.domainP}
                        label={DialMode.domainP}
                        description={t('descriptions.config.dialMode.domain+')}
                      />
                      <Radio
                        value={DialMode.domainPP}
                        label={DialMode.domainPP}
                        description={t('descriptions.config.dialMode.domain++')}
                      />
                    </Group>
                  </Radio.Group>

                  <Checkbox
                    label={t('allowInsecure')}
                    description={t('descriptions.config.allowInsecure')}
                    {...form.getInputProps('allowInsecure', {
                      type: 'checkbox',
                    })}
                  />

                  <NumberInput
                    label={`${t('sniffingTimeout')} (ms)`}
                    description={t('descriptions.config.sniffingTimeout')}
                    step={500}
                    {...form.getInputProps('sniffingTimeoutMS')}
                  />

                  <Select
                    label={t('tlsImplementation')}
                    description={t('descriptions.config.tlsImplementation')}
                    data={Object.values(TLSImplementation).map((tlsImplementation) => ({
                      label: tlsImplementation,
                      value: tlsImplementation,
                    }))}
                    {...form.getInputProps('tlsImplementation')}
                  />

                  {form.values.tlsImplementation === TLSImplementation.utls && (
                    <Select
                      label={t('utlsImitate')}
                      description={t('descriptions.config.utlsImitate')}
                      data={Object.values(UTLSImitate).map((utlsImitate) => ({
                        label: utlsImitate,
                        value: utlsImitate,
                      }))}
                      {...form.getInputProps('utlsImitate')}
                    />
                  )}

                  <TextInput
                    label={t('bandwidthMaxTx')}
                    description={t('descriptions.config.bandwidthMaxTx')}
                    {...form.getInputProps('bandwidthMaxTx')}
                  />

                  <TextInput
                    label={t('bandwidthMaxRx')}
                    description={t('descriptions.config.bandwidthMaxRx')}
                    {...form.getInputProps('bandwidthMaxRx')}
                  />
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>

          <FormActions
            reset={() => {
              if (editingID && origins) {
                form.setValues(origins)
              } else {
                form.reset()
              }
            }}
          />
        </Stack>
      </form>
    </Modal>
  )
})
