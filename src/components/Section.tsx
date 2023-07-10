import { ActionIcon, Group, Stack, Title, createStyles } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'

const useStyles = createStyles((theme) => ({
  section: {
    border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2]}`,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.xs,
    boxShadow: theme.shadows.md,
    transition: 'background 300ms ease-in-out',
  },
}))

export const Section = ({
  title,
  icon,
  bordered,
  iconPlus,
  onCreate,
  actions,
  highlight,
  children,
}: {
  title: string
  icon?: React.ReactNode
  bordered?: boolean
  iconPlus?: React.ReactNode
  onCreate: () => void
  actions?: React.ReactNode
  highlight?: boolean
  children: React.ReactNode
}) => {
  const { classes, theme, cx } = useStyles()

  return (
    <Stack
      className={cx({ [classes.section]: bordered })}
      bg={highlight ? theme.fn.lighten(theme.fn.primaryColor(), 0.5) : undefined}
    >
      <Group position="apart">
        <Group spacing="xs">
          {icon}

          <Title order={4} color={theme.primaryColor}>
            {title}
          </Title>
        </Group>

        <Group>
          {actions}

          <ActionIcon onClick={onCreate}>{iconPlus || <IconPlus />}</ActionIcon>
        </Group>
      </Group>

      <Stack>{children}</Stack>
    </Stack>
  )
}
