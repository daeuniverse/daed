import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useNodesQuery, useSubscriptionsQuery } from '~/apis'
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

interface NodeItem {
  id: string
  name: string
  source: string
}

export function BatchAddNodesModal({
  opened,
  onClose,
  existingNodeIDs,
  onSubmit,
  onRemove,
}: {
  opened: boolean
  onClose: () => void
  existingNodeIDs: string[]
  onSubmit: (nodeIDs: string[]) => void
  onRemove: (nodeIDs: string[]) => void
}) {
  const { t } = useTranslation()
  const { data: nodesQuery } = useNodesQuery()
  const { data: subscriptionsQuery } = useSubscriptionsQuery()
  const [search, setSearch] = useState('')
  const [selectedIDs, setSelectedIDs] = useState<Set<string>>(() => new Set())

  // Build flat node list with source info
  const allNodes = useMemo<NodeItem[]>(() => {
    const items: NodeItem[] = []
    const subscriptionMap = new Map<string, string>()

    subscriptionsQuery?.subscriptions.forEach((sub) => {
      sub.nodes.edges.forEach((node) => {
        subscriptionMap.set(node.id, sub.tag || sub.link)
      })
    })

    nodesQuery?.nodes.edges.forEach((node) => {
      items.push({
        id: node.id,
        name: node.name,
        source: subscriptionMap.get(node.id) ?? t('node'),
      })
    })

    // Also include subscription nodes not in standalone nodes
    subscriptionsQuery?.subscriptions.forEach((sub) => {
      sub.nodes.edges.forEach((node) => {
        if (!items.some((n) => n.id === node.id)) {
          items.push({
            id: node.id,
            name: node.name,
            source: sub.tag || sub.link,
          })
        }
      })
    })

    return items.sort((a, b) => a.name.localeCompare(b.name))
  }, [nodesQuery, subscriptionsQuery, t])

  const filteredNodes = useMemo(() => {
    if (!search.trim()) return allNodes
    const keyword = search.trim().toLowerCase()
    return allNodes.filter((n) => n.name.toLowerCase().includes(keyword))
  }, [allNodes, search])

  const existingSet = useMemo(() => new Set(existingNodeIDs), [existingNodeIDs])

  // Initialize selectedIDs with existing nodes when modal opens
  const [initialized, setInitialized] = useState(false)
  if (opened && !initialized) {
    setSelectedIDs(new Set(existingNodeIDs))
    setInitialized(true)
  }

  const toggleNode = (id: string) => {
    setSelectedIDs((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleAll = () => {
    const allSelected = filteredNodes.every((n) => selectedIDs.has(n.id))

    if (allSelected) {
      setSelectedIDs((prev) => {
        const next = new Set(prev)
        filteredNodes.forEach((n) => next.delete(n.id))
        return next
      })
    } else {
      setSelectedIDs((prev) => {
        const next = new Set(prev)
        filteredNodes.forEach((n) => next.add(n.id))
        return next
      })
    }
  }

  const handleClose = () => {
    setSearch('')
    setSelectedIDs(new Set())
    setInitialized(false)
    onClose()
  }

  const handleSubmit = () => {
    const toAdd = [...selectedIDs].filter((id) => !existingSet.has(id))
    const toRemove = existingNodeIDs.filter((id) => !selectedIDs.has(id))

    if (toAdd.length > 0) onSubmit(toAdd)
    if (toRemove.length > 0) onRemove(toRemove)

    handleClose()
  }

  const hasChanges =
    [...selectedIDs].some((id) => !existingSet.has(id)) || existingNodeIDs.some((id) => !selectedIDs.has(id))

  const allChecked = filteredNodes.length > 0 && filteredNodes.every((n) => selectedIDs.has(n.id))
  const someChecked = filteredNodes.some((n) => selectedIDs.has(n.id))

  return (
    <Dialog open={opened} onOpenChange={(open) => !open && handleClose()}>
      <ScrollableDialogContent size="lg" className="max-h-[70vh] min-h-[70vh]">
        <ScrollableDialogHeader>
          <DialogTitle>{t('batchAddNodes.title')}</DialogTitle>
          <Input
            placeholder={t('batchAddNodes.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-2"
          />
        </ScrollableDialogHeader>

        <ScrollableDialogBody className="p-0">
          <table className="w-full text-sm" role="grid">
            <thead className="bg-muted/95 sticky top-0 z-10">
              <tr>
                <th className="w-10 p-3 text-left">
                  <Checkbox
                    checked={allChecked}
                    {...(someChecked && !allChecked ? { 'data-state': 'indeterminate' } : {})}
                    onCheckedChange={toggleAll}
                    aria-label={t('batchAddNodes.selectAll')}
                  />
                </th>
                <th className="p-3 text-left font-medium">{t('name')}</th>
                <th className="p-3 text-left font-medium">{t('batchAddNodes.source')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredNodes.map((node) => {
                const isSelected = selectedIDs.has(node.id)

                return (
                  <tr
                    key={node.id}
                    className="border-b hover:bg-muted/30 cursor-pointer"
                    onClick={() => toggleNode(node.id)}
                  >
                    <td className="w-10 p-3">
                      <Checkbox checked={isSelected} onCheckedChange={() => toggleNode(node.id)} />
                    </td>
                    <td className="p-3">{node.name}</td>
                    <td className="p-3 text-muted-foreground">{node.source}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </ScrollableDialogBody>

        <ScrollableDialogFooter>
          <span className="mr-auto text-sm text-muted-foreground">
            {t('batchAddNodes.selectedCount', { count: selectedIDs.size })}
          </span>
          <Button variant="outline" onClick={handleClose}>
            {t('actions.cancel')}
          </Button>
          <Button disabled={!hasChanges} onClick={handleSubmit}>
            {t('actions.confirm')}
          </Button>
        </ScrollableDialogFooter>
      </ScrollableDialogContent>
    </Dialog>
  )
}
