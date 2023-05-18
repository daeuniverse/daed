import { useSubscriptionsQuery } from '~/apis'
import { Table } from '~/components/Table'

export const SubscriptionPage = () => {
  const { isLoading, data } = useSubscriptionsQuery()

  return (
    <Table
      fetching={isLoading}
      columns={[
        {
          title: 'id',
          accessor: 'id',
        },
        {
          title: 'link',
          accessor: 'link',
        },
        {
          title: 'status',
          accessor: 'status',
        },
      ]}
      records={data?.subscriptions || []}
    />
  )
}
