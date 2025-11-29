import type { GlobalInput } from '~/schemas/gql/graphql'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useImperativeHandle, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { z } from 'zod'
import { useCreateConfigMutation, useGeneralQuery, useUpdateConfigMutation } from '~/apis'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import { Checkbox } from '~/components/ui/checkbox'
import { Dialog, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { InputList } from '~/components/ui/input-list'
import { Label } from '~/components/ui/label'
import { NumberInput } from '~/components/ui/number-input'
import { Radio, RadioGroup } from '~/components/ui/radio-group'
import {
  ScrollableDialogBody,
  ScrollableDialogContent,
  ScrollableDialogFooter,
  ScrollableDialogHeader,
} from '~/components/ui/scrollable-dialog'
import { Select } from '~/components/ui/select'
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
  DEFAULT_FALLBACK_RESOLVER,
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
  TcpCheckHttpMethod,
  TLSImplementation,
  UTLSImitate,
} from '~/constants'

import { FormActions } from './FormActions'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  logLevelNumber: z.number().min(0).max(4),
  tproxyPort: z.number(),
  allowInsecure: z.boolean(),
  checkIntervalSeconds: z.number(),
  checkToleranceMS: z.number(),
  sniffingTimeoutMS: z.number(),
  lanInterface: z.array(z.string()),
  wanInterface: z.array(z.string()),
  udpCheckDns: z.array(z.string().min(1, 'Required')).min(1),
  tcpCheckUrl: z.array(z.string().min(1, 'Required')).min(1),
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
  fallbackResolver: z.string(),
})

type FormValues = z.infer<typeof schema>

const defaultValues: FormValues = {
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
  fallbackResolver: DEFAULT_FALLBACK_RESOLVER,
}

export interface ConfigFormModalRef {
  form: {
    setValues: (values: FormValues) => void
    reset: () => void
  }
  setEditingID: (id: string) => void
  initOrigins: (origins: FormValues) => void
}

