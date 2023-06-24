import { Box, Flex, Input, Modal, Stack, TextInput } from '@mantine/core'
import { UseFormReturnType, useForm, zodResolver } from '@mantine/form'
import { Editor } from '@monaco-editor/react'
import { useStore } from '@nanostores/react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { EDITOR_OPTIONS, EDITOR_THEME_DARK, EDITOR_THEME_LIGHT } from '~/constants'
import { colorSchemeAtom } from '~/store'

import { FormActions } from './FormActions'

const schema = z.object({
  name: z.string().nonempty(),
  text: z.string().nonempty(),
})

export type PlainTextgFormModalRef = {
  form: UseFormReturnType<z.infer<typeof schema>>
  editingID: string
  setEditingID: (id: string) => void
  initOrigins: (origins: z.infer<typeof schema>) => void
}

export const PlainTextFormModal = forwardRef(
  (
    {
      title,
      opened,
      onClose,
      handleSubmit,
    }: {
      title: string
      opened: boolean
      onClose: () => void
      handleSubmit: (values: z.infer<typeof schema>) => Promise<void>
    },
    ref
  ) => {
    const { t } = useTranslation()
    const colorScheme = useStore(colorSchemeAtom)
    const [editingID, setEditingID] = useState()
    const [origins, setOrigins] = useState<z.infer<typeof schema>>()
    const form = useForm<z.infer<typeof schema>>({
      validate: zodResolver(schema),
      initialValues: {
        name: '',
        text: '',
      },
    })

    const initOrigins = (origins: z.infer<typeof schema>) => {
      form.setValues(origins)
      setOrigins(origins)
    }

    useImperativeHandle(ref, () => ({
      form,
      editingID,
      setEditingID,
      initOrigins,
    }))

    return (
      <Modal.Root opened={opened} onClose={onClose} fullScreen>
        <Modal.Overlay />

        <Modal.Content>
          <Flex h="100%" direction="column">
            <Modal.Header>
              <Modal.Title>{title}</Modal.Title>
              <Modal.CloseButton />
            </Modal.Header>

            <Modal.Body sx={{ flex: 1 }}>
              <form
                onSubmit={form.onSubmit((values) =>
                  handleSubmit(values).then(() => {
                    onClose()
                    form.reset()
                  })
                )}
              >
                <Stack h="100%" pb={100} sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  <TextInput label={t('name')} withAsterisk {...form.getInputProps('name')} disabled={!!editingID} />

                  <Stack sx={{ flex: 1 }} spacing={4}>
                    <Box h="100%" sx={{ overflow: 'hidden', borderRadius: 4 }}>
                      <Editor
                        height="100%"
                        theme={colorScheme === 'dark' ? EDITOR_THEME_DARK : EDITOR_THEME_LIGHT}
                        options={EDITOR_OPTIONS}
                        language="routingA"
                        value={form.values.text}
                        onChange={(value) => form.setFieldValue('text', value || '')}
                      />
                    </Box>

                    {form.errors['text'] && <Input.Error>{form.errors['text']}</Input.Error>}
                  </Stack>

                  <Box sx={{ position: 'absolute', insetInline: 0, bottom: 50 }}>
                    <FormActions
                      reset={() => {
                        if (editingID && origins) {
                          form.setValues(origins)
                        } else {
                          form.reset()
                        }
                      }}
                    />
                  </Box>
                </Stack>
              </form>
            </Modal.Body>
          </Flex>
        </Modal.Content>
      </Modal.Root>
    )
  }
)
