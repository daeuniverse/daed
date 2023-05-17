import { faker } from '@faker-js/faker'
import { Checkbox, ScrollArea, Table } from '@mantine/core'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo } from 'react'

export const TestPage = () => {
  const columns: ColumnDef<{ name: string }>[] = useMemo(
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
      {
        header: 'name',
        accessorKey: 'name',
      },
    ],
    []
  )

  const data = useMemo(
    () =>
      faker.helpers.multiple(
        () => ({
          name: faker.internet.userName(),
        }),
        {
          count: 1000,
        }
      ),
    []
  )

  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <ScrollArea.Autosize h="100%">
      <Table withBorder withColumnBorders striped highlightOnHover verticalSpacing="sm">
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
      </Table>
    </ScrollArea.Autosize>
  )
}
