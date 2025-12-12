import type { DaeConfigType } from './DaeEditor'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useImperativeHandle, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { Dialog, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { InputList } from '~/components/ui/input-list'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import {
  ScrollableDialogBody,
  ScrollableDialogContent,
  ScrollableDialogHeader,
} from '~/components/ui/scrollable-dialog'
import { Switch } from '~/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { useSetValue } from '~/hooks/useSetValue'

import { DaeEditor } from './DaeEditor'
import { FormActions } from './FormActions'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  text: z.string().min(1, 'Text is required'),
})

type FormValues = z.infer<typeof schema>

const defaultValues: FormValues = {
  name: '',
  text: '',
}

export interface RoutingFormModalRef {
  form: {
    setValues: (values: FormValues) => void
    setFieldValue: (field: string, value: string) => void
    reset: () => void
    values: FormValues
    errors: Record<string, string | undefined>
  }
  editingID: string
  setEditingID: (id: string) => void
  initOrigins: (origins: FormValues) => void
}

type RoutingSimpleMode = 'gfw' | 'nonCn' | 'cnOnly' | 'global' | 'macOnly'
type MacAction = 'proxy' | 'direct'

const MAC_REGEX = /^(?:[0-9A-F]{2}:){5}[0-9A-F]{2}$/i

function normalizeRoutingLines(text: string) {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
}

