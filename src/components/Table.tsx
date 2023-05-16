import { Checkbox, ScrollArea, Table as TableImpl, TableProps } from '@mantine/core'
import { useState } from 'react'

export const Table = <
  DataSource extends Array<
    Record<PropertyKey, string | number | boolean | null | undefined> & {
      id: string
    }
  >,
  Columns extends Array<{
    title: string
    dataIndex: keyof DataSource[number]
  }>
>({
  dataSource,
  columns,
  ...props
}: {
  dataSource: DataSource
  columns: Columns
} & TableProps) => {
  const [selection, setSelection] = useState<Array<DataSource[number]['id']>>([])
  const toggleRow = (id: string) => {
    setSelection((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }
  const toggleAll = () => {
    setSelection((current) => (current.length === dataSource.length ? [] : dataSource.map((item) => item.id)))
  }

  return (
    <ScrollArea>
      <TableImpl verticalSpacing="sm" withBorder withColumnBorders striped highlightOnHover {...props}>
        <thead>
          <tr>
            <th>
              <Checkbox
                onChange={toggleAll}
                checked={dataSource.length > 0 && selection.length === dataSource.length}
                indeterminate={selection.length > 0 && selection.length !== dataSource.length}
                transitionDuration={0}
              />
            </th>
            {columns.map(({ title }, i) => (
              <th key={i} className="uppercase">
                {title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {dataSource.map((data) => (
            <tr key={data.id}>
              <td>
                <Checkbox
                  checked={selection.includes(data.id)}
                  onChange={() => toggleRow(data.id)}
                  transitionDuration={0}
                />
              </td>

              {columns
                .map(({ dataIndex }) => data[dataIndex])
                .map((val, i) => (
                  <td key={i}>{val}</td>
                ))}
            </tr>
          ))}
        </tbody>
      </TableImpl>
    </ScrollArea>
  )
}
