import { Flex, Group, Image, NavLink, Navbar, ScrollArea, Switch } from '@mantine/core'
import { useStore } from '@nanostores/react'
import {
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
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

import {
  getInterfacesRequest,
  getJsonStorageRequest,
  useCreateConfigMutation,
  useCreateDNSMutation,
  useCreateGroupMutation,
  useCreateRoutingMutation,
  useGeneralQuery,
  useRunMutation,
  useSelectConfigMutation,
  useSelectDNSMutation,
  useSelectRoutingMutation,
  useSetJsonStorageMutation,
} from '~/apis'
import { ColorSchemeToggle } from '~/components/ColorSchemeToggle'
import { DEFAULT_CONFIG_WITH_INTERFACE, DEFAULT_DNS, DEFAULT_ROUTING } from '~/constants'
import { i18n } from '~/i18n'
import { Policy } from '~/schemas/gql/graphql'
import { defaultResourcesAtom, endpointURLAtom, tokenAtom } from '~/store'

const useInit = () => {
  const endpointURL = useStore(endpointURLAtom)
  const token = useStore(tokenAtom)
  const createConfigMutation = useCreateConfigMutation()
  const selectConfigMutation = useSelectConfigMutation()
  const createRoutingMutation = useCreateRoutingMutation()
  const selectRoutingMutation = useSelectRoutingMutation()
  const createDNSMutation = useCreateDNSMutation()
  const selectDNSMutation = useSelectDNSMutation()
  const createGroupMutation = useCreateGroupMutation()
  const setJsonStorage = useSetJsonStorageMutation()
  const getJsonStorage = getJsonStorageRequest(endpointURL, token)
  const getInterfaces = getInterfacesRequest(endpointURL, token)

  return useCallback(async () => {
    const [defaultConfigID, defaultRoutingID, defaultDNSID, defaultGroupID] = (
      await getJsonStorage(['defaultConfigID', 'defaultRoutingID', 'defaultDNSID', 'defaultGroupID'])
    ).jsonStorage

    const interfaceName = (await getInterfaces()).general.interfaces.find(({ name }) => name !== 'lo')?.name || 'lan'

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
    }

    {
      const [defaultConfigID, defaultRoutingID, defaultDNSID, defaultGroupID] = (
        await getJsonStorage(['defaultConfigID', 'defaultRoutingID', 'defaultDNSID', 'defaultGroupID'])
      ).jsonStorage

      defaultResourcesAtom.set({
        defaultConfigID,
        defaultRoutingID,
        defaultDNSID,
        defaultGroupID,
      })
    }
  }, [
    createConfigMutation,
    createDNSMutation,
    createGroupMutation,
    createRoutingMutation,
    getInterfaces,
    getJsonStorage,
    selectConfigMutation,
    selectDNSMutation,
    selectRoutingMutation,
    setJsonStorage,
  ])
}

export const MainLayout = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const token = useStore(tokenAtom)
  const endpointURL = useStore(endpointURLAtom)
  const init = useInit()
  const { data: generalQuery } = useGeneralQuery()
  const runMutation = useRunMutation()

  const navLinks = [
    { link: '/config', label: t('config'), icon: <IconSettings /> },
    { link: '/node', label: t('node'), icon: <IconSubtask /> },
    { link: '/subscription', label: t('subscription'), icon: <IconTable /> },
    { link: '/dns', label: t('dns'), icon: <IconRoute /> },
    { link: '/routing', label: t('routing'), icon: <IconMap /> },
    { link: '/group', label: t('group'), icon: <IconUsersGroup /> },
    { link: '/experiment', label: 'Experiment', icon: <IconTestPipe /> },
  ]

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (!endpointURL || !token) {
      navigate('/setup')
    }
  }, [endpointURL, navigate, token])

  return (
    <Flex h="100%">
      <Navbar h="100%" w={200}>
        <Navbar.Section py={20} px={10} className="border-b border-gray-300">
          <Group position="apart">
            <Link to="/">
              <Image width={40} radius={4} src="/logo.svg" alt="logo" />
            </Link>

            <Group>
              <ColorSchemeToggle />

              <Switch
                checked={generalQuery?.general.dae.running}
                onChange={async (e) => {
                  await runMutation.mutateAsync(!e.target.checked)
                }}
              />
            </Group>
          </Group>
        </Navbar.Section>

        <Navbar.Section grow>
          {navLinks.map((navLink) => (
            <NavLink
              className="uppercase"
              component={Link}
              key={navLink.label}
              label={navLink.label}
              icon={navLink.icon}
              to={navLink.link}
              active={location.pathname === navLink.link}
            />
          ))}
        </Navbar.Section>

        <Navbar.Section py={20} px={10} className="border-t border-gray-300">
          <NavLink
            label={t('actions.switchLanguage')}
            icon={<IconLanguage />}
            onClick={() => {
              if (i18n.language.startsWith('zh')) {
                i18n.changeLanguage('en')
              } else {
                i18n.changeLanguage('zh-Hans')
              }
            }}
          />
          <NavLink
            label={t('actions.logout')}
            icon={<IconLogout />}
            onClick={() => {
              tokenAtom.set('')

              navigate('/setup')
            }}
          />
        </Navbar.Section>
      </Navbar>

      <main className="h-full flex-1 overflow-hidden">
        <ScrollArea w="100%" h="100%" className="p-6">
          <Outlet />
        </ScrollArea>
      </main>
    </Flex>
  )
}
