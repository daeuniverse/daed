import type { DNSConfig } from './types'
import { AlertCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { DaeEditor } from '~/components/DaeEditor'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { generateDNSConfig, parseDNSConfig } from './parser'
import { RoutingList } from './RoutingList'
import { UpstreamList } from './UpstreamList'

interface Props {
  initialName?: string
  initialConfig?: string
  bindGetValues: (fn: () => { name: string; text: string }) => void
}

export function DNSForm({ initialName = '', initialConfig = '', bindGetValues }: Props) {
  const { t } = useTranslation()
  const initialParsed = useMemo(() => {
    try {
      return { parsed: parseDNSConfig(initialConfig), mode: 'simple' as const }
    } catch (e) {
      console.error('Parse failed', e)
      return {
        parsed: { upstreams: [], requestRules: [], responseRules: [], others: '' } as DNSConfig,
        mode: 'code' as const,
      }
    }
  }, [initialConfig])

  const [name, setName] = useState(() => initialName)
  const [mode, setMode] = useState<'simple' | 'code'>(() => initialParsed.mode)
  const [configStr, setConfigStr] = useState(() => initialConfig)
  const [parsedConfig, setParsedConfig] = useState<DNSConfig>(() => initialParsed.parsed)

  // Expose values getter
  useEffect(() => {
    bindGetValues(() => {
      let text = ''
      if (mode === 'code') {
        text = configStr
      } else {
        text = generateDNSConfig(parsedConfig)
      }
      return { name, text }
    })
  }, [bindGetValues, mode, name, configStr, parsedConfig])

  const handleModeChange = (newMode: 'simple' | 'code') => {
    if (newMode === mode) return
    if (mode === 'code' && newMode === 'simple') {
      try {
        const parsed = parseDNSConfig(configStr)
        setParsedConfig(parsed)
      } catch (e) {
        console.error('Parse failed', e)
        // Stay in code mode if parsing fails.
        return
      }
    }

    setMode(newMode)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>{t('dnsConfig.name')}</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('dnsConfig.name')} />
      </div>

      <Tabs value={mode} onValueChange={(v) => handleModeChange(v as 'simple' | 'code')}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="simple">{t('actions.simple mode')}</TabsTrigger>
          <TabsTrigger value="code">{t('actions.advanced mode')}</TabsTrigger>
        </TabsList>

        <TabsContent value="simple" className="space-y-8 pt-2">
          <UpstreamList
            upstreams={parsedConfig.upstreams}
            onChange={(upstreams) => setParsedConfig({ ...parsedConfig, upstreams })}
          />

          <div className="border-t pt-4">
            <RoutingList
              type="request"
              rules={parsedConfig.requestRules}
              upstreams={parsedConfig.upstreams}
              onChange={(requestRules) => setParsedConfig({ ...parsedConfig, requestRules })}
            />
          </div>

          <div className="border-t pt-4">
            <RoutingList
              type="response"
              rules={parsedConfig.responseRules}
              upstreams={parsedConfig.upstreams}
              onChange={(responseRules) => setParsedConfig({ ...parsedConfig, responseRules })}
            />
          </div>

          <p className="text-xs text-muted-foreground">{t('dnsConfig.simpleNote')}</p>

          {parsedConfig.others && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('dnsConfig.unparsedTitle')}</AlertTitle>
              <AlertDescription>{t('dnsConfig.unparsedDesc')}</AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="code" className="flex flex-col gap-1 pt-2">
          <div className="rounded border h-[400px] relative">
            <DaeEditor
              value={configStr || ''}
              onChange={(value) => setConfigStr(value)}
              configType="dns"
              height="400px"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
