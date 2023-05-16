import { useNodesQuery } from '~/apis'
import { Table } from '~/components/Table'

export const NodePage = () => {
  const { data: nodesQueryData } = useNodesQuery()

  return (
    <Table
      columns={[
        {
          title: 'id',
          dataIndex: 'id',
        },
        {
          title: 'name',
          dataIndex: 'name',
        },
        {
          title: 'address',
          dataIndex: 'address',
        },
        {
          title: 'protocol',
          dataIndex: 'protocol',
        },
      ]}
      dataSource={nodesQueryData?.nodes.edges || []}
    />
  )
}
