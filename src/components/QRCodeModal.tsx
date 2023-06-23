import { Center, Modal } from '@mantine/core'
import { QRCodeCanvas } from 'qrcode.react'
import { forwardRef, useImperativeHandle, useState } from 'react'

type Props = {
  name: string
  link: string
}

export type QRCodeModalRef = {
  props: Props
  setProps: (props: Props) => void
}

export const QRCodeModal = forwardRef(({ opened, onClose }: { opened: boolean; onClose: () => void }, ref) => {
  const [props, setProps] = useState<Props>({
    name: '',
    link: '',
  })

  useImperativeHandle(ref, () => ({
    props,
    setProps,
  }))

  return (
    <Modal opened={opened} onClose={onClose} title={props.name}>
      <Center>
        <QRCodeCanvas size={320} value={props.link} />
      </Center>
    </Modal>
  )
})
