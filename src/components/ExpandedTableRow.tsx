import { Fragment } from 'react'

import { Separator } from '~/components/ui/separator'

export function ExpandedTableRow({ data }: { data: { name: string; value: string }[] }) {
  return (
    <div className="flex flex-col gap-3 p-4">
      {data.map(({ name, value }, i) => {
        return (
          <Fragment key={i}>
            <div className="flex items-center gap-3">
              <span className="uppercase text-sm font-medium">{name}: </span>
              <span className="text-primary bg-gradient-to-r from-primary to-purple-500 bg-clip-text">{value}</span>
            </div>

            {i !== data.length - 1 && <Separator />}
          </Fragment>
        )
      })}
    </div>
  )
}
