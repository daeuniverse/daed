import { useSubscriptionsQuery } from '~/apis'
import { Table } from '~/components/Table'

export const SubscriptionPage = () => {
  const { data: subscriptionsQueryData } = useSubscriptionsQuery()

  return (
    <Table
      columns={[
        {
          title: 'id',
          dataIndex: 'id',
        },
        {
          title: 'link',
          dataIndex: 'link',
        },
        {
          title: 'status',
          dataIndex: 'status',
        },
      ]}
      dataSource={subscriptionsQueryData?.subscriptions || []}
    />
  )
}
