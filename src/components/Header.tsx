import {
  ActionIcon,
  Avatar,
  Center,
  Container,
  Group,
  Image,
  Menu,
  Switch,
  Tabs,
  Text,
  Title,
  UnstyledButton,
  createStyles,
  rem,
} from '@mantine/core'
import {
  IconChevronDown,
  IconLanguage,
  IconLogout,
  IconMap,
  IconRoute,
  IconSettings,
  IconSubtask,
  IconTable,
  IconTestPipe,
  IconUsersGroup,
} from '@tabler/icons-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useGeneralQuery, useRunMutation } from '~/apis'
import logoPng from '~/assets/logo.png'
import { i18n } from '~/i18n'
import { tokenAtom } from '~/store'

import { ColorSchemeToggle } from './ColorSchemeToggle'

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    boxShadow: theme.shadows.sm,
  },

  mainSection: {
    paddingBottom: theme.spacing.sm,
  },

  user: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    },
  },

  userActive: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },

  tabsList: {
    borderBottom: 0,
  },

  tab: {
    fontWeight: 500,
    height: rem(38),
    backgroundColor: 'transparent',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    },

    '&[data-active]': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2],
    },
  },
}))

export const Header = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { classes, theme, cx } = useStyles()
  const [userMenuOpened, setUserMenuOpened] = useState(false)
  const { data: generalQuery } = useGeneralQuery()
  const runMutation = useRunMutation()

  const links = [
    { link: '/config', label: t('config'), icon: <IconSettings /> },
    { link: '/node', label: t('node'), icon: <IconSubtask /> },
    { link: '/subscription', label: t('subscription'), icon: <IconTable /> },
    { link: '/dns', label: t('dns'), icon: <IconRoute /> },
    { link: '/routing', label: t('routing'), icon: <IconMap /> },
    { link: '/group', label: t('group'), icon: <IconUsersGroup /> },
    { link: '/experiment', label: 'Experiment', icon: <IconTestPipe /> },
  ]

  return (
    <header className={classes.header}>
      <Container className={classes.mainSection}>
        <Group position="apart">
          <Link to="/">
            <Group>
              <Image radius="sm" src={logoPng} width={32} height={32} />

              <Title order={2} color={theme.colorScheme === 'dark' ? theme.white : theme.black}>
                daed
              </Title>
            </Group>
          </Link>

          <Switch
            size="md"
            checked={generalQuery?.general.dae.running}
            onChange={(e) => {
              runMutation.mutateAsync(!e.target.checked)
            }}
          />

          <Group>
            <Menu
              width={260}
              position="bottom-end"
              transitionProps={{ transition: 'pop-top-right' }}
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
            >
              <Menu.Target>
                <UnstyledButton className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
                  <Group spacing={7}>
                    <Avatar
                      src="https://avatars.githubusercontent.com/u/126714249?s=200&v=4"
                      alt="avatar"
                      radius="xl"
                      size={20}
                    />

                    <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                      kunish
                    </Text>
                    <IconChevronDown size={rem(12)} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>{t('debug')}</Menu.Label>
                <Menu.Item component={Link} target="_blank" to="/graphiql">
                  GraphiQL
                </Menu.Item>

                <Menu.Label>{t('user')}</Menu.Label>
                <Menu.Item
                  icon={<IconLogout size="0.9rem" stroke={1.5} />}
                  onClick={() => {
                    tokenAtom.set('')
                  }}
                >
                  {t('actions.logout')}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            <ActionIcon
              onClick={() => {
                if (i18n.language.startsWith('zh')) {
                  i18n.changeLanguage('en')
                } else {
                  i18n.changeLanguage('zh-Hans')
                }
              }}
            >
              <IconLanguage />
            </ActionIcon>

            <ColorSchemeToggle />
          </Group>
        </Group>
      </Container>

      <Center>
        <Tabs
          variant="outline"
          value={location.pathname}
          onTabChange={(to) => navigate(`${to}`)}
          classNames={{
            tabsList: classes.tabsList,
            tab: classes.tab,
          }}
        >
          <Tabs.List>
            {links.map(({ link, icon, label }) => (
              <Tabs.Tab key={link} value={link} icon={icon}>
                {label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      </Center>
    </header>
  )
}
