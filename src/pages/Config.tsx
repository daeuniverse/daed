import { Button, Flex, Group } from '@mantine/core'
import { useStore } from '@nanostores/react'
import { useCallback, useMemo, useState } from 'react'

import { useConfigsQuery, useRemoveDNSMutation } from '~/apis'
import { Table } from '~/components/Table'
import { useMainContainerSize } from '~/contexts'
import { defaultResourcesAtom } from '~/store'

export const ConfigPage = () => {
  const { height } = useMainContainerSize()
  const { defaultConfigID } = useStore(defaultResourcesAtom)
  const { data: configsQuery } = useConfigsQuery()
  const [rowSelection, onRowSelectionChange] = useState({})
  const removeDNSMutation = useRemoveDNSMutation()
  const [removing, setRemoving] = useState(false)
  const selectedRowIds: string[] = useMemo(
    () =>
      Object.keys(rowSelection)
        .map((selectedIndex) => {
          return configsQuery?.configs[Number(selectedIndex)].id
        })
        .filter((id) => !!id) as string[],
    [rowSelection, configsQuery?.configs]
  )

  const onRemove = useCallback(async () => {
    setRemoving(true)
    onRowSelectionChange({})
    await Promise.all(selectedRowIds.map((selectedRowId) => removeDNSMutation.mutateAsync(selectedRowId)))
    setRemoving(false)
  }, [removeDNSMutation, selectedRowIds])

  return (
    <Flex h={height} direction="column" justify="space-between" className="max-w-full">
      <Table
        columns={[
          {
            id: 'id',
            header: 'id',
            accessorKey: 'id',
          },
          {
            header: 'name',
            accessorKey: 'name',
          },
          {
            header: 'selected',
            accessorKey: 'selected',
          },
          {
            header: 'global',
            accessorFn: ({ global }) => JSON.stringify(global),
          },
        ]}
        dataSource={configsQuery?.configs || []}
        enableRowSelection={(row) => {
          return row.getValue('id') !== defaultConfigID
        }}
        rowSelection={rowSelection}
        onRowSelectionChange={onRowSelectionChange}
      />

      <Group position="right">
        <Button color="red" uppercase loading={removing} onClick={onRemove}>
          Delete ({Object.keys(rowSelection).length})
        </Button>
      </Group>
    </Flex>
  )
}
