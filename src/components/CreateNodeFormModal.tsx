import { Modal, Stack, Tabs } from '@mantine/core'

import { FormActions } from './FormActions'

export const CreateNodeFormModal = ({ opened, onClose }: { opened: boolean; onClose: () => void }) => {
  return (
    <Modal title="node" opened={opened} onClose={onClose}>
      <Stack>
        <Tabs defaultValue="v2ray" variant="outline">
          <Tabs.List>
            <Tabs.Tab value="v2ray">V2RAY</Tabs.Tab>
            <Tabs.Tab value="ss">SS</Tabs.Tab>
            <Tabs.Tab value="ssr">SSR</Tabs.Tab>
            <Tabs.Tab value="trojan">Trojan</Tabs.Tab>
            <Tabs.Tab value="http">HTTP</Tabs.Tab>
            <Tabs.Tab value="socks5">SOCKS5</Tabs.Tab>
          </Tabs.List>
        </Tabs>

        <FormActions />
      </Stack>
    </Modal>
  )
}
