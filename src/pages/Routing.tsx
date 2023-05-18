import { Prism } from '@mantine/prism'
import { useStore } from '@nanostores/react'
import { IconDeselect, IconSelect } from '@tabler/icons-react'

import { useRemoveRoutingMutation, useRoutingsQuery } from '~/apis'
import { Table } from '~/components/Table'
import { defaultResourcesAtom } from '~/store'

export const RoutingPage = () => {
  const { defaultRoutingID } = useStore(defaultResourcesAtom)
  const { isLoading, data } = useRoutingsQuery()
  const removeRoutingMutation = useRemoveRoutingMutation()

  return (
    <Table
      fetching={isLoading}
      columns={[
        {
          title: 'id',
          accessor: 'id',
        },
        {
          title: 'name',
          accessor: 'name',
        },
        {
          title: 'selected',
          accessor: 'selected',
          render: (record) => (record.selected ? <IconSelect /> : <IconDeselect />),
        },
      ]}
      records={data?.routings || []}
      isRecordSelectable={(record) => record.id !== defaultRoutingID}
      rowExpansion={{
        content: ({ record }) => <Prism language="bash">{record.routing.string}</Prism>,
      }}
      onRemove={async (records) => {
        await Promise.all(records.map(({ id }) => removeRoutingMutation.mutateAsync(id)))
      }}
    />
  )
}
