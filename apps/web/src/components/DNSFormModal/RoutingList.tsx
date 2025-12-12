import type { RoutingRule, Upstream } from './types'
import { Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

interface Props {
  type: 'request' | 'response'
  rules: RoutingRule[]
  upstreams: Upstream[]
  onChange: (rules: RoutingRule[]) => void
}

export function RoutingList({ type, rules, upstreams, onChange }: Props) {
  const { t } = useTranslation()

  const handleAdd = () => {
    onChange([
      ...rules,
      {
        id: Date.now().toString() + Math.random(),
        matcher: '',
        target: '',
      },
    ])
  }

  const handleAddFallback = () => {
    if (rules.some((r) => r.matcher === 'fallback')) return
    onChange([
      ...rules,
      {
        id: Date.now().toString() + Math.random(),
        matcher: 'fallback',
        target: '',
      },
    ])
  }

  const handleRemove = (id: string) => {
    onChange(rules.filter((r) => r.id !== id))
  }

  const handleChange = (id: string, field: 'matcher' | 'target', value: string) => {
    onChange(
      rules.map((r) => {
        if (r.id === id) {
          return { ...r, [field]: value }
        }
        return r
      }),
    )
  }

  const hasFallback = rules.some((r) => r.matcher === 'fallback')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>{type === 'request' ? t('dnsConfig.requestRules') : t('dnsConfig.responseRules')}</Label>
        <div className="flex gap-2">
          {!hasFallback && (
            <Button variant="outline" size="sm" onClick={handleAddFallback}>
              <Plus className="mr-2 h-4 w-4" /> {t('dnsConfig.addFallback')}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" /> {t('dnsConfig.addRule')}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {rules.map((rule) => (
          <div key={rule.id} className="flex gap-2 items-center">
            <div className="flex-1">
              <Input
                placeholder={rule.matcher === 'fallback' ? 'fallback' : t('dnsConfig.matcherPlaceholder')}
                value={rule.matcher === 'fallback' ? 'Fallback' : rule.matcher}
                onChange={(e) => handleChange(rule.id, 'matcher', e.target.value)}
                disabled={rule.matcher === 'fallback'}
                className={rule.matcher === 'fallback' ? 'font-bold text-primary' : ''}
                list={rule.matcher === 'fallback' ? undefined : `matcher-list-${type}`}
              />
              {rule.matcher !== 'fallback' && (
                <datalist id={`matcher-list-${type}`}>
                  <option value="qname(geosite:cn)" />
                  <option value="qname(geosite:gfw)" />
                  <option value="qname(geosite:private)" />
                  <option value="qtype(A)" />
                  <option value="qtype(AAAA)" />
                </datalist>
              )}
            </div>
            <div className="w-8 flex items-center justify-center text-muted-foreground">-&gt;</div>
            <div className="w-1/3">
              <Input
                placeholder={t('dnsConfig.targetPlaceholder')}
                value={rule.target}
                onChange={(e) => handleChange(rule.id, 'target', e.target.value)}
                list={`upstreams-list-${type}`} // Helper for autocomplete
              />
              <datalist id={`upstreams-list-${type}`}>
                {upstreams.map((u) => (
                  <option key={u.id} value={u.name} />
                ))}
                {type === 'request' && (
                  <>
                    <option value="asis" />
                    <option value="reject" />
                  </>
                )}
                {type === 'response' && (
                  <>
                    <option value="accept" />
                    <option value="reject" />
                  </>
                )}
              </datalist>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => handleRemove(rule.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {rules.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
            {t('dnsConfig.noRules')}
          </div>
        )}
      </div>
    </div>
  )
}
