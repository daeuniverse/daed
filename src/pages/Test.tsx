import { faker } from '@faker-js/faker'
import { Button, Flex, Group } from '@mantine/core'
import { useState } from 'react'

import { Table } from '~/components/Table'
import { useMainContainerSize } from '~/contexts'

export const TestPage = () => {
  const { height } = useMainContainerSize()

  const [data, setData] = useState(
    faker.helpers.multiple(
      () => ({
        name: faker.internet.userName(),
      }),
      {
        count: 100,
      }
    )
  )

  const [rowSelection, setRowSelection] = useState({})

  return (
    <Flex h={height} direction="column" justify="space-between">
      <Table
        columns={[
          {
            header: 'name',
            accessorKey: 'name',
          },
        ]}
        dataSource={data}
        enableRowSelection
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />

      <Group position="right">
        <Button
          color="red"
          uppercase
          onClick={() => {
            setRowSelection({})
            setData((data) => data.filter((_, index) => !Object.keys(rowSelection).includes(String(index))))
          }}
        >
          Delete ({Object.keys(rowSelection).length})
        </Button>
      </Group>
    </Flex>
  )
}
