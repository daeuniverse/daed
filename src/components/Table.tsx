import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { cn } from '~/lib/utils'

export interface DataTableColumn<T> {
  accessor: string
  title?: string
  width?: number | string
  render?: (record: T, index: number) => React.ReactNode
  textAlignment?: 'left' | 'center' | 'right'
}

export interface DataTableRowExpansionProps<T> {
  content: (args: { record: T; collapse: () => void }) => React.ReactNode
}

interface Props<T> {
  fetching: boolean
  columns: DataTableColumn<T>[]
  records: T[]
  createModalTitle?: string
  createModalContent?: (close: () => void) => React.ReactNode
  onRemove?: (records: T[]) => Promise<void>
  isRecordSelectable?: (record: T, index: number) => boolean
  rowExpansion?: DataTableRowExpansionProps<T>
}

export function Table<Data extends Record<string, unknown>>({
  fetching,
  columns,
  records,
  isRecordSelectable,
  onRemove,
  rowExpansion,
  createModalTitle,
  createModalContent,
}: Props<Data>) {
  const { t } = useTranslation()
  const [selectedRecords, setSelectedRecords] = useState<Data[]>([])
  const [opened, setOpened] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Set<number>>(() => new Set())

  const toggleRowSelection = (record: Data, index: number) => {
    if (isRecordSelectable && !isRecordSelectable(record, index)) return

    setSelectedRecords((prev) => {
      const isSelected = prev.includes(record)

      if (isSelected) {
        return prev.filter((r) => r !== record)
      }

      return [...prev, record]
    })
  }

  const toggleRowExpansion = (index: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev)

      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }

      return newSet
    })
  }

  const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
    return path.split('.').reduce((acc: unknown, part: string) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[part]
      }

      return undefined
    }, obj)
  }

  return (
    <div className="p-2">
      <div className="flex gap-2 py-2">
        <Button onClick={() => setOpened(true)} uppercase>
          {t('actions.add')}
        </Button>

        <Button
          variant="destructive"
          disabled={selectedRecords.length === 0}
          loading={removing}
          uppercase
          onClick={async () => {
            if (!onRemove) return

            setSelectedRecords([])
            setRemoving(true)
            await onRemove(selectedRecords)
            setRemoving(false)
          }}
        >
          {t('actions.remove')} ({selectedRecords.length})
        </Button>
      </div>

      <div className="border rounded overflow-hidden">
        <div className="overflow-x-auto max-h-[768px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted sticky top-0">
              <tr>
                <th className="p-3 text-left uppercase w-10">
                  <Checkbox
                    checked={selectedRecords.length === records.length && records.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedRecords(records.filter((r, i) => !isRecordSelectable || isRecordSelectable(r, i)))
                      } else {
                        setSelectedRecords([])
                      }
                    }}
                  />
                </th>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={cn(
                      'p-3 uppercase font-medium border-l',
                      col.textAlignment === 'center' && 'text-center',
                      col.textAlignment === 'right' && 'text-right',
                      !col.textAlignment && 'text-left',
                    )}
                    style={{ width: col.width }}
                  >
                    {col.title || col.accessor}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fetching ? (
                <tr>
                  <td colSpan={columns.length + 1} className="p-8 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="p-8 text-center text-muted-foreground">
                    No records found
                  </td>
                </tr>
              ) : (
                records.map((record, index) => {
                  const isSelectable = !isRecordSelectable || isRecordSelectable(record, index)
                  const isSelected = selectedRecords.includes(record)
                  const isExpanded = expandedRows.has(index)

                  return (
                    <Fragment key={index}>
                      <tr
                        className={cn(
                          'border-t hover:bg-accent/50 transition-colors',
                          index % 2 === 1 && 'bg-muted/30',
                          isSelected && 'bg-primary/10',
                          rowExpansion && 'cursor-pointer',
                        )}
                        onClick={() => rowExpansion && toggleRowExpansion(index)}
                      >
                        <td className="p-3" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isSelected}
                            disabled={!isSelectable}
                            onCheckedChange={() => toggleRowSelection(record, index)}
                          />
                        </td>
                        {columns.map((col, colIdx) => (
                          <td
                            key={colIdx}
                            className={cn(
                              'p-3 border-l',
                              col.textAlignment === 'center' && 'text-center',
                              col.textAlignment === 'right' && 'text-right',
                            )}
                          >
                            {col.render
                              ? col.render(record, index)
                              : String(getNestedValue(record, col.accessor) ?? '')}
                          </td>
                        ))}
                      </tr>
                      {rowExpansion && isExpanded && (
                        <tr key={`${index}-expansion`}>
                          <td colSpan={columns.length + 1} className="p-0 border-t bg-muted/20">
                            {rowExpansion.content({
                              record,
                              collapse: () => toggleRowExpansion(index),
                            })}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={opened} onOpenChange={setOpened}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{createModalTitle}</DialogTitle>
          </DialogHeader>
          {createModalContent && createModalContent(() => setOpened(false))}
        </DialogContent>
      </Dialog>
    </div>
  )
}
