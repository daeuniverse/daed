import { useStore } from '@nanostores/react'

import { useGroupsQuery, useRemoveGroupMutation } from '~/apis'
import { Table } from '~/components/Table'
import { defaultResourcesAtom } from '~/store'

export const GroupPage = () => {
  const { defaultGroupID } = useStore(defaultResourcesAtom)
  const { isLoading, data } = useGroupsQuery()
  const removeGroupMutation = useRemoveGroupMutation()

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
      ]}
      records={data?.groups || []}
      isRecordSelectable={(record) => record.id !== defaultGroupID}
      onRemove={async (records) => {
        await Promise.all(records.map(({ id }) => removeGroupMutation.mutateAsync(id)))
      }}
    />
  )
}
