import {
  ActionIcon,
  Avatar,
  Box,
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
  TextInput,
  Title,
  Tooltip,
  UnstyledButton,
  createStyles,
  rem,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import {
  IconChevronDown,
  IconCloudCheck,
  IconCloudComputing,
  IconCloudPause,
  IconLanguage,
  IconLogout,
  IconRefreshAlert,
  IconTestPipe,
  IconUserEdit,
} from '@tabler/icons-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { useGeneralQuery, useRunMutation, useUpdateAvatarMutation, useUpdateNameMutation, useUserQuery } from '~/apis'
import logo from '~/assets/logo.svg'
import { i18n } from '~/i18n'
import { tokenAtom } from '~/store'
import { fileToBase64 } from '~/utils'

import { ColorSchemeToggle } from './ColorSchemeToggle'
import { FormActions } from './FormActions'

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

const accountSettingsSchema = z.object({
  name: z.string().nonempty(),
})

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
  const updateNameMutation = useUpdateNameMutation()
  const updateAvatarMutation = useUpdateAvatarMutation()
  const [uploadingAvatarBase64, setUploadingAvatarBase64] = useState<string | null>(null)
  const resetUploadingAvatarRef = useRef<() => void>(null)

  const links = [
    { link: '/orchestrate', label: t('orchestrate'), icon: <IconCloudComputing /> },
    { link: '/experiment', label: t('experiment'), icon: <IconTestPipe /> },
  ]

  const accountSettingsForm = useForm<z.infer<typeof accountSettingsSchema>>({
    validate: zodResolver(accountSettingsSchema),
    initialValues: {
      name: '',
    },
  })

  return (
    <header className={classes.header}>
      <Container className={classes.mainSection}>
        <Group position="apart">
          <Group>
            <Link to="/">
              <Group>
                <Image radius="sm" src={logo} width={32} height={32} />

                <Title order={2} color={theme.colorScheme === 'dark' ? theme.white : theme.black}>
                  daed
                </Title>
              </Group>
            </Link>

            {/* <SegmentedControl
              value={mode}
              onChange={async (mode) => {
                await setModeMutation.mutateAsync(mode as MODE)

                if (mode === MODE.simple) {
                  navigate('/')
                } else {
                  navigate('/orchestrate')
                }

                modeAtom.set(mode as MODE)
              }}
              data={[
                { label: t('actions.simple mode'), value: MODE.simple },
                { label: t('actions.advanced mode'), value: MODE.advanced },
              ]}
            /> */}
          </Group>

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
                      {userQuery?.user.name || userQuery?.user.username || 'unknown'}
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
                  icon={<IconUserEdit size="0.9rem" stroke={1.5} />}
                  onClick={() => {
                    accountSettingsForm.setValues({
                      name: userQuery?.user.name || '',
                    })
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

            {generalQuery?.general.dae.modified && (
              <Tooltip label={t('actions.reload')} withArrow>
                <ActionIcon loading={runMutation.isLoading} onClick={() => runMutation.mutateAsync(false)}>
                  <IconRefreshAlert />
                </ActionIcon>
              </Tooltip>
            )}

            <Tooltip label={t('actions.switchRunning')} withArrow>
              <Box>
                <Switch
                  size="md"
                  onLabel={<IconCloudCheck />}
                  offLabel={<IconCloudPause />}
                  disabled={!generalQuery?.general.dae.running && runMutation.isLoading}
                  checked={generalQuery?.general.dae.running}
                  onChange={(e) => runMutation.mutateAsync(!e.target.checked)}
                />
              </Box>
            </Tooltip>
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
          onSubmit={accountSettingsForm.onSubmit(async ({ name }) => {
            if (name !== userQuery?.user.name) {
              await updateNameMutation.mutateAsync(name)
            }

            if (uploadingAvatarBase64 && uploadingAvatarBase64 !== userQuery?.user.avatar) {
              await updateAvatarMutation.mutateAsync(uploadingAvatarBase64)
            }

            closeAccountSettingsFormModal()
          })}
        >
          <Stack>
            <TextInput label={t('display name')} withAsterisk {...accountSettingsForm.getInputProps('name')} />

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
