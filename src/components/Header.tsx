import {
  ActionIcon,
  Avatar,
  Center,
  Container,
  FileButton,
  Group,
  Image,
  Menu,
  Modal,
  Stack,
  Switch,
  Tabs,
  Text,
  Title,
  UnstyledButton,
  createStyles,
  rem,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
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
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useGeneralQuery, useRunMutation, useUpdateAvatarMutation, useUserQuery } from '~/apis'
import logoPng from '~/assets/logo.png'
import { i18n } from '~/i18n'
import { tokenAtom } from '~/store'

import { ColorSchemeToggle } from './ColorSchemeToggle'
import { FormActions } from './FormActions'

class Defer<T> {
  promise: Promise<T>
  resolve?: (value: T | PromiseLike<T>) => void
  reject?: (reason?: unknown) => void

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}

const fileToBase64 = (file: File) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)

  const defer = new Defer<string>()

  reader.onload = () => {
    if (defer.resolve) {
      defer.resolve(reader.result as string)
    }
  }

  reader.onerror = (err) => {
    if (defer.reject) {
      defer.reject(err)
    }
  }

  return defer.promise
}

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
  const [openedAccountSettingsFormModal, { open: openAccountSettingsFormModal, close: closeAccountSettingsFormModal }] =
    useDisclosure(false)
  const { data: userQuery } = useUserQuery()
  const { data: generalQuery } = useGeneralQuery()
  const runMutation = useRunMutation()
  const updateAvatarMutation = useUpdateAvatarMutation()
  const [uploadingAvatarBase64, setUploadingAvatarBase64] = useState<string | null>(null)
  const resetUploadingAvatarRef = useRef<() => void>(null)

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
                      src={userQuery?.user.avatar || 'https://avatars.githubusercontent.com/u/126714249?s=200&v=4'}
                      alt="avatar"
                      radius="xl"
                      size={20}
                    />

                    <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                      {userQuery?.user.username || 'unknown'}
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

                <Menu.Label>{t('settings')}</Menu.Label>
                <Menu.Item
                  icon={<IconSettings size="0.9rem" stroke={1.5} />}
                  onClick={() => {
                    openAccountSettingsFormModal()
                  }}
                >
                  {t('account settings')}
                </Menu.Item>

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

      <Modal
        title={t('account settings')}
        opened={openedAccountSettingsFormModal}
        onClose={closeAccountSettingsFormModal}
        keepMounted={false}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault()

            if (uploadingAvatarBase64) {
              await updateAvatarMutation.mutateAsync(uploadingAvatarBase64)
            }
          }}
        >
          <Stack>
            <FileButton
              resetRef={resetUploadingAvatarRef}
              accept="image/png,image/jpeg"
              onChange={async (avatar) => {
                if (avatar) {
                  const avatarBase64 = await fileToBase64(avatar)
                  setUploadingAvatarBase64(avatarBase64)
                }
              }}
            >
              {(props) => (
                <ActionIcon mx="auto" w={100} h={100} {...props}>
                  {uploadingAvatarBase64 ? (
                    <Image h="100%" w="100%" radius="100%" src={uploadingAvatarBase64} alt={t('avatar')} />
                  ) : (
                    <Avatar h="100%" w="100%" />
                  )}
                </ActionIcon>
              )}
            </FileButton>

            <FormActions
              reset={() => {
                setUploadingAvatarBase64(null)
                resetUploadingAvatarRef.current?.()
              }}
            />
          </Stack>
        </form>
      </Modal>
    </header>
  )
}
