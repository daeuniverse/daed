import { Prism } from '@mantine/prism'
import { useStore } from '@nanostores/react'
import { IconCheck, IconX } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { useRemoveRoutingMutation, useRoutingsQuery } from '~/apis'
import { Table } from '~/components/Table'
import { defaultResourcesAtom } from '~/store'

export const RoutingPage = () => {
  const { t } = useTranslation()
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
          title: t('name'),
          accessor: 'name',
        },
        {
          title: t('selected'),
          accessor: 'selected',
          render: (record) => (record.selected ? <IconCheck /> : <IconX />),
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
