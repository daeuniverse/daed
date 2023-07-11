import { ActionIcon, Badge, CopyButton, Flex, Group, Modal } from '@mantine/core'
import { IconCheck, IconCopy } from '@tabler/icons-react'
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
    <Modal opened={opened} onClose={onClose} title={props.name} keepMounted={false}>
      <Flex mx="auto" py="md" direction="column" align="center" justify="center" gap="md">
        <QRCodeCanvas size={240} value={props.link} />

        <Group position="apart" spacing="xs">
          <Badge
            sx={{
              width: 240,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            size="lg"
          >
            {props.link}
          </Badge>

          <CopyButton value={props.link}>
            {({ copied, copy }) => <ActionIcon onClick={copy}>{copied ? <IconCheck /> : <IconCopy />}</ActionIcon>}
          </CopyButton>
        </Group>
      </Flex>
    </Modal>
  )
})
