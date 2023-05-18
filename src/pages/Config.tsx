import { Prism } from '@mantine/prism'
import { useStore } from '@nanostores/react'
import { IconDeselect, IconSelect } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { useConfigsQuery, useRemoveConfigMutation } from '~/apis'
import { Table } from '~/components/Table'
import { defaultResourcesAtom } from '~/store'

export const ConfigPage = () => {
  const { t } = useTranslation()
  const { defaultConfigID } = useStore(defaultResourcesAtom)
  const { isLoading, data } = useConfigsQuery()
  const removeConfigMutation = useRemoveConfigMutation()

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
          render: (record) => (record.selected ? <IconSelect /> : <IconDeselect />),
        },
      ]}
      records={data?.configs || []}
      isRecordSelectable={(record) => record.id !== defaultConfigID}
      rowExpansion={{
        content: ({ record }) => <Prism language="json">{JSON.stringify(record.global, null, 2)}</Prism>,
      }}
      onRemove={async (records) => {
        await Promise.all(records.map(({ id }) => removeConfigMutation.mutateAsync(id)))
      }}
    />
  )
}
