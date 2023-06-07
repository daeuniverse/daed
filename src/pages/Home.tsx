import { Anchor, Card, Container, Group, Image, Stack, Text, Title } from '@mantine/core'

import logo from '~/assets/logo.svg'

export const HomePage = () => {
  return (
    <Container>
      <Stack>
        <Card shadow="sm" withBorder>
          <Group>
            <Image width={120} radius="md" src={logo} />

            <Stack>
              <Title>daed</Title>
              <Text>daed, A Modern Dashboard For dae</Text>
              <Anchor fw={600} href="https://github.com/daeuniverse/daed" target="_blank">
                https://github.com/daeuniverse/daed
              </Anchor>
            </Stack>
          </Group>
        </Card>
      </Stack>
    </Container>
  )
}
