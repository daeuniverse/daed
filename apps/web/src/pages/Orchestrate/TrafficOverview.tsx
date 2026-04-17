import type { ChartConfig } from '~/components/ui/chart'
import type { CSSProperties, ReactNode } from 'react'
import dayjs from 'dayjs'
import {
  Activity,
  ArrowDown,
  ArrowUp,
  Download,
  Link2,
  Radio,
  Upload,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { useTrafficOverviewQuery } from '~/apis'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

type TimeRangeKey = '10m' | '30m' | '1h'

interface TimeRangeOption {
  key: TimeRangeKey
  seconds: number
  maxPoints: number
  label: string
}

const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { key: '10m', seconds: 10 * 60, maxPoints: 240, label: '10m' },
  { key: '30m', seconds: 30 * 60, maxPoints: 360, label: '30m' },
  { key: '1h', seconds: 60 * 60, maxPoints: 480, label: '1h' },
]

function formatBytes(value: number) {
  if (value < 1024) return `${value.toFixed(0)} B`
  if (value < 1024 ** 2) return `${(value / 1024).toFixed(value < 10 * 1024 ? 1 : 0)} KB`
  if (value < 1024 ** 3) return `${(value / 1024 ** 2).toFixed(value < 10 * 1024 ** 2 ? 1 : 0)} MB`
  return `${(value / 1024 ** 3).toFixed(1)} GB`
}

function formatRate(value: number) {
  return `${formatBytes(value)}/s`
}

function formatAxisRate(value: number) {
  if (value < 1024) return `${value.toFixed(0)}B`
  if (value < 1024 ** 2) return `${(value / 1024).toFixed(value < 10 * 1024 ? 1 : 0)}K`
  return `${(value / 1024 ** 2).toFixed(value < 10 * 1024 ** 2 ? 1 : 0)}M`
}

function splitFormattedRate(value: number) {
  const formatted = formatRate(value)
  const spaceIndex = formatted.indexOf(' ')

  if (spaceIndex === -1) {
    return { amount: formatted, unit: '' }
  }

  return {
    amount: formatted.slice(0, spaceIndex),
    unit: formatted.slice(spaceIndex + 1),
  }
}

function createTintStyle(colorVar: string): CSSProperties {
  return {
    backgroundColor: `color-mix(in oklab, ${colorVar} 8%, var(--card))`,
    borderColor: `color-mix(in oklab, ${colorVar} 16%, var(--border))`,
  }
}

function createIconTintStyle(colorVar: string): CSSProperties {
  return {
    color: colorVar,
    backgroundColor: `color-mix(in oklab, ${colorVar} 14%, transparent)`,
  }
}

