import { Stack } from '@mui/material'
import { forwardRef, Fragment, useImperativeHandle, useState } from 'react'
import { v4 as uuid } from 'uuid'

export type GrowableInputListHandle = {
  reset: () => void
}

export const GrowableInputList = forwardRef<
  GrowableInputListHandle,
  { children: (i: number, props: { inc: () => void; dec: () => void; reset: () => void }) => React.ReactNode }
>(({ children }, ref) => {
  const [inputList, setInputList] = useState<string[]>([uuid()])
  const reset = () => setInputList([uuid()])

  useImperativeHandle(ref, () => ({
    reset,
  }))

  return (
    <Fragment>
      {inputList.map((id, i) => (
        <Stack key={id} direction="row" alignItems="center" spacing={1}>
          {children(i, {
            inc: () =>
              setInputList((list) => {
                const updated = list.slice(0)
                updated.splice(i + 1, 0, uuid())

                return updated
              }),
            dec: () => inputList.length >= 2 && setInputList((list) => list.filter((_, n) => i !== n)),
            reset,
          })}
        </Stack>
      ))}
    </Fragment>
  )
})
