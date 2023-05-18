import { Prism } from '@mantine/prism'
import { useStore } from '@nanostores/react'

import { useDNSsQuery, useRemoveDNSMutation } from '~/apis'
import { Table } from '~/components/Table'
import { defaultResourcesAtom } from '~/store'

export const DNSPage = () => {
  const { defaultDNSID } = useStore(defaultResourcesAtom)
  const { isLoading, data } = useDNSsQuery()
  const removeDNSMutation = useRemoveDNSMutation()

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
      records={data?.dnss || []}
      isRecordSelectable={(record) => record.id !== defaultDNSID}
      rowExpansion={{
        content: ({ record }) => <Prism language="bash">{record.dns.string}</Prism>,
      }}
      onRemove={async (records) => {
        await Promise.all(records.map(({ id }) => removeDNSMutation.mutateAsync(id)))
      }}
    />
  )
}