function TrafficMetricCard({
  title,
  amount,
  unit,
  icon,
  colorVar,
}: {
  title: string
  amount: string
  unit: string
  icon: ReactNode
  colorVar: string
}) {
  return (
    <div
      className="rounded-2xl border bg-card px-4 py-3 shadow-sm transition-colors"
      style={createTintStyle(colorVar)}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl transition-colors"
          style={createIconTintStyle(colorVar)}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-foreground">{amount}</span>
            <span className="text-sm text-muted-foreground">{unit}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function TrafficRangeButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: string
}) {
  return (
    <Button
      variant="outline"
      size="xs"
      className={cn(
        'rounded-full px-3 transition-colors',
        active && 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/15',
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

export function TrafficOverview() {
  const { t } = useTranslation()
  const [selectedRange, setSelectedRange] = useState<TimeRangeKey>('30m')

  const chartConfig = useMemo(
    () =>
      ({
        upload: { label: t('trafficOverview.uploadLegend'), color: 'var(--chart-1)' },
        download: { label: t('trafficOverview.downloadLegend'), color: 'var(--chart-2)' },
      }) satisfies ChartConfig,
    [t],
  )

  const selectedWindow = useMemo(
    () => TIME_RANGE_OPTIONS.find((option) => option.key === selectedRange) ?? TIME_RANGE_OPTIONS[1],
    [selectedRange],
  )

  const trafficOverviewQuery = useTrafficOverviewQuery(selectedWindow.seconds, selectedWindow.maxPoints)
  const runtimeOverview = trafficOverviewQuery.data

  const latestSample = useMemo(
    () => ({
      uploadRate: runtimeOverview?.uploadRate ?? 0,
      downloadRate: runtimeOverview?.downloadRate ?? 0,
      uploadTotal: Number(runtimeOverview?.uploadTotal ?? 0),
      downloadTotal: Number(runtimeOverview?.downloadTotal ?? 0),
      activeConnections: runtimeOverview?.activeConnections ?? 0,
      udpSessions: runtimeOverview?.udpSessions ?? 0,
    }),
    [runtimeOverview],
  )

  const uploadChartData = useMemo(
    () =>
      (runtimeOverview?.samples ?? []).map((sample) => ({
        timestamp: dayjs(sample.timestamp).valueOf(),
        value: sample.uploadRate,
      })),
    [runtimeOverview?.samples],
  )
  const downloadChartData = useMemo(
    () =>
      (runtimeOverview?.samples ?? []).map((sample) => ({
        timestamp: dayjs(sample.timestamp).valueOf(),
        value: sample.downloadRate,
      })),
    [runtimeOverview?.samples],
  )

  const uploadRateDisplay = splitFormattedRate(latestSample.uploadRate)
  const downloadRateDisplay = splitFormattedRate(latestSample.downloadRate)

  return (
    <Card
      withBorder
      shadow="sm"
      padding="none"
      className="overflow-hidden border-border/80 bg-card/90 backdrop-blur-sm"
    >
      <CardHeader className="gap-3 border-b border-border/70 px-6 py-5 sm:px-7">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full border border-primary/15 bg-primary/8 p-2 text-primary">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg text-primary">{t('trafficOverview.title')}</CardTitle>
            <CardDescription>{t('trafficOverview.description')}</CardDescription>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {TIME_RANGE_OPTIONS.map((option) => (
            <TrafficRangeButton
              key={option.key}
              active={selectedRange === option.key}
              onClick={() => setSelectedRange(option.key)}
            >
              {t(`trafficOverview.ranges.${option.key}`)}
            </TrafficRangeButton>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-4 py-4 sm:px-5 sm:py-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.85fr)_minmax(340px,1fr)]">
          <div className="grid gap-4">
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{t('trafficOverview.uploadChart')}</p>
                  <p className="text-xs text-muted-foreground">{t('trafficOverview.liveWindow')}</p>
                </div>
                <span className="text-xs font-medium text-[var(--chart-1)]">{t('trafficOverview.uploadLegend')}</span>
              </div>
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-32 w-full"
              >
                <AreaChart data={uploadChartData} margin={{ left: 4, right: 4, top: 4, bottom: 4 }}>
                  <defs>
                    <linearGradient id="traffic-upload-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-upload)" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="var(--color-upload)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    axisLine={false}
                    tickLine={false}
                    minTickGap={24}
                    tickFormatter={(value) => dayjs(value).format('HH:mm')}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    width={60}
                    tickFormatter={(value) => formatAxisRate(Number(value))}
                    domain={[0, (dataMax: number) => Math.max(16 * 1024, dataMax * 1.15)]}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => dayjs(Number(value)).format('HH:mm:ss')}
                        formatter={(value) => formatRate(Number(value))}
                        indicator="line"
                      />
                    }
                  />
                  <Area
                    dataKey="value"
                    type="monotone"
                    stroke="var(--color-upload)"
                    strokeWidth={2.5}
                    fill="url(#traffic-upload-fill)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ChartContainer>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/70 p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{t('trafficOverview.downloadChart')}</p>
                  <p className="text-xs text-muted-foreground">{t('trafficOverview.liveWindow')}</p>
                </div>
                <span className="text-xs font-medium text-[var(--chart-2)]">{t('trafficOverview.downloadLegend')}</span>
              </div>
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-32 w-full"
              >
                <AreaChart data={downloadChartData} margin={{ left: 4, right: 4, top: 4, bottom: 4 }}>
                  <defs>
                    <linearGradient id="traffic-download-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-download)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="var(--color-download)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    axisLine={false}
                    tickLine={false}
                    minTickGap={24}
                    tickFormatter={(value) => dayjs(value).format('HH:mm')}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    width={60}
                    tickFormatter={(value) => formatAxisRate(Number(value))}
                    domain={[0, (dataMax: number) => Math.max(32 * 1024, dataMax * 1.15)]}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => dayjs(Number(value)).format('HH:mm:ss')}
                        formatter={(value) => formatRate(Number(value))}
                        indicator="line"
                      />
                    }
                  />
                  <Area
                    dataKey="value"
                    type="monotone"
                    stroke="var(--color-download)"
                    strokeWidth={2.5}
                    fill="url(#traffic-download-fill)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-2">
            <TrafficMetricCard
              title={t('trafficOverview.uploadSpeed')}
              amount={uploadRateDisplay.amount}
              unit={uploadRateDisplay.unit}
              icon={<ArrowUp className="h-5 w-5" />}
              colorVar="var(--chart-1)"
            />
            <TrafficMetricCard
              title={t('trafficOverview.downloadSpeed')}
              amount={downloadRateDisplay.amount}
              unit={downloadRateDisplay.unit}
              icon={<ArrowDown className="h-5 w-5" />}
              colorVar="var(--chart-2)"
            />
            <TrafficMetricCard
              title={t('trafficOverview.activeConnections')}
              amount={latestSample.activeConnections.toString()}
              unit={t('trafficOverview.connectionsUnit')}
              icon={<Link2 className="h-5 w-5" />}
              colorVar="var(--primary)"
            />
            <TrafficMetricCard
              title={t('trafficOverview.totalUpload')}
              amount={formatBytes(latestSample.uploadTotal).split(' ')[0]}
              unit={formatBytes(latestSample.uploadTotal).split(' ')[1] ?? ''}
              icon={<Upload className="h-5 w-5" />}
              colorVar="var(--chart-1)"
            />
            <TrafficMetricCard
              title={t('trafficOverview.totalDownload')}
              amount={formatBytes(latestSample.downloadTotal).split(' ')[0]}
              unit={formatBytes(latestSample.downloadTotal).split(' ')[1] ?? ''}
              icon={<Download className="h-5 w-5" />}
              colorVar="var(--chart-2)"
            />
            <TrafficMetricCard
              title={t('trafficOverview.udpSessions')}
              amount={latestSample.udpSessions.toString()}
              unit={t('trafficOverview.sessionsUnit')}
              icon={<Radio className="h-5 w-5" />}
              colorVar="var(--chart-3)"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
