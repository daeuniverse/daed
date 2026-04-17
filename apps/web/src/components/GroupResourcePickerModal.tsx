import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Dialog, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import {
  ScrollableDialogBody,
  ScrollableDialogContent,
  ScrollableDialogFooter,
  ScrollableDialogHeader,
} from '~/components/ui/scrollable-dialog'
import { cn } from '~/lib/utils'

export interface GroupPickerItem {
  id: string
  title: string
  description?: string
  meta?: string
  metaTone?: 'default' | 'primary'
  badge?: string
  keywords?: string[]
  previewNodes?: GroupPickerPreviewNode[]
}

export interface GroupPickerPreviewNode {
  id: string
  title: string
  protocol?: string
}

type SelectionDialogLayout = 'node-card' | 'subscription-chip'

interface SelectionDialogProps {
  opened: boolean
  onClose: () => void
  title: string
  searchPlaceholder: string
  emptyLabel: string
  noResultsLabel: string
  submitLabel: string
  loading?: boolean
  items: GroupPickerItem[]
  resetKey: string
  layout: SelectionDialogLayout
  onSubmit: (ids: string[]) => Promise<void>
}

function SelectionDialog({
  opened,
  onClose,
  title,
  searchPlaceholder,
  emptyLabel,
  noResultsLabel,
  submitLabel,
  loading,
  items,
  resetKey,
  layout,
  onSubmit,
}: SelectionDialogProps) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    setQuery('')
    setSelectedIds([])
  }, [opened, resetKey])

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) return items

    return items.filter((item) =>
      [item.title, item.description, item.meta, ...(item.keywords || [])]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedQuery)),
    )
  }, [items, query])

  const selectedCount = selectedIds.length
  const isSubscriptionChipLayout = layout === 'subscription-chip'

  const toggleItem = (id: string) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]))
  }

  const handleClose = () => {
    onClose()
    setQuery('')
    setSelectedIds([])
  }

  const handleSubmit = async () => {
    if (selectedCount === 0) return

    await onSubmit(selectedIds)
    handleClose()
  }

  return (
    <Dialog open={opened} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <ScrollableDialogContent size="xl">
        <ScrollableDialogHeader>
          <div className="pr-8">
            <DialogTitle>{title}</DialogTitle>
            <p className="mt-2 text-sm text-muted-foreground">{t('groupPicker.selectedCount', { count: selectedCount })}</p>
          </div>
        </ScrollableDialogHeader>

        <ScrollableDialogBody className="flex flex-col gap-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            icon={<Search className="h-4 w-4" />}
          />

          <div className="flex flex-wrap gap-2.5">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const checked = selectedIds.includes(item.id)
                const tooltipLabel = [item.title, item.description, item.meta].filter(Boolean).join('\n')

                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={checked}
                    title={tooltipLabel || undefined}
                    className={cn(
                      'cursor-pointer rounded-lg border transition-colors outline-none',
                      'hover:border-primary/30 hover:bg-accent/40 focus-visible:border-primary/40',
                      checked && 'border-primary bg-primary/5',
                      isSubscriptionChipLayout
                        ? 'inline-flex max-w-full items-center gap-2 px-3 py-2'
                        : 'min-w-[240px] max-w-full flex-1 basis-[260px] p-3',
                    )}
                    onClick={() => toggleItem(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        toggleItem(item.id)
                      }
                    }}
                  >
                    <div className={cn('flex min-w-0 gap-3', isSubscriptionChipLayout ? 'items-center' : 'items-start')}>
                      <Checkbox
                        checked={checked}
                        className={cn('shrink-0', !isSubscriptionChipLayout && 'mt-0.5')}
                        onCheckedChange={() => toggleItem(item.id)}
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                      />

                      {isSubscriptionChipLayout ? (
                        <div className="flex min-w-0 items-center gap-2">
                          <p className="max-w-[20rem] truncate text-sm font-medium">{item.title}</p>
                          {item.meta && (
                            <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                              {item.meta}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-medium">{item.title}</p>
                            {item.badge && (
                              <span className="inline-flex rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                                {item.badge}
                              </span>
                            )}
                          </div>

                          {item.description && <p className="mt-1 truncate text-xs text-muted-foreground">{item.description}</p>}
                          {item.meta && <p className="mt-1 text-[11px] text-muted-foreground">{item.meta}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">
                {query.trim() ? noResultsLabel : emptyLabel}
              </p>
            )}
          </div>
        </ScrollableDialogBody>

        <ScrollableDialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={loading}>
            {t('actions.cancel')}
          </Button>
          <Button onClick={handleSubmit} loading={loading} disabled={selectedCount === 0 || loading}>
            {submitLabel}
          </Button>
        </ScrollableDialogFooter>
      </ScrollableDialogContent>
    </Dialog>
  )
}

export function GroupAddNodesModal({
  opened,
  onClose,
  groupName,
  items,
  loading,
  resetKey,
  onSubmit,
}: {
  opened: boolean
  onClose: () => void
  groupName: string
  items: GroupPickerItem[]
  loading?: boolean
  resetKey: string
  onSubmit: (ids: string[]) => Promise<void>
}) {
  const { t } = useTranslation()

  return (
    <SelectionDialog
      opened={opened}
      onClose={onClose}
      title={t('groupPicker.addNodesTitle', { name: groupName })}
      searchPlaceholder={t('groupPicker.searchNodesPlaceholder')}
      emptyLabel={t('groupPicker.noAvailableNodes')}
      noResultsLabel={t('groupPicker.noSearchResults')}
      submitLabel={t('groupPicker.addSelectedNodes')}
      items={items}
      loading={loading}
      resetKey={resetKey}
      layout="node-card"
      onSubmit={onSubmit}
    />
  )
}

export function GroupAddSubscriptionsModal({
  opened,
  onClose,
  groupName,
  items,
  loading,
  resetKey,
  onSubmit,
}: {
  opened: boolean
  onClose: () => void
  groupName: string
  items: GroupPickerItem[]
  loading?: boolean
  resetKey: string
  onSubmit: (values: { ids: string[]; nameFilterRegex?: string | null }) => Promise<void>
}) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [nameFilterRegex, setNameFilterRegex] = useState('')
  const [serverRegexError, setServerRegexError] = useState<string | null>(null)

  useEffect(() => {
    setQuery('')
    setSelectedIds([])
    setNameFilterRegex('')
    setServerRegexError(null)
  }, [opened, resetKey])

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return items

    return items.filter((item) =>
      [item.title, item.description, item.meta, ...(item.keywords || [])]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedQuery)),
    )
  }, [items, query])

  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.includes(item.id)),
    [items, selectedIds],
  )

  const trimmedRegex = nameFilterRegex.trim()

  const clientRegexError = useMemo(() => {
    if (!trimmedRegex) return null
    try {
      // Validate user input before sending it to the backend.
      new RegExp(trimmedRegex)
      return null
    } catch (error) {
      return error instanceof Error ? error.message : t('groupPicker.invalidRegex')
    }
  }, [trimmedRegex, t])

  const regexError = clientRegexError || serverRegexError

  const previewGroups = useMemo(() => {
    const regex = trimmedRegex && !regexError ? new RegExp(trimmedRegex) : null

    return selectedItems.map((item) => {
      const allNodes = item.previewNodes || []
      const matchedNodes = regex ? allNodes.filter((node) => regex.test(node.title)) : allNodes

      return {
        item,
        matchedNodes,
      }
    })
  }, [regexError, selectedItems, trimmedRegex])

  const totalMatchedNodes = previewGroups.reduce((sum, group) => sum + group.matchedNodes.length, 0)

  const toggleItem = (id: string) => {
    setServerRegexError(null)
    setSelectedIds((current) => (current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]))
  }

  const handleClose = () => {
    onClose()
    setQuery('')
    setSelectedIds([])
    setNameFilterRegex('')
    setServerRegexError(null)
  }

  const submitDisabled =
    selectedIds.length === 0 || !!regexError || !!loading || (trimmedRegex.length > 0 && totalMatchedNodes === 0)

  const handleSubmit = async () => {
    if (submitDisabled) return

    try {
      await onSubmit({
        ids: selectedIds,
        nameFilterRegex: trimmedRegex || null,
      })
      handleClose()
    } catch (error) {
      const message = error instanceof Error ? error.message : t('groupPicker.invalidRegex')
      if (trimmedRegex && /regex|regexp|pattern/i.test(message)) {
        setServerRegexError(message)
        return
      }
      throw error
    }
  }

  return (
    <Dialog open={opened} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <ScrollableDialogContent size="xl">
        <ScrollableDialogHeader>
          <div className="pr-8">
            <DialogTitle>{t('groupPicker.addSubscriptionsTitle', { name: groupName })}</DialogTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('groupPicker.selectedCount', { count: selectedIds.length })}
            </p>
          </div>
        </ScrollableDialogHeader>

        <ScrollableDialogBody className="flex flex-col gap-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('groupPicker.searchSubscriptionsPlaceholder')}
            icon={<Search className="h-4 w-4" />}
          />

          <div className="flex flex-wrap gap-2.5">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const checked = selectedIds.includes(item.id)
                const tooltipLabel = [item.title, item.description, item.meta].filter(Boolean).join('\n')

                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={checked}
                    title={tooltipLabel || undefined}
                    className={cn(
                      'inline-flex max-w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-colors outline-none',
                      'hover:border-primary/30 hover:bg-accent/40 focus-visible:border-primary/40',
                      checked && 'border-primary bg-primary/5',
                    )}
                    onClick={() => toggleItem(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        toggleItem(item.id)
                      }
                    }}
                  >
                    <Checkbox
                      checked={checked}
                      className="shrink-0"
                      onCheckedChange={() => toggleItem(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                    />

                    <div className="flex min-w-0 items-center gap-2">
                      <p className="max-w-[20rem] truncate text-sm font-medium">{item.title}</p>
                      {item.meta && (
                        <span
                          className={cn(
                            'shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium',
                            item.metaTone === 'primary' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
                          )}
                        >
                          {item.meta}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">
                {query.trim() ? t('groupPicker.noSearchResults') : t('groupPicker.noAvailableSubscriptions')}
              </p>
            )}
          </div>

          <div className="rounded-lg border border-border/70 bg-card/60 p-4">
            <Input
              label={t('groupPicker.subscriptionRegexLabel')}
              value={nameFilterRegex}
              onChange={(e) => {
                setNameFilterRegex(e.target.value)
                setServerRegexError(null)
              }}
              placeholder={t('groupPicker.subscriptionRegexPlaceholder')}
              error={regexError || undefined}
            />
            <p className="mt-2 text-xs text-muted-foreground">{t('groupPicker.subscriptionRegexHint')}</p>
          </div>

          <div className="rounded-lg border border-border/70 bg-card/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{t('groupPicker.subscriptionPreviewTitle')}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {trimmedRegex
                    ? t('groupPicker.subscriptionPreviewSummary', { count: totalMatchedNodes })
                    : t('groupPicker.subscriptionPreviewUnfiltered')}
                </p>
              </div>
            </div>

            {selectedItems.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">{t('groupPicker.subscriptionPreviewSelectFirst')}</p>
            ) : previewGroups.every((group) => group.matchedNodes.length === 0) ? (
              <p className="mt-4 text-sm text-muted-foreground">
                {trimmedRegex ? t('groupPicker.subscriptionPreviewEmpty') : t('groupPicker.subscriptionPreviewUnfiltered')}
              </p>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                {previewGroups.map(({ item, matchedNodes }) => (
                  <div key={item.id} className="rounded-lg border border-border/60 bg-background/40 p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{item.title}</p>
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {t('groupPicker.subscriptionPreviewMatchedCount', { count: matchedNodes.length })}
                      </span>
                    </div>

                    {matchedNodes.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {matchedNodes.map((node) => (
                          <span
                            key={node.id}
                            className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-background px-2 py-1 text-xs"
                          >
                            {node.protocol && (
                              <span className="rounded bg-primary/10 px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                                {node.protocol}
                              </span>
                            )}
                            <span className="max-w-[16rem] truncate">{node.title}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-xs text-muted-foreground">{t('groupPicker.subscriptionPreviewNoMatchForItem')}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollableDialogBody>

        <ScrollableDialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={loading}>
            {t('actions.cancel')}
          </Button>
          <Button onClick={handleSubmit} loading={loading} disabled={submitDisabled}>
            {t('groupPicker.addSelectedSubscriptions')}
          </Button>
        </ScrollableDialogFooter>
      </ScrollableDialogContent>
    </Dialog>
  )
}
