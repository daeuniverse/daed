import type { Upstream } from './types'
import { Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

interface Props {
  upstreams: Upstream[]
  onChange: (upstreams: Upstream[]) => void
  label?: string
  addLabel?: string
  emptyLabel?: string
  namePlaceholder?: string
  linkPlaceholder?: string
}

export function UpstreamList({
  upstreams,
  onChange,
  label,
  addLabel,
  emptyLabel,
  namePlaceholder,
  linkPlaceholder,
}: Props) {
  const { t } = useTranslation()

  const handleAdd = () => {
    onChange([
      ...upstreams,
      {
        id: Date.now().toString() + Math.random(),
        name: '',
        link: '',
      },
    ])
  }

  const handleRemove = (id: string) => {
    onChange(upstreams.filter((u) => u.id !== id))
  }

  const handleChange = (id: string, field: 'name' | 'link', value: string) => {
    onChange(
      upstreams.map((u) => {
        if (u.id === id) {
          return { ...u, [field]: value }
        }
        return u
      }),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>{label || t('dnsConfig.upstreams')}</Label>
        <Button variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> {addLabel || t('dnsConfig.addUpstream')}
        </Button>
      </div>

      <div className="space-y-2">
        {upstreams.map((upstream) => (
          <div key={upstream.id} className="flex gap-2 items-start">
            <div className="w-1/3">
              <Input
                placeholder={namePlaceholder || t('dnsConfig.upstreamNamePlaceholder')}
                value={upstream.name}
                onChange={(e) => handleChange(upstream.id, 'name', e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Input
                placeholder={linkPlaceholder || t('dnsConfig.upstreamLinkPlaceholder')}
                value={upstream.link}
                onChange={(e) => handleChange(upstream.id, 'link', e.target.value)}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => handleRemove(upstream.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {upstreams.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
            {emptyLabel || t('dnsConfig.noUpstreams')}
          </div>
        )}
      </div>
    </div>
  )
}
