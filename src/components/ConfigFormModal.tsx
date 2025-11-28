import { Minus, Plus } from 'lucide-react'
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useCreateConfigMutation, useGeneralQuery, useUpdateConfigMutation } from '~/apis'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { NumberInput } from '~/components/ui/number-input'
import { Radio, RadioGroup } from '~/components/ui/radio-group'
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
  TLSImplementation,
  TcpCheckHttpMethod,
  UTLSImitate,
} from '~/constants'
import { GlobalInput } from '~/schemas/gql/graphql'

import { FormActions } from './FormActions'

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used for type inference
const schema = z.object({
  name: z.string().min(1),
  logLevelNumber: z.number().min(0).max(4),
  tproxyPort: z.number(),
  allowInsecure: z.boolean(),
  checkIntervalSeconds: z.number(),
  checkToleranceMS: z.number(),
  sniffingTimeoutMS: z.number(),
  lanInterface: z.array(z.string()),
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

const InputList = ({
  label,
  description,
  values,
  onChange,
}: {
  label: string
  description?: string
  values: string[]
  onChange: (values: string[]) => void
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {label} <span className="text-destructive">*</span>
        </Label>
        <Button
          type="button"
          variant="default"
          size="icon"
          className="h-5 w-5 bg-green-600 hover:bg-green-700"
          onClick={() => onChange([...values, ''])}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {description && <p className="text-xs text-muted-foreground">{description}</p>}

      {values.map((value, i) => (
        <div key={i} className="flex items-start gap-2">
          <Input
            className="flex-1"
            value={value}
            onChange={(e) => {
              const newValues = [...values]
              newValues[i] = e.target.value
              onChange(newValues)
            }}
          />

          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="h-8 w-8 mt-0.5"
            onClick={() => onChange(values.filter((_, idx) => idx !== i))}
          >
            <Minus className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  )
}

export type ConfigFormModalRef = {
  form: {
    setValues: (values: FormValues) => void
    reset: () => void
  }
  setEditingID: (id: string) => void
  initOrigins: (origins: FormValues) => void
}

export const ConfigFormDrawer = forwardRef(({ opened, onClose }: { opened: boolean; onClose: () => void }, ref) => {
  const { t } = useTranslation()
  const [editingID, setEditingID] = useState<string>()
  const [origins, setOrigins] = useState<FormValues>()
  const [formData, setFormData] = useState<FormValues>(defaultValues)

  const initOrigins = (origins: FormValues) => {
    setFormData(origins)
    setOrigins(origins)
  }

  const resetForm = () => {
    setFormData(defaultValues)
  }

  useImperativeHandle(ref, () => ({
    form: {
      setValues: setFormData,
      reset: resetForm,
    },
    setEditingID,
    initOrigins,
  }))

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const logLevel = logLevelSteps[formData.logLevelNumber][1]

    const global: GlobalInput = {
      logLevel,
      checkInterval: `${formData.checkIntervalSeconds}s`,
      checkTolerance: `${formData.checkToleranceMS}ms`,
      sniffingTimeout: `${formData.sniffingTimeoutMS}ms`,
      ...formData,
    }

    if (editingID) {
      await updateConfigMutation.mutateAsync({
        id: editingID,
        global,
      })
    } else {
      await createConfigMutation.mutateAsync({
        name: formData.name,
        global,
      })
    }

    onClose()
    resetForm()
  }

  const updateField = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={opened} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('config')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label={t('name')}
              withAsterisk
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
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
                      value={formData.tproxyPort}
                      onChange={(val) => updateField('tproxyPort', Number(val))}
                    />

                    <Checkbox
                      label={t('tproxyPortProtect')}
                      description={t('descriptions.config.tproxyPortProtect')}
                      checked={formData.tproxyPortProtect}
                      onCheckedChange={(checked) => updateField('tproxyPortProtect', !!checked)}
                    />

                    <NumberInput
                      label={t('soMarkFromDae')}
                      description={t('descriptions.config.soMarkFromDae')}
                      withAsterisk
                      min={0}
                      max={Math.pow(2, 32) - 1}
                      value={formData.soMarkFromDae}
                      onChange={(val) => updateField('soMarkFromDae', Number(val))}
                    />

                    <div className="space-y-2">
                      <Label>{t('logLevel')}</Label>
                      <Select
                        data={logLevelSteps.map(([label], value) => ({ label, value: String(value) }))}
                        value={String(formData.logLevelNumber)}
                        onChange={(val) => updateField('logLevelNumber', Number(val))}
                      />
                    </div>

                    <Checkbox
                      label={t('disableWaitingNetwork')}
                      description={t('descriptions.config.disableWaitingNetwork')}
                      checked={formData.disableWaitingNetwork}
                      onCheckedChange={(checked) => updateField('disableWaitingNetwork', !!checked)}
                    />

                    <Checkbox
                      label={t('enableLocalTcpFastRedirect')}
                      checked={formData.enableLocalTcpFastRedirect}
                      onCheckedChange={(checked) => updateField('enableLocalTcpFastRedirect', !!checked)}
                    />

                    <Checkbox
                      label={t('mptcp')}
                      checked={formData.mptcp}
                      onCheckedChange={(checked) => updateField('mptcp', !!checked)}
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
                      value={formData.lanInterface[0] || ''}
                      onChange={(val) => updateField('lanInterface', val ? [val] : [])}
                    />

                    <Select
                      label={t('wanInterface')}
                      description={t('descriptions.config.wanInterface')}
                      data={wanInterfacesData}
                      value={formData.wanInterface[0] || ''}
                      onChange={(val) => updateField('wanInterface', val ? [val] : [])}
                    />

                    <Checkbox
                      label={t('autoConfigKernelParameter')}
                      description={t('descriptions.config.autoConfigKernelParameter')}
                      checked={formData.autoConfigKernelParameter}
                      onCheckedChange={(checked) => updateField('autoConfigKernelParameter', !!checked)}
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
                      values={formData.tcpCheckUrl}
                      onChange={(vals) => updateField('tcpCheckUrl', vals)}
                    />

                    <Select
                      label={t('tcpCheckHttpMethod')}
                      description={t('descriptions.config.tcpCheckHttpMethod')}
                      data={Object.values(TcpCheckHttpMethod).map((method) => ({ label: method, value: method }))}
                      value={formData.tcpCheckHttpMethod}
                      onChange={(val) => updateField('tcpCheckHttpMethod', val || '')}
                    />

                    <InputList
                      label={t('udpCheckDns')}
                      description={t('descriptions.config.udpCheckDns')}
                      values={formData.udpCheckDns}
                      onChange={(vals) => updateField('udpCheckDns', vals)}
                    />

                    <Input
                      label={t('fallbackResolver')}
                      description={t('descriptions.config.fallbackResolver')}
                      value={formData.fallbackResolver}
                      onChange={(e) => updateField('fallbackResolver', e.target.value)}
                    />

                    <NumberInput
                      label={`${t('checkInterval')} (s)`}
                      withAsterisk
                      value={formData.checkIntervalSeconds}
                      onChange={(val) => updateField('checkIntervalSeconds', Number(val))}
                    />

                    <NumberInput
                      label={`${t('checkTolerance')} (ms)`}
                      description={t('descriptions.config.checkTolerance')}
                      withAsterisk
                      step={500}
                      value={formData.checkToleranceMS}
                      onChange={(val) => updateField('checkToleranceMS', Number(val))}
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
                      value={formData.dialMode}
                      onChange={(val) => updateField('dialMode', val)}
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
                      checked={formData.allowInsecure}
                      onCheckedChange={(checked) => updateField('allowInsecure', !!checked)}
                    />

                    <NumberInput
                      label={`${t('sniffingTimeout')} (ms)`}
                      description={t('descriptions.config.sniffingTimeout')}
                      step={500}
                      value={formData.sniffingTimeoutMS}
                      onChange={(val) => updateField('sniffingTimeoutMS', Number(val))}
                    />

                    <Select
                      label={t('tlsImplementation')}
                      description={t('descriptions.config.tlsImplementation')}
                      data={Object.values(TLSImplementation).map((impl) => ({ label: impl, value: impl }))}
                      value={formData.tlsImplementation}
                      onChange={(val) => updateField('tlsImplementation', val || '')}
                    />

                    {formData.tlsImplementation === TLSImplementation.utls && (
                      <Select
                        label={t('utlsImitate')}
                        description={t('descriptions.config.utlsImitate')}
                        data={Object.values(UTLSImitate).map((impl) => ({ label: impl, value: impl }))}
                        value={formData.utlsImitate}
                        onChange={(val) => updateField('utlsImitate', val || '')}
                      />
                    )}

                    <Input
                      label={t('bandwidthMaxTx')}
                      description={t('descriptions.config.bandwidthMaxTx')}
                      value={formData.bandwidthMaxTx}
                      onChange={(e) => updateField('bandwidthMaxTx', e.target.value)}
                    />

                    <Input
                      label={t('bandwidthMaxRx')}
                      description={t('descriptions.config.bandwidthMaxRx')}
                      value={formData.bandwidthMaxRx}
                      onChange={(e) => updateField('bandwidthMaxRx', e.target.value)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <FormActions
              reset={() => {
                if (editingID && origins) {
                  setFormData(origins)
                } else {
                  resetForm()
                }
              }}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
})
