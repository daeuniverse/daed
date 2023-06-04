import { Button, Container, PasswordInput, Stack, TextInput, Title } from '@mantine/core'
import { Form, useForm, zodResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useStore } from '@nanostores/react'
import { IconLink, IconPassword, IconUser } from '@tabler/icons-react'
import request from 'graphql-request'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { getJsonStorageRequest, useSetJsonStorageMutation } from '~/apis'
import { DEFAULT_ENDPOINT_URL, MODE } from '~/constants'
import { graphql } from '~/schemas/gql'
import { endpointURLAtom, modeAtom, tokenAtom } from '~/store'

const schema = z.object({
  username: z.string().min(4).max(20),
  password: z.string().min(6).max(20),
  endpointURL: z.string().url(),
})

export const SetupPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const defaultEndpointURL = useStore(endpointURLAtom)
  const form = useForm<z.infer<typeof schema>>({
    validate: zodResolver(schema),
    initialValues: {
      endpointURL: defaultEndpointURL,
      username: '',
      password: '',
    },
  })

  const setJsonStorage = useSetJsonStorageMutation()

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const { username, password, endpointURL } = values

    let token: string | undefined

    try {
      const { numberUsers } = await request(
        endpointURL,
        graphql(`
          query NumberUsers {
            numberUsers
          }
        `)
      )

      if (numberUsers === 0) {
        const { createUser: createUserToken } = await request(
          endpointURL,
          graphql(`
            mutation CreateUser($username: String!, $password: String!) {
              createUser(username: $username, password: $password)
            }
          `),
          {
            username,
            password,
          }
        )

        token = createUserToken
      } else {
        const { token: loginToken } = await request(
          endpointURL,
          graphql(`
            query Token($username: String!, $password: String!) {
              token(username: $username, password: $password)
            }
          `),
          {
            username,
            password,
          }
        )

        token = loginToken
      }

      endpointURLAtom.set(endpointURL)
      tokenAtom.set(token)

      if (token) {
        const getJsonStorage = getJsonStorageRequest(endpointURL, token)
        const [modeResponse] = (await getJsonStorage(['mode'])).jsonStorage

        if (modeResponse) {
          modeAtom.set(modeResponse as MODE)
        } else {
          await setJsonStorage.mutateAsync({
            mode: MODE.simple,
          })
          modeAtom.set(MODE.simple)
        }

        notifications.show({
          variant: 'success',
          message: t('notifications.login succeeded'),
        })

        navigate('/')
      }
    } catch (err) {
      notifications.show({
        variant: 'error',
        message: (err as Error).message,
      })
    }
  }

  return (
    <Container h="100%">
      <Form
        className="flex h-full flex-col items-center justify-center gap-10 md:flex-row md:gap-2"
        form={form}
        onSubmit={onSubmit}
      >
        <Title mx="auto">{t('welcome back')}</Title>

        <Stack maw={480} w="100%">
          <TextInput
            icon={<IconLink />}
            label={t('endpointURL')}
            placeholder={DEFAULT_ENDPOINT_URL}
            withAsterisk
            {...form.getInputProps('endpointURL')}
          />
          <TextInput
            icon={<IconUser />}
            label={t('username')}
            placeholder="admin"
            withAsterisk
            {...form.getInputProps('username')}
          />
          <PasswordInput
            icon={<IconPassword />}
            label={t('password')}
            placeholder="password"
            withAsterisk
            {...form.getInputProps('password')}
          />
          <Button type="submit">{t('actions.login')}</Button>
        </Stack>
      </Form>
    </Container>
  )
}
