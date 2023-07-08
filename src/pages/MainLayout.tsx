import { Anchor, AppShell, Center, Container, Footer, Text } from '@mantine/core'
import { useStore } from '@nanostores/react'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { HeaderWithActions } from '~/components/Header'
import { useInitialize } from '~/initialize'
import { endpointURLAtom, tokenAtom } from '~/store'

export const MainLayout = () => {
  const navigate = useNavigate()
  const token = useStore(tokenAtom)
  const endpointURL = useStore(endpointURLAtom)
  const initialize = useInitialize()

  useEffect(() => {
    initialize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!endpointURL || !token) {
      navigate('/setup')
    }
  }, [endpointURL, navigate, token])

  return (
    <AppShell
      header={<HeaderWithActions />}
      footer={
        <Footer height={50}>
          <Center h="100%">
            <Text fw="lighter" fz="xs" color="dimmed">
              Made with passion 🔥 by{' '}
              <Anchor href="https://github.com/daeuniverse" target="_blank">
                @daeuniverse
              </Anchor>
            </Text>
          </Center>
        </Footer>
      }
    >
      <Container size="lg" p="sm">
        <Outlet />
      </Container>
    </AppShell>
  )
}
