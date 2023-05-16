import { Button, Container, PasswordInput, Stack, TextInput, Title } from '@mantine/core'
import { Form, useForm, zodResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconLink, IconPassword, IconUser } from '@tabler/icons-react'
import request from 'graphql-request'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import {
  getInterfacesRequest,
  getJsonStorageRequest,
  useCreateConfigMutation,
  useCreateDNSMutation,
  useCreateGroupMutation,
  useCreateRoutingMutation,
  useSelectConfigMutation,
  useSelectDNSMutation,
  useSelectRoutingMutation,
  useSetJsonStorageMutation,
} from '~/apis'
import { DEFAULT_CONFIG_WITH_INTERFACE, DEFAULT_DNS, DEFAULT_ENDPOINT_URL, DEFAULT_ROUTING, MODE } from '~/constants'
import { graphql } from '~/schemas/gql'
import { Policy } from '~/schemas/gql/graphql'
import { defaultResourcesAtom, endpointURLAtom, modeAtom, tokenAtom } from '~/store'

const schema = z.object({
  username: z.string().min(4).max(20),
  password: z.string().min(6).max(20),
  endpointURL: z.string().url(),
})

export const SetupPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const form = useForm<z.infer<typeof schema>>({
    validate: zodResolver(schema),
    initialValues: {
      endpointURL: DEFAULT_ENDPOINT_URL,
      username: '',
      password: '',
    },
  })

  const setJsonStorage = useSetJsonStorageMutation()
  const createConfigMutation = useCreateConfigMutation()
  const selectConfigMutation = useSelectConfigMutation()
  const createRoutingMutation = useCreateRoutingMutation()
  const selectRoutingMutation = useSelectRoutingMutation()
  const createDNSMutation = useCreateDNSMutation()
  const selectDNSMutation = useSelectDNSMutation()
  const createGroupMutation = useCreateGroupMutation()

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

      if (token) {
        const getJsonStorage = getJsonStorageRequest(endpointURL, token)
        const getInterfaces = getInterfacesRequest(endpointURL, token)
        const [modeResponse, defaultConfigID, defaultRoutingID, defaultDNSID, defaultGroupID] = (
          await getJsonStorage(['mode', 'defaultConfigID', 'defaultRoutingID', 'defaultDNSID', 'defaultGroupID'])
        ).jsonStorage

        if (modeResponse) {
          modeAtom.set(modeResponse as MODE)
        } else {
          await setJsonStorage.mutateAsync({
            mode: MODE.simple,
          })
          modeAtom.set(MODE.simple)
        }

        if ([defaultConfigID, defaultRoutingID, defaultDNSID, defaultGroupID].every(Boolean)) {
          defaultResourcesAtom.set({
            defaultConfigID,
            defaultRoutingID,
            defaultDNSID,
            defaultGroupID,
          })
        }

        const interfaceName =
          (await getInterfaces()).general.interfaces.find(({ name }) => name !== 'lo')?.name || 'lan'

        if (!defaultConfigID) {
          const {
            createConfig: { id },
          } = await createConfigMutation.mutateAsync({
            name: 'default',
            global: DEFAULT_CONFIG_WITH_INTERFACE(interfaceName),
          })

          await selectConfigMutation.mutateAsync({
            id,
          })

          await setJsonStorage.mutateAsync({
            defaultConfigID: id,
          })
          defaultResourcesAtom.setKey('defaultConfigID', id)
        }

        if (!defaultRoutingID) {
          const {
            createRouting: { id },
          } = await createRoutingMutation.mutateAsync({
            name: 'default',
            routing: DEFAULT_ROUTING,
          })

          await selectRoutingMutation.mutateAsync({
            id,
          })

          await setJsonStorage.mutateAsync({
            defaultRoutingID: id,
          })
          defaultResourcesAtom.setKey('defaultRoutingID', id)
        }

        if (!defaultDNSID) {
          const {
            createDns: { id },
          } = await createDNSMutation.mutateAsync({
            name: 'default',
            dns: DEFAULT_DNS,
          })

          await selectDNSMutation.mutateAsync({
            id,
          })

          await setJsonStorage.mutateAsync({
            defaultDNSID: id,
          })
          defaultResourcesAtom.setKey('defaultDNSID', id)
        }

        if (!defaultGroupID) {
          const {
            createGroup: { id },
          } = await createGroupMutation.mutateAsync({
            name: 'default',
            policy: Policy.Min,
            policyParams: [],
          })

          await setJsonStorage.mutateAsync({
            defaultGroupID: id,
          })
          defaultResourcesAtom.setKey('defaultGroupID', id)
        }

        endpointURLAtom.set(endpointURL)
        tokenAtom.set(token)

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
          <Button type="submit" uppercase>
            {t('actions.login')}
          </Button>
        </Stack>
      </Form>
    </Container>
  )
}
