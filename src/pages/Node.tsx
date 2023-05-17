import { Button, Flex, Group } from '@mantine/core'
import { useCallback, useMemo, useState } from 'react'

import { useNodesQuery, useRemoveNodesMutation } from '~/apis'
import { Table } from '~/components/Table'
import { useMainContainerSize } from '~/contexts'

export const NodePage = () => {
  const { height } = useMainContainerSize()
  const { data: nodesQueryData } = useNodesQuery()
  const [rowSelection, onRowSelectionChange] = useState({})
  const removeNodesMutation = useRemoveNodesMutation()
  const [removing, setRemoving] = useState(false)
  const selectedRowIds: string[] = useMemo(
    () =>
      Object.keys(rowSelection)
        .map((selectedIndex) => {
          return nodesQueryData?.nodes.edges[Number(selectedIndex)].id
        })
        .filter((id) => !!id) as string[],
    [nodesQueryData?.nodes.edges, rowSelection]
  )
  const onRemove = useCallback(async () => {
    onRowSelectionChange({})
    setRemoving(true)
    await removeNodesMutation.mutateAsync(selectedRowIds)
    setRemoving(false)
  }, [removeNodesMutation, selectedRowIds])

  return (
    <Flex h={height} direction="column" justify="space-between">
      <Table
        columns={[
          {
            header: 'id',
            accessorKey: 'id',
          },
          {
            header: 'name',
            accessorKey: 'name',
          },
          {
            header: 'address',
            accessorKey: 'address',
          },
          {
            header: 'protocol',
            accessorKey: 'protocol',
          },
        ]}
        dataSource={nodesQueryData?.nodes.edges || []}
        enableRowSelection
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
