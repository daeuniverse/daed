import { Checkbox, ScrollArea, Table as TableImpl, TableProps } from '@mantine/core'
import { ColumnDef, RowData, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo } from 'react'

export const Table = <Row extends RowData>({
  columns,
  dataSource,
  ...props
}: {
  columns: Array<ColumnDef<Row>>
  dataSource: Array<Row>
} & TableProps) => {
  const tableColumns: Array<ColumnDef<Row>> = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            transitionDuration={0}
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            transitionDuration={0}
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      ...columns,
    ],
    [columns]
  )

  const { getHeaderGroups, getRowModel } = useReactTable({
    columns: tableColumns,
    data: dataSource,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <ScrollArea.Autosize h="100%">
      <TableImpl withBorder withColumnBorders striped highlightOnHover verticalSpacing="sm" {...props}>
        <thead>
          {getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="uppercase">
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </TableImpl>
    </ScrollArea.Autosize>
  )
}
