import { Checkbox, Table as TableImpl, TableProps } from '@mantine/core'
import {
  ColumnDef,
  OnChangeFn,
  Row,
  RowData,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo } from 'react'

export const Table = <Data extends RowData>({
  rowSelection = {},
  onRowSelectionChange,
  enableRowSelection = true,
  enableMultiRowSelection = true,
  columns,
  dataSource,
  ...props
}: {
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  enableRowSelection?: boolean | ((row: Row<Data>) => boolean)
  enableMultiRowSelection?: boolean
  columns: Array<ColumnDef<Data>>
  dataSource: Array<Data>
} & TableProps) => {
  const tableColumns: Array<ColumnDef<Data>> = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            transitionDuration={0}
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            disabled={!table.options.enableMultiRowSelection}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            transitionDuration={0}
            checked={row.getIsSelected()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
            disabled={!row.getCanSelect()}
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
    enableRowSelection,
    enableMultiRowSelection,
    state: { rowSelection },
    onRowSelectionChange,
  })

  return (
    <TableImpl
      withBorder
      withColumnBorders
      striped
      highlightOnHover
      verticalSpacing="sm"
      {...props}
      className="w-full overflow-auto"
    >
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
  )
}
