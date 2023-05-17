import { useDNSsQuery } from '~/apis'
import { Table } from '~/components/Table'

export const DNSPage = () => {
  const { data: dnssQuery } = useDNSsQuery()

  return (
    <Table
      columns={[
        {
          header: 'id',
          accessorKey: 'id',
        },
        {
          header: 'link',
          accessorKey: 'link',
        },
        {
          header: 'status',
          accessorKey: 'dns',
        },
      ]}
      dataSource={dnssQuery?.dnss || []}
    />
  )
}
