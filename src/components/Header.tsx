import {
  ActionIcon,
  Anchor,
  Avatar,
  Burger,
  Button,
  Code,
  Container,
  Drawer,
  FileButton,
  Group,
  Header,
  Image,
  Menu,
  Modal,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
  Tooltip,
  UnstyledButton,
  createStyles,
  rem,
  useMantineColorScheme,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { useStore } from '@nanostores/react'
import {
  IconBrandGithub,
  IconChevronDown,
  IconCloudCheck,
  IconCloudPause,
  IconLanguage,
  IconLogout,
  IconMoon,
  IconRefreshAlert,
  IconSun,
  IconUserEdit,
} from '@tabler/icons-react'
import { Fragment, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { z } from 'zod'

import { useGeneralQuery, useRunMutation, useUpdateAvatarMutation, useUpdateNameMutation, useUserQuery } from '~/apis'
import logo from '~/assets/logo.svg'
import { i18n } from '~/i18n'
import { endpointURLAtom, tokenAtom } from '~/store'
import { fileToBase64 } from '~/utils'

import { FormActions } from './FormActions'

const useStyles = createStyles((theme) => ({
  header: {
    zIndex: 200,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    boxShadow: theme.shadows.sm,
    display: 'flex',
    alignItems: 'center',
  },

  user: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    },

    [theme.fn.smallerThan('sm')]: {
      padding: 0,
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

export const HeaderWithActions = () => {
  const { t } = useTranslation()
  const endpointURL = useStore(endpointURLAtom)
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const { classes, theme, cx } = useStyles()
  const [userMenuOpened, setUserMenuOpened] = useState(false)
  const [openedBurger, { toggle: toggleBurger, close: closeBurger }] = useDisclosure(false)
  const [openedAccountSettingsFormModal, { open: openAccountSettingsFormModal, close: closeAccountSettingsFormModal }] =
    useDisclosure(false)
  const { data: userQuery } = useUserQuery()
  const { data: generalQuery } = useGeneralQuery()
  const runMutation = useRunMutation()
  const updateNameMutation = useUpdateNameMutation()
  const updateAvatarMutation = useUpdateAvatarMutation()
  const [uploadingAvatarBase64, setUploadingAvatarBase64] = useState<string | null>(null)
  const resetUploadingAvatarRef = useRef<() => void>(null)

  const accountSettingsForm = useForm<z.infer<typeof accountSettingsSchema>>({
    validate: zodResolver(accountSettingsSchema),
    initialValues: {
      name: '',
    },
  })

  const matchSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`)

  return (
    <Header height={60} className={classes.header}>
      <Container sx={{ flex: 1 }}>
        <Group position="apart">
          <Group spacing="sm">
            <Anchor component={Link} to="/">
              <Group spacing="sm">
                <Image radius="sm" src={logo} width={32} height={32} />

                <Title
                  order={matchSmallScreen ? 5 : 2}
                  color={theme.colorScheme === 'dark' ? theme.white : theme.black}
                >
                  daed
                </Title>
              </Group>
            </Anchor>

            {!matchSmallScreen && (
              <Tooltip label={endpointURL}>
                <Code fz="xs" fw={700}>
                  {generalQuery?.general.dae.version}
                </Code>
              </Tooltip>
            )}
          </Group>

          <Group spacing={matchSmallScreen ? 'xs' : 'md'}>
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

            {matchSmallScreen ? (
              <Burger size="sm" opened={openedBurger} onClick={toggleBurger} />
            ) : (
              <Fragment>
                <Anchor href="https://github.com/daeuniverse/daed" target="_blank">
                  <ActionIcon>
                    <IconBrandGithub />
                  </ActionIcon>
                </Anchor>

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

                <ActionIcon onClick={() => toggleColorScheme()}>
                  {colorScheme === 'dark' ? <IconSun /> : <IconMoon />}
                </ActionIcon>
              </Fragment>
            )}

            {generalQuery?.general.dae.modified && (
              <Tooltip label={t('actions.reload')}>
                <ActionIcon loading={runMutation.isLoading} onClick={() => runMutation.mutateAsync(false)}>
                  <IconRefreshAlert />
                </ActionIcon>
              </Tooltip>
            )}

            {matchSmallScreen ? (
              <Tooltip label={t('actions.switchRunning')}>
                <Switch
                  size="xs"
                  disabled={!generalQuery?.general.dae.running && runMutation.isLoading}
                  checked={generalQuery?.general.dae.running}
                  onChange={(e) => {
                    runMutation.mutateAsync(!e.target.checked)
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip label={t('actions.switchRunning')}>
                <Switch
                  size="md"
                  onLabel={<IconCloudCheck />}
                  offLabel={<IconCloudPause />}
                  disabled={!generalQuery?.general.dae.running && runMutation.isLoading}
                  checked={generalQuery?.general.dae.running}
                  onChange={(e) => {
                    runMutation.mutateAsync(!e.target.checked)
                  }}
                />
              </Tooltip>
            )}
          </Group>
        </Group>
      </Container>

      <Drawer opened={openedBurger} onClose={closeBurger} size="100%">
        <SimpleGrid cols={3}>
          <Anchor href="https://github.com/daeuniverse/daed" target="_blank">
            <Button fullWidth>Github</Button>
          </Anchor>

          <Button
            fullWidth
            onClick={() => {
              if (i18n.language.startsWith('zh')) {
                i18n.changeLanguage('en')
              } else {
                i18n.changeLanguage('zh-Hans')
              }
            }}
          >
            {t('actions.switchLanguage')}
          </Button>

          <Button fullWidth onClick={() => toggleColorScheme()}>
            {t('actions.switchTheme')}
          </Button>
        </SimpleGrid>
      </Drawer>

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
    </Header>
  )
}
