import { Button, Group, Modal, createStyles } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { DataTable, DataTableColumn, DataTableRowExpansionProps } from 'mantine-datatable'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const useStyles = createStyles(() => ({
  header: {
    '&& th': {
      textTransform: 'uppercase',
    },
  },
}))

type Props<T> = {
  fetching: boolean
  columns: DataTableColumn<T>[]
  records: T[]
  createModalTitle?: string
  createModalContent?: (close: () => void) => React.ReactNode
  onRemove?: (records: T[]) => Promise<void>
  isRecordSelectable?: (record: T, index: number) => boolean
  rowExpansion?: DataTableRowExpansionProps<T>
}

export const Table = <Data extends Record<string, unknown>>({
  fetching,
  columns,
  records,
  isRecordSelectable,
  onRemove,
  rowExpansion,
  createModalTitle,
  createModalContent,
}: Props<Data>) => {
  const { classes } = useStyles()
  const { t } = useTranslation()
  const [selectedRecords, onSelectedRecordsChange] = useState<Data[]>([])
  const [opened, { open, close }] = useDisclosure(false)
  const [removing, setRemoving] = useState(false)

  return (
    <div className="p-2">
      <Group className="py-4">
        <Button onClick={open}>{t('actions.add')}</Button>

        <Button
          color="red"
          disabled={selectedRecords.length === 0}
          loading={removing}
          onClick={async () => {
            if (!onRemove) {
              return
            }

            onSelectedRecordsChange([])
            setRemoving(true)
            await onRemove(selectedRecords)
            setRemoving(false)
          }}
        >
          {t('actions.remove')} ({selectedRecords.length})
        </Button>
      </Group>

      <DataTable
        classNames={classes}
        fetching={fetching}
        withBorder
        borderRadius={4}
        withColumnBorders
        striped
        highlightOnHover
        verticalSpacing="sm"
        height={768}
        columns={columns}
        records={records}
        selectedRecords={selectedRecords}
        onSelectedRecordsChange={onSelectedRecordsChange}
        isRecordSelectable={isRecordSelectable}
        rowExpansion={rowExpansion}
      />

      <Modal opened={opened} onClose={close} title={createModalTitle}>
        {createModalContent && createModalContent(close)}
      </Modal>
    </div>
  )
}
