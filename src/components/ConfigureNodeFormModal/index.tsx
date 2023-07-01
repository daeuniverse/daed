import { Divider, MantineProvider, Modal, Stack, Tabs, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useImportNodesMutation } from '~/apis'

import { HTTPForm } from './HTTPForm'
import { SSForm } from './SSForm'
import { SSRForm } from './SSRForm'
import { Socks5Form } from './Socks5Form'
import { TrojanForm } from './TrojanForm'
import { V2rayForm } from './V2rayForm'

const schema = z.object({
  tag: z.string().nonempty(),
})

export const ConfigureNodeFormModal = ({ opened, onClose }: { opened: boolean; onClose: () => void }) => {
  const { t } = useTranslation()
  const importNodesMutation = useImportNodesMutation()
  const form = useForm<z.infer<typeof schema>>({
    initialValues: { tag: '' },
    validate: zodResolver(schema),
  })

  const onLinkGeneration = async (link: string) => {
    const { hasErrors } = form.validate()

    if (hasErrors) return

    await importNodesMutation.mutateAsync([
      {
        link,
        tag: form.values.tag,
      },
    ])

    onClose()
  }

  return (
    <Modal opened={opened} onClose={onClose} title={t('configureNode.title')} size="md">
      <TextInput label={t('tag')} withAsterisk {...form.getInputProps('tag')} />

      <Divider />

      <MantineProvider
        theme={{
          components: { TabsPanel: { defaultProps: { pt: 'md' } }, Stack: { defaultProps: { spacing: 'sm' } } },
        }}
        inherit
      >
        <Tabs defaultValue="v2ray" pt="xs">
          <Tabs.List position="center">
            <Tabs.Tab value="v2ray">V2RAY</Tabs.Tab>
            <Tabs.Tab value="ss">SS</Tabs.Tab>
            <Tabs.Tab value="ssr">SSR</Tabs.Tab>
            <Tabs.Tab value="trojan">Trojan</Tabs.Tab>
            <Tabs.Tab value="http">HTTP</Tabs.Tab>
            <Tabs.Tab value="socks5">SOCKS5</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="v2ray">
            <Stack>
              <V2rayForm onLinkGeneration={onLinkGeneration} />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="ss">
            <Stack>
              <SSForm onLinkGeneration={onLinkGeneration} />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="ssr">
            <Stack>
              <SSRForm onLinkGeneration={onLinkGeneration} />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="trojan">
            <Stack>
              <TrojanForm onLinkGeneration={onLinkGeneration} />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="http">
            <Stack>
              <HTTPForm onLinkGeneration={onLinkGeneration} />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="socks5">
            <Stack>
              <Socks5Form onLinkGeneration={onLinkGeneration} />
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </MantineProvider>
    </Modal>
  )
}
