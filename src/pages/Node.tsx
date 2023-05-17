import { Button, Flex, Group } from '@mantine/core'
import { useState } from 'react'

import { useNodesQuery } from '~/apis'
import { Table } from '~/components/Table'
import { useMainContainerSize } from '~/contexts'

export const NodePage = () => {
  const { data: nodesQueryData } = useNodesQuery()
  const [rowSelection, onRowSelectionChange] = useState({})
  const { height } = useMainContainerSize()

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
        <Button uppercase>Submit ({Object.keys(rowSelection).length})</Button>

        <Button color="red" uppercase>
          Delete ({Object.keys(rowSelection).length})
        </Button>
      </Group>
    </Flex>
  )
}
