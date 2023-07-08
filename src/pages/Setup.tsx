import {
  Anchor,
  Button,
  Center,
  Container,
  PasswordInput,
  Space,
  Stack,
  Stepper,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useStore } from '@nanostores/react'
import { IconLink, IconPassword, IconUser } from '@tabler/icons-react'
import request from 'graphql-request'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { z } from 'zod'

import { DEFAULT_ENDPOINT_URL } from '~/constants'
import { graphql } from '~/schemas/gql'
import { endpointURLAtom, tokenAtom } from '~/store'

const endpointURLSchema = z.object({
  endpointURL: z.string().url().nonempty(),
})

const signupSchema = z.object({
  username: z.string().min(4).max(20).nonempty(),
  password: z.string().min(6).max(20).nonempty(),
})

const loginSchema = z.object({
  username: z.string().min(4).max(20).nonempty(),
  password: z.string().min(6).max(20).nonempty(),
})

const getNumberUsers = async (endpointURL: string) => {
  const { numberUsers } = await request(
    endpointURL,
    graphql(`
      query NumberUsers {
        numberUsers
      }
    `),
  )

  return numberUsers
}

export const SetupPage = () => {
  const { t } = useTranslation()

  const [active, setActive] = useState(0)
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current))
  const [numberUsers, setNumberUsers] = useState(0)

  const defaultEndpointURL = useStore(endpointURLAtom)

  const endpointURLForm = useForm<z.infer<typeof endpointURLSchema>>({
    validate: zodResolver(endpointURLSchema),
    initialValues: { endpointURL: defaultEndpointURL },
  })

  const handleEndpointURLSubmit = async (values: z.infer<typeof endpointURLSchema>) => {
    endpointURLAtom.set(values.endpointURL)

    try {
      const numberUsers = await getNumberUsers(values.endpointURL)

      setNumberUsers(numberUsers)

      nextStep()
    } catch (err) {
      notifications.show({
        color: 'red',
        message: (err as Error).message,
      })
    }
  }

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    validate: zodResolver(signupSchema),
    initialValues: {
      username: '',
      password: '',
    },
  })

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    validate: zodResolver(loginSchema),
    initialValues: {
      username: '',
      password: '',
    },
  })

  const handleSignupSubmit = async (values: z.infer<typeof signupSchema>) => {
    const endpointURL = endpointURLForm.values.endpointURL
    const { username, password } = values

    try {
      await request(
        endpointURL,
        graphql(`
          mutation CreateUser($username: String!, $password: String!) {
            createUser(username: $username, password: $password)
          }
        `),
        {
          username,
          password,
        },
      )

      const numberUsers = await getNumberUsers(endpointURLForm.values.endpointURL)

      setNumberUsers(numberUsers)
    } catch (err) {
      notifications.show({
        color: 'red',
        message: (err as Error).message,
      })
    }
  }

  const handleLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    const endpointURL = endpointURLForm.values.endpointURL
    const { username, password } = values

    try {
      const { token } = await request(
        endpointURL,
        graphql(`
          query Token($username: String!, $password: String!) {
            token(username: $username, password: $password)
          }
        `),
        {
          username,
          password,
        },
      )

      notifications.show({
        message: t('notifications.login succeeded'),
      })

      tokenAtom.set(token)

      nextStep()
    } catch (err) {
      notifications.show({
        color: 'red',
        message: (err as Error).message,
      })
    }
  }

  return (
    <Container h="100%">
      <Stack pt="20vh">
        <Title ta="center">{t('welcome to', { name: 'daed' })} </Title>
        <Text ta="center">
          {t('what for')}{' '}
          <Anchor target="_blank" href="https://github.com/daeuniverse/dae">
            dae
          </Anchor>
        </Text>

        <Space h={20} />

        <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false}>
          <Stepper.Step label={`${t('step')} 1`} description={t('setup endpoint')}>
            <form onSubmit={endpointURLForm.onSubmit(handleEndpointURLSubmit)}>
              <Stack maw={480} mx="auto">
                <TextInput
                  icon={<IconLink />}
                  label={t('endpointURL')}
                  placeholder={DEFAULT_ENDPOINT_URL}
                  withAsterisk
                  {...endpointURLForm.getInputProps('endpointURL')}
                />

                <Button type="submit">{t('actions.continue')}</Button>
              </Stack>
            </form>
          </Stepper.Step>

          <Stepper.Step label={`${t('step')} 2`} description={t('login account')}>
            {numberUsers === 0 ? (
              <form onSubmit={signupForm.onSubmit(handleSignupSubmit)}>
                <Stack maw={480} mx="auto">
                  <TextInput
                    icon={<IconUser />}
                    label={t('username')}
                    placeholder="admin"
                    withAsterisk
                    {...signupForm.getInputProps('username')}
                  />
                  <PasswordInput
                    icon={<IconPassword />}
                    label={t('password')}
                    placeholder="password"
                    withAsterisk
                    {...signupForm.getInputProps('password')}
                  />
                  <Button type="submit">{t('actions.create account')}</Button>
                </Stack>
              </form>
            ) : (
              <form onSubmit={loginForm.onSubmit(handleLoginSubmit)}>
                <Stack maw={480} mx="auto">
                  <TextInput
                    icon={<IconUser />}
                    label={t('username')}
                    placeholder="admin"
                    withAsterisk
                    {...loginForm.getInputProps('username')}
                  />
                  <PasswordInput
                    icon={<IconPassword />}
                    label={t('password')}
                    placeholder="password"
                    withAsterisk
                    {...loginForm.getInputProps('password')}
                  />
                  <Button type="submit">{t('actions.login')}</Button>
                </Stack>
              </form>
            )}
          </Stepper.Step>

          <Stepper.Completed>
            <Space h={20} />

            <Center>
              <Button component={Link} to="/">
                <Title order={3}>{t('actions.start your journey')}</Title>
              </Button>
            </Center>
          </Stepper.Completed>
        </Stepper>
      </Stack>
    </Container>
  )
}
