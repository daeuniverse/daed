import type { ConfigsQuery } from '~/schemas/gql/graphql'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Check,
  Clock,
  Globe,
  Network,
  Server,
  Settings,
  Shield,
  X,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge } from '~/components/ui/badge'
import { Card } from '~/components/ui/card'
import { cn } from '~/lib/utils'

type Config = ConfigsQuery['configs'][number]

interface ConfigDetailViewProps {
  config: Config
}

function DetailItem({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="flex items-center gap-2 text-muted-foreground shrink-0">
        {icon && <span className="text-muted-foreground/70">{icon}</span>}
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-sm font-medium text-right break-all">{value}</div>
    </div>
  )
}

function BooleanBadge({ value }: { value: boolean }) {
  return (
    <Badge
      variant={value ? 'default' : 'secondary'}
      className={cn('gap-1', value && 'bg-green-600 hover:bg-green-600')}
    >
      {value ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {value ? 'Enabled' : 'Disabled'}
    </Badge>
  )
}

function ArrayBadges({ values }: { values: string[] }) {
  if (values.length === 0) {
    return <span className="text-muted-foreground text-xs">—</span>
  }
  return (
    <div className="flex flex-wrap gap-1 justify-end">
      {values.map((v, i) => (
        <Badge key={i} variant="outline" className="text-xs font-mono">
          {v}
        </Badge>
      ))}
    </div>
  )
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card withBorder padding="md" className="space-y-1">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-md bg-primary/10 text-primary">{icon}</div>
        <h4 className="font-semibold text-sm">{title}</h4>
      </div>
      <div className="divide-y divide-border">{children}</div>
    </Card>
  )
}

export function ConfigDetailView({ config }: ConfigDetailViewProps) {
  const { t } = useTranslation()
  const { global } = config

  return (
    <div className="space-y-4">
      {/* Software Options */}
      <SectionCard title={t('software options')} icon={<Settings className="h-4 w-4" />}>
        <DetailItem label={t('logLevel')} value={<Badge variant="outline">{global.logLevel}</Badge>} />
        <DetailItem
          label={t('tproxyPort')}
          value={<code className="text-xs bg-muted px-1.5 py-0.5 rounded">{global.tproxyPort}</code>}
        />
        <DetailItem label={t('tproxyPortProtect')} value={<BooleanBadge value={global.tproxyPortProtect} />} />
        <DetailItem
          label={t('soMarkFromDae')}
          value={<code className="text-xs bg-muted px-1.5 py-0.5 rounded">{global.soMarkFromDae}</code>}
        />
        {global.pprofPort > 0 && (
          <DetailItem
            label={t('pprofPort')}
            value={<code className="text-xs bg-muted px-1.5 py-0.5 rounded">{global.pprofPort}</code>}
          />
        )}
      </SectionCard>

      {/* Interface and Kernel Options */}
      <SectionCard title={t('interface and kernel options')} icon={<Network className="h-4 w-4" />}>
        <DetailItem label={t('lanInterface')} value={<ArrayBadges values={global.lanInterface} />} />
        <DetailItem label={t('wanInterface')} value={<ArrayBadges values={global.wanInterface} />} />
        <DetailItem
          label={t('autoConfigKernelParameter')}
          value={<BooleanBadge value={global.autoConfigKernelParameter} />}
        />
        <DetailItem label={t('mptcp')} value={<BooleanBadge value={global.mptcp} />} />
        <DetailItem
          label={t('enableLocalTcpFastRedirect')}
          value={<BooleanBadge value={global.enableLocalTcpFastRedirect} />}
        />
      </SectionCard>

      {/* Connecting Options */}
      <SectionCard title={t('connecting options')} icon={<Globe className="h-4 w-4" />}>
        <DetailItem label={t('dialMode')} value={<Badge variant="secondary">{global.dialMode}</Badge>} />
        <DetailItem label={t('allowInsecure')} value={<BooleanBadge value={global.allowInsecure} />} />
        <DetailItem label={t('disableWaitingNetwork')} value={<BooleanBadge value={global.disableWaitingNetwork} />} />
      </SectionCard>

      {/* Node Connectivity Check */}
      <SectionCard title={t('node connectivity check')} icon={<Clock className="h-4 w-4" />}>
        <DetailItem
          label={t('checkInterval')}
          value={<code className="text-xs bg-muted px-1.5 py-0.5 rounded">{global.checkInterval}</code>}
        />
        <DetailItem
          label={t('checkTolerance')}
          value={<code className="text-xs bg-muted px-1.5 py-0.5 rounded">{global.checkTolerance}</code>}
        />
        <DetailItem
          label={t('sniffingTimeout')}
          value={<code className="text-xs bg-muted px-1.5 py-0.5 rounded">{global.sniffingTimeout}</code>}
        />
        <DetailItem
          label={t('tcpCheckHttpMethod')}
          value={<Badge variant="outline">{global.tcpCheckHttpMethod}</Badge>}
        />
        <DetailItem label={t('tcpCheckUrl')} value={<ArrayBadges values={global.tcpCheckUrl} />} />
        <DetailItem label={t('udpCheckDns')} value={<ArrayBadges values={global.udpCheckDns} />} />
      </SectionCard>

      {/* TLS Options */}
      <SectionCard title="TLS" icon={<Shield className="h-4 w-4" />}>
        <DetailItem
          label={t('tlsImplementation')}
          value={<Badge variant="secondary">{global.tlsImplementation}</Badge>}
        />
        <DetailItem label={t('utlsImitate')} value={<Badge variant="outline">{global.utlsImitate}</Badge>} />
      </SectionCard>

      {/* DNS */}
      <SectionCard title={t('dns')} icon={<Server className="h-4 w-4" />}>
        <DetailItem
          label={t('fallbackResolver')}
          value={
            global.fallbackResolver ? (
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{global.fallbackResolver}</code>
            ) : (
              <span className="text-muted-foreground text-xs">—</span>
            )
          }
        />
      </SectionCard>

      {/* Bandwidth */}
      {(global.bandwidthMaxTx || global.bandwidthMaxRx) && (
        <SectionCard title="Bandwidth" icon={<ArrowUpFromLine className="h-4 w-4" />}>
          {global.bandwidthMaxTx && (
            <DetailItem
              label={t('bandwidthMaxTx')}
              icon={<ArrowUpFromLine className="h-3 w-3" />}
              value={<code className="text-xs bg-muted px-1.5 py-0.5 rounded">{global.bandwidthMaxTx}</code>}
            />
          )}
          {global.bandwidthMaxRx && (
            <DetailItem
              label={t('bandwidthMaxRx')}
              icon={<ArrowDownToLine className="h-3 w-3" />}
              value={<code className="text-xs bg-muted px-1.5 py-0.5 rounded">{global.bandwidthMaxRx}</code>}
            />
          )}
        </SectionCard>
      )}
    </div>
  )
}
