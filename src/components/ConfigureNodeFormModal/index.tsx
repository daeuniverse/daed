import { MantineProvider, Modal, Stack, Tabs, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useImportNodesMutation } from '~/apis'

import { HTTPForm } from './HTTPForm'
import { Hysteria2Form } from './Hysteria2Form'
import { JuicityForm } from './JuicityForm'
import { SSForm } from './SSForm'
import { SSRForm } from './SSRForm'
import { Socks5Form } from './Socks5Form'
import { TrojanForm } from './TrojanForm'
import { TuicForm } from './TuicForm'
import { V2rayForm } from './V2rayForm'

const schema = z.object({ tag: z.string().nonempty() })

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
    <Modal opened={opened} onClose={onClose} title={t('configureNode.title')} size="auto">
      <TextInput size="xs" label={t('tag')} withAsterisk {...form.getInputProps('tag')} />

      <MantineProvider
        theme={{
          components: {
            Tabs: { defaultProps: { variant: 'outline' } },
            TabsPanel: { defaultProps: { pt: 'xs' } },
            TextInput: { defaultProps: { size: 'xs' } },
            Select: { defaultProps: { size: 'xs' } },
            NumberInput: { defaultProps: { size: 'xs' } },
            Checkbox: { defaultProps: { size: 'xs' } },
            Stack: { defaultProps: { spacing: 'xs' } },
          },
        }}
        inherit
      >
        <Tabs defaultValue="v2ray" pt="xs">
          <Tabs.List position="center">
            <Tabs.Tab value="v2ray">V2RAY</Tabs.Tab>
            <Tabs.Tab value="ss">SS</Tabs.Tab>
            <Tabs.Tab value="ssr">SSR</Tabs.Tab>
            <Tabs.Tab value="trojan">Trojan</Tabs.Tab>
            <Tabs.Tab value="juicity">Juicity</Tabs.Tab>
            <Tabs.Tab value="hysteria2">Hysteria2</Tabs.Tab>
            <Tabs.Tab value="tuic">Tuic</Tabs.Tab>
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

          <Tabs.Panel value="juicity">
            <Stack>
              <JuicityForm onLinkGeneration={onLinkGeneration} />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="hysteria2">
            <Stack>
              <Hysteria2Form onLinkGeneration={onLinkGeneration} />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="tuic">
            <Stack>
              <TuicForm onLinkGeneration={onLinkGeneration} />
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