function parseMacRule(lines: string[]) {
  const macLine = lines.find((l) => l.startsWith('mac('))
  if (!macLine) return

  const match = macLine.match(/^mac\((.*)\)\s*->\s*([^\s#]+)\s*$/)
  if (!match) return

  const listRaw = match[1]
  const target = match[2]
  const macList = listRaw
    .split(',')
    .map((p) => p.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean)

  if (macList.some((m) => !MAC_REGEX.test(m))) return

  const macAction: MacAction = target === 'direct' ? 'direct' : 'proxy'
  return { macList, macAction }
}

function detectSimpleMode(text: string, proxyGroupName: string) {
  const lines = normalizeRoutingLines(text)
  const mac = parseMacRule(lines)
  const withoutMac = mac ? lines.filter((l) => !l.startsWith('mac(')) : lines

  const hasGfw = withoutMac.includes(`domain(geosite:gfw) -> ${proxyGroupName}`)
  const hasCnDirect =
    withoutMac.includes('dip(geoip:cn) -> direct') &&
    withoutMac.includes('domain(geosite:cn) -> direct')
  const hasCnProxy =
    withoutMac.includes(`dip(geoip:cn) -> ${proxyGroupName}`) &&
    withoutMac.includes(`domain(geosite:cn) -> ${proxyGroupName}`)

  const fallbackLine = withoutMac.find((l) => l.startsWith('fallback:'))
  const fallbackTarget = fallbackLine?.split(':')[1]?.trim()

  let mode: RoutingSimpleMode | undefined
  if (hasGfw && fallbackTarget === 'direct') {
    mode = 'gfw'
  } else if (hasCnDirect && fallbackTarget === proxyGroupName) {
    mode = 'nonCn'
  } else if (hasCnProxy && fallbackTarget === 'direct') {
    mode = 'cnOnly'
  } else if (hasCnDirect && fallbackTarget === 'direct' && !hasGfw && !hasCnProxy) {
    mode = 'macOnly'
  } else if (!hasGfw && !hasCnDirect && !hasCnProxy && fallbackTarget === proxyGroupName) {
    mode = 'global'
  }

  if (!mode) return

  // Reject configs with extra unknown rules beyond our templates + header
  const allowedPrefixes = [
    'pname(',
    'dip(geoip:private)',
    'dip(geoip:cn)',
    'domain(geosite:cn)',
    'domain(geosite:gfw)',
    'fallback:',
  ]
  const unknown = withoutMac.filter((l) => !allowedPrefixes.some((p) => l.startsWith(p)))
  if (unknown.length > 0) return

  return {
    mode,
    macControlEnabled: !!mac,
    macList: mac?.macList || [],
    macAction: mac?.macAction || 'proxy',
  }
}

function buildRoutingTemplate(
  mode: RoutingSimpleMode,
  proxyGroupName: string,
  macList?: string[],
  macAction: MacAction = 'proxy',
) {
  const header = `pname(NetworkManager, systemd-resolved, dnsmasq) -> must_direct\ndip(geoip:private) -> direct`
  const macRule =
    macList && macList.length > 0
      ? `\nmac(${macList.map((m) => `'${m}'`).join(', ')}) -> ${macAction === 'direct' ? 'direct' : proxyGroupName}`
      : ''

  switch (mode) {
    case 'gfw':
      return `${header}${macRule}
domain(geosite:gfw) -> ${proxyGroupName}
fallback: direct`
    case 'nonCn':
      return `${header}${macRule}
dip(geoip:cn) -> direct
domain(geosite:cn) -> direct
fallback: ${proxyGroupName}`
    case 'cnOnly':
      return `${header}${macRule}
dip(geoip:cn) -> ${proxyGroupName}
domain(geosite:cn) -> ${proxyGroupName}
fallback: direct`
    case 'global':
      return `${header}${macRule}
fallback: ${proxyGroupName}`
    case 'macOnly':
      return `${header}${macRule}
dip(geoip:cn) -> direct
domain(geosite:cn) -> direct
fallback: direct`
  }
}

export function RoutingFormModal({
  ref,
  title,
  opened,
  onClose,
  handleSubmit: onSubmitProp,
  configType = 'routing',
  proxyGroupName,
}: {
  ref?: React.Ref<RoutingFormModalRef>
  title: string
  opened: boolean
  onClose: () => void
  handleSubmit: (values: FormValues) => Promise<void>
  configType?: DaeConfigType
  proxyGroupName: string
}) {
  const { t } = useTranslation()
  const [editingID, setEditingID] = useState<string>()
  const [origins, setOrigins] = useState<FormValues>()
  const [activeTab, setActiveTab] = useState<'simple' | 'advanced'>('simple')
  const [simpleMode, setSimpleMode] = useState<RoutingSimpleMode>('gfw')
  const [macControlEnabled, setMacControlEnabled] = useState(false)
  const [macList, setMacList] = useState<string[]>([])
  const [macAction, setMacAction] = useState<MacAction>('proxy')
  const cleanedMacList = useMemo(() => macList.map((v) => v.trim()).filter(Boolean), [macList])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  })

  const {
    handleSubmit,
    control,
    setValue: setValueOriginal,
    reset,
    formState: { errors, isDirty },
  } = form

  const setValue = useSetValue(setValueOriginal)
  const formValues = useWatch({ control })

  const initOrigins = useCallback(
    (nextOrigins: FormValues) => {
      reset(nextOrigins)
      setOrigins(nextOrigins)
      const detected = detectSimpleMode(nextOrigins.text, proxyGroupName)
      if (detected) {
        setSimpleMode(detected.mode)
        setMacControlEnabled(detected.macControlEnabled)
        setMacList(detected.macList)
        setMacAction(detected.macAction)
        setActiveTab('simple')
      } else {
        setActiveTab('advanced')
      }
    },
    [proxyGroupName, reset],
  )

  const resetForm = useCallback(() => {
    reset(defaultValues)
    setActiveTab('simple')
    setSimpleMode('gfw')
    setMacControlEnabled(false)
    setMacList([])
    setMacAction('proxy')
  }, [reset])

  useImperativeHandle(ref, () => ({
    form: {
      setValues: (values: FormValues) => reset(values),
      setFieldValue: (field: string, value: string) => setValue(field as keyof FormValues, value),
      reset: resetForm,
      values: formValues as FormValues,
      errors: {
        name: errors.name?.message,
        text: errors.text?.message,
      },
    },
    editingID: editingID || '',
    setEditingID,
    initOrigins,
  }))

  const handleClose = useCallback(() => {
    onClose()
    setTimeout(() => {
      resetForm()
      setEditingID(undefined)
      setOrigins(undefined)
    }, 200)
  }, [onClose, resetForm])

  const onSubmit = async (data: FormValues) => {
    await onSubmitProp(data)
    handleClose()
  }

  const simpleModeOptions = useMemo(
    () => [
      {
        value: 'gfw',
        label: t('routingSimple.gfw'),
        description: t('routingSimple.gfwDesc', { group: proxyGroupName }),
      },
      {
        value: 'nonCn',
        label: t('routingSimple.nonCn'),
        description: t('routingSimple.nonCnDesc', { group: proxyGroupName }),
      },
      {
        value: 'cnOnly',
        label: t('routingSimple.cnOnly'),
        description: t('routingSimple.cnOnlyDesc', { group: proxyGroupName }),
      },
      {
        value: 'global',
        label: t('routingSimple.global'),
        description: t('routingSimple.globalDesc', { group: proxyGroupName }),
      },
      {
        value: 'macOnly',
        label: t('routingSimple.macOnly'),
        description: t('routingSimple.macOnlyDesc', { group: proxyGroupName }),
      },
    ],
    [proxyGroupName, t],
  )

  return (
    <Dialog open={opened} onOpenChange={handleClose}>
      <ScrollableDialogContent size="full" className="h-[calc(100vh-2rem)] sm:h-[90vh]">
        <ScrollableDialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </ScrollableDialogHeader>

        <ScrollableDialogBody className="flex flex-col gap-4 min-h-0">
          <Input
            label={t('name')}
            withAsterisk
            value={formValues.name}
            onChange={(e) => setValue('name', e.target.value)}
            error={errors.name?.message}
            disabled={!!editingID}
            className="shrink-0"
          />

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'simple' | 'advanced')} className="flex-1">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="simple">{t('actions.simple mode')}</TabsTrigger>
              <TabsTrigger value="advanced">{t('actions.advanced mode')}</TabsTrigger>
            </TabsList>

            <TabsContent value="simple" className="flex flex-col gap-3 min-h-0 flex-1 overflow-y-auto pr-1">
              <RadioGroup
                label={t('routingSimple.label')}
                value={simpleMode}
                onChange={(value) => {
                  const mode = value as RoutingSimpleMode
                  setSimpleMode(mode)
                  setValue(
                    'text',
                    buildRoutingTemplate(
                      mode,
                      proxyGroupName,
                      macControlEnabled ? cleanedMacList : undefined,
                      macAction,
                    ),
                  )
                }}
              >
                {simpleModeOptions.map((opt) => (
                  <RadioGroupItem key={opt.value} value={opt.value} label={opt.label} description={opt.description} />
                ))}
              </RadioGroup>

              <div className="rounded-lg border p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">{t('routingSimple.macLabel')}</p>
                    <p className="text-xs text-muted-foreground">{t('routingSimple.macDesc')}</p>
                  </div>
                  <Switch
                    checked={macControlEnabled}
                    onCheckedChange={(checked) => {
                      setMacControlEnabled(!!checked)
                      setValue(
                        'text',
                        buildRoutingTemplate(
                          simpleMode,
                          proxyGroupName,
                          checked ? cleanedMacList : undefined,
                          macAction,
                        ),
                      )
                    }}
                    size="sm"
                  />
                </div>

                {macControlEnabled && (
                  <>
                    <RadioGroup
                      label={t('routingSimple.macAction')}
                      value={macAction}
                      onChange={(value) => {
                        const nextAction = value as MacAction
                        setMacAction(nextAction)
                        setValue('text', buildRoutingTemplate(simpleMode, proxyGroupName, cleanedMacList, nextAction))
                      }}
                      className="grid-cols-2"
                    >
                      <RadioGroupItem value="proxy" label={t('routingSimple.macActionProxy')} />
                      <RadioGroupItem value="direct" label={t('routingSimple.macActionDirect')} />
                    </RadioGroup>

                    <InputList
                      label={t('routingSimple.macList')}
                      description={t('routingSimple.macListDesc')}
                      values={macList}
                      placeholder="AA:BB:CC:DD:EE:FF"
                      withAsterisk={false}
                      errors={macList.map((m) =>
                        m.trim() && !MAC_REGEX.test(m.trim()) ? t('routingSimple.macInvalid') : undefined,
                      )}
                      onChange={(values) => {
                        setMacList(values)
                        const cleaned = values.map((v) => v.trim()).filter(Boolean)
                        setValue('text', buildRoutingTemplate(simpleMode, proxyGroupName, cleaned, macAction))
                      }}
                    />
                  </>
                )}
              </div>

              <p className="text-xs text-muted-foreground">{t('routingSimple.note')}</p>
            </TabsContent>

            <TabsContent value="advanced" className="flex flex-col gap-1 min-h-0 flex-1">
              <div className="flex-1 rounded border min-h-[200px] relative">
                <DaeEditor
                  value={formValues.text || ''}
                  onChange={(value) => setValue('text', value)}
                  configType={configType}
                  height="100%"
                />
              </div>

              {errors.text && <p className="text-xs text-destructive">{errors.text.message}</p>}
            </TabsContent>
          </Tabs>

          <form onSubmit={handleSubmit(onSubmit)} className="shrink-0">
            <FormActions
              reset={() => {
                if (editingID && origins) {
                  reset(origins)
                } else {
                  resetForm()
                }
              }}
              isDirty={isDirty}
              errors={errors}
            />
          </form>
        </ScrollableDialogBody>
      </ScrollableDialogContent>
    </Dialog>
  )
}