export function ConfigFormDrawer({
  ref,
  opened,
  onClose,
}: {
  ref?: React.Ref<ConfigFormModalRef>
  opened: boolean
  onClose: () => void
}) {
  const { t } = useTranslation()
  const [editingID, setEditingID] = useState<string>()
  const [origins, setOrigins] = useState<FormValues>()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const {
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = form

  const formValues = useWatch({ control })

  const initOrigins = (origins: FormValues) => {
    reset(origins)
    setOrigins(origins)
  }

  const resetForm = useCallback(() => {
    reset(defaultValues)
  }, [reset])

  useImperativeHandle(ref, () => ({
    form: {
      setValues: (values: FormValues) => reset(values),
      reset: resetForm,
    },
    setEditingID,
    initOrigins,
  }))

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm()
      setEditingID(undefined)
      setOrigins(undefined)
      onClose()
    }
  }

  const { data: generalQuery } = useGeneralQuery()

  const wanInterfacesData = useMemo(() => {
    const interfaces = generalQuery?.general.interfaces

    if (interfaces) {
      return [
        { label: t('autoDetect'), value: 'auto' },
        ...interfaces.filter(({ flag }) => !!flag.default).map(({ name }) => ({ label: name, value: name })),
      ]
    }

    return []
  }, [generalQuery?.general.interfaces, t])

  const lanInterfacesData = useMemo(() => {
    const interfaces = generalQuery?.general.interfaces

    if (interfaces) {
      return interfaces.map(({ name }) => ({ label: name, value: name }))
    }

    return []
  }, [generalQuery?.general.interfaces])

  const logLevelSteps = GET_LOG_LEVEL_STEPS(t)

  const createConfigMutation = useCreateConfigMutation()
  const updateConfigMutation = useUpdateConfigMutation()

  const onSubmit = async (data: FormValues) => {
    const logLevel = logLevelSteps[data.logLevelNumber][1]

    const global: GlobalInput = {
      logLevel,
      checkInterval: `${data.checkIntervalSeconds}s`,
      checkTolerance: `${data.checkToleranceMS}ms`,
      sniffingTimeout: `${data.sniffingTimeoutMS}ms`,
      ...data,
    }

    if (editingID) {
      await updateConfigMutation.mutateAsync({
        id: editingID,
        global,
      })
    } else {
      await createConfigMutation.mutateAsync({
        name: data.name,
        global,
      })
    }

    handleOpenChange(false)
  }

  return (
    <Dialog open={opened} onOpenChange={handleOpenChange}>
      <ScrollableDialogContent size="lg">
        <ScrollableDialogHeader>
          <DialogTitle>{t('config')}</DialogTitle>
        </ScrollableDialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
          <ScrollableDialogBody className="flex-1">
            <div className="space-y-4">
              <Input
                label={t('name')}
                withAsterisk
                value={formValues.name}
                onChange={(e) => setValue('name', e.target.value)}
                error={errors.name?.message}
                disabled={!!editingID}
              />

              <Accordion
                type="multiple"
                defaultValue={[
                  'software-options',
                  'interface-and-kernel-options',
                  'node-connectivity-check',
                  'connecting-options',
                ]}
                className="w-full"
              >
                <AccordionItem value="software-options">
                  <AccordionTrigger>
                    <h4 className="text-sm font-semibold">{t('software options')}</h4>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <NumberInput
                        label={t('tproxyPort')}
                        description={t('descriptions.config.tproxyPort')}
                        withAsterisk
                        min={0}
                        max={65535}
                        value={formValues.tproxyPort}
                        onChange={(val) => setValue('tproxyPort', Number(val))}
                      />

                      <Checkbox
                        label={t('tproxyPortProtect')}
                        description={t('descriptions.config.tproxyPortProtect')}
                        checked={formValues.tproxyPortProtect}
                        onCheckedChange={(checked) => setValue('tproxyPortProtect', !!checked)}
                      />

                      <NumberInput
                        label={t('soMarkFromDae')}
                        description={t('descriptions.config.soMarkFromDae')}
                        withAsterisk
                        min={0}
                        max={2 ** 32 - 1}
                        value={formValues.soMarkFromDae}
                        onChange={(val) => setValue('soMarkFromDae', Number(val))}
                      />

                      <div className="space-y-2">
                        <Label>{t('logLevel')}</Label>
                        <Select
                          data={logLevelSteps.map(([label], value) => ({ label, value: String(value) }))}
                          value={String(formValues.logLevelNumber)}
                          onChange={(val) => setValue('logLevelNumber', Number(val))}
                        />
                      </div>

                      <Checkbox
                        label={t('disableWaitingNetwork')}
                        description={t('descriptions.config.disableWaitingNetwork')}
                        checked={formValues.disableWaitingNetwork}
                        onCheckedChange={(checked) => setValue('disableWaitingNetwork', !!checked)}
                      />

                      <Checkbox
                        label={t('enableLocalTcpFastRedirect')}
                        checked={formValues.enableLocalTcpFastRedirect}
                        onCheckedChange={(checked) => setValue('enableLocalTcpFastRedirect', !!checked)}
                      />

                      <Checkbox
                        label={t('mptcp')}
                        checked={formValues.mptcp}
                        onCheckedChange={(checked) => setValue('mptcp', !!checked)}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="interface-and-kernel-options">
                  <AccordionTrigger>
                    <h4 className="text-sm font-semibold">{t('interface and kernel options')}</h4>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <Select
                        label={t('lanInterface')}
                        description={t('descriptions.config.lanInterface')}
                        data={lanInterfacesData}
                        value={formValues.lanInterface?.[0] || ''}
                        onChange={(val) => setValue('lanInterface', val ? [val] : [])}
                      />

                      <Select
                        label={t('wanInterface')}
                        description={t('descriptions.config.wanInterface')}
                        data={wanInterfacesData}
                        value={formValues.wanInterface?.[0] || ''}
                        onChange={(val) => setValue('wanInterface', val ? [val] : [])}
                      />

                      <Checkbox
                        label={t('autoConfigKernelParameter')}
                        description={t('descriptions.config.autoConfigKernelParameter')}
                        checked={formValues.autoConfigKernelParameter}
                        onCheckedChange={(checked) => setValue('autoConfigKernelParameter', !!checked)}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="node-connectivity-check">
                  <AccordionTrigger>
                    <h4 className="text-sm font-semibold">{t('node connectivity check')}</h4>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <InputList
                        label={t('tcpCheckUrl')}
                        description={t('descriptions.config.tcpCheckUrl')}
                        values={formValues.tcpCheckUrl || []}
                        onChange={(vals) => setValue('tcpCheckUrl', vals)}
                      />

                      <Select
                        label={t('tcpCheckHttpMethod')}
                        description={t('descriptions.config.tcpCheckHttpMethod')}
                        data={Object.values(TcpCheckHttpMethod).map((method) => ({ label: method, value: method }))}
                        value={formValues.tcpCheckHttpMethod}
                        onChange={(val) => setValue('tcpCheckHttpMethod', val || '')}
                      />

                      <InputList
                        label={t('udpCheckDns')}
                        description={t('descriptions.config.udpCheckDns')}
                        values={formValues.udpCheckDns || []}
                        onChange={(vals) => setValue('udpCheckDns', vals)}
                        errors={(formValues.udpCheckDns || []).map((v) =>
                          v.trim() === '' ? t('form.required') : undefined,
                        )}
                      />

                      <Input
                        label={t('fallbackResolver')}
                        description={t('descriptions.config.fallbackResolver')}
                        value={formValues.fallbackResolver}
                        onChange={(e) => setValue('fallbackResolver', e.target.value)}
                      />

                      <NumberInput
                        label={`${t('checkInterval')} (s)`}
                        withAsterisk
                        value={formValues.checkIntervalSeconds}
                        onChange={(val) => setValue('checkIntervalSeconds', Number(val))}
                      />

                      <NumberInput
                        label={`${t('checkTolerance')} (ms)`}
                        description={t('descriptions.config.checkTolerance')}
                        withAsterisk
                        step={500}
                        value={formValues.checkToleranceMS}
                        onChange={(val) => setValue('checkToleranceMS', Number(val))}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="connecting-options">
                  <AccordionTrigger>
                    <h4 className="text-sm font-semibold">{t('connecting options')}</h4>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <RadioGroup
                        label={t('dialMode')}
                        value={formValues.dialMode}
                        onChange={(val) => setValue('dialMode', val)}
                      >
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
                      </RadioGroup>

                      <Checkbox
                        label={t('allowInsecure')}
                        description={t('descriptions.config.allowInsecure')}
                        checked={formValues.allowInsecure}
                        onCheckedChange={(checked) => setValue('allowInsecure', !!checked)}
                      />

                      <NumberInput
                        label={`${t('sniffingTimeout')} (ms)`}
                        description={t('descriptions.config.sniffingTimeout')}
                        step={500}
                        value={formValues.sniffingTimeoutMS}
                        onChange={(val) => setValue('sniffingTimeoutMS', Number(val))}
                      />

                      <Select
                        label={t('tlsImplementation')}
                        description={t('descriptions.config.tlsImplementation')}
                        data={Object.values(TLSImplementation).map((impl) => ({ label: impl, value: impl }))}
                        value={formValues.tlsImplementation}
                        onChange={(val) => setValue('tlsImplementation', val || '')}
                      />

                      {formValues.tlsImplementation === TLSImplementation.utls && (
                        <Select
                          label={t('utlsImitate')}
                          description={t('descriptions.config.utlsImitate')}
                          data={Object.values(UTLSImitate).map((impl) => ({ label: impl, value: impl }))}
                          value={formValues.utlsImitate}
                          onChange={(val) => setValue('utlsImitate', val || '')}
                        />
                      )}

                      <Input
                        label={t('bandwidthMaxTx')}
                        description={t('descriptions.config.bandwidthMaxTx')}
                        value={formValues.bandwidthMaxTx}
                        onChange={(e) => setValue('bandwidthMaxTx', e.target.value)}
                      />

                      <Input
                        label={t('bandwidthMaxRx')}
                        description={t('descriptions.config.bandwidthMaxRx')}
                        value={formValues.bandwidthMaxRx}
                        onChange={(e) => setValue('bandwidthMaxRx', e.target.value)}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </ScrollableDialogBody>
          <ScrollableDialogFooter>
            <FormActions
              reset={() => {
                if (editingID && origins) {
                  reset(origins)
                } else {
                  resetForm()
                }
              }}
            />
          </ScrollableDialogFooter>
        </form>
      </ScrollableDialogContent>
    </Dialog>
  )
}
