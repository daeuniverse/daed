import { useNodesQuery } from '~/apis'
import { Table } from '~/components/Table'

export const NodePage = () => {
  const { data: nodesQueryData } = useNodesQuery()

  return (
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
    />
  )
}
