import { Divider, Group, Stack, Text } from '@mantine/core'
import { Fragment } from 'react'

export const ExpandedTableRow = ({ data }: { data: { name: string; value: string }[] }) => (
  <Stack spacing="md" p="md">
    {data.map(({ name, value }, i) => {
      return (
        <Fragment key={i}>
          <Group spacing="md">
            <Text tt="uppercase">{name}: </Text>
            <Text variant="gradient">{value}</Text>
          </Group>

          {i !== data.length - 1 && <Divider />}
        </Fragment>
      )
    })}
  </Stack>
)
