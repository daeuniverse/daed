import { Container, ScrollArea, Stack } from '@mantine/core'
import { useStore } from '@nanostores/react'
import { useCallback, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import {
  getDefaultsRequest,
  getInterfacesRequest,
  getModeRequest,
  useCreateConfigMutation,
  useCreateDNSMutation,
  useCreateGroupMutation,
  useCreateRoutingMutation,
  useSelectConfigMutation,
  useSelectDNSMutation,
  useSelectRoutingMutation,
  useSetJsonStorageMutation,
} from '~/apis'
import { Header } from '~/components/Header'
import {
  DEFAULT_CONFIG_NAME,
  DEFAULT_CONFIG_WITH_INTERFACE,
  DEFAULT_DNS,
  DEFAULT_GROUP_NAME,
  DEFAULT_ROUTING,
  MODE,
} from '~/constants'
import { useGQLQueryClient } from '~/contexts'
import { Policy } from '~/schemas/gql/graphql'
import { defaultResourcesAtom, endpointURLAtom, modeAtom, tokenAtom } from '~/store'

const useInit = () => {
  const createConfigMutation = useCreateConfigMutation()
  const selectConfigMutation = useSelectConfigMutation()
  const createRoutingMutation = useCreateRoutingMutation()
  const selectRoutingMutation = useSelectRoutingMutation()
  const createDNSMutation = useCreateDNSMutation()
  const selectDNSMutation = useSelectDNSMutation()
  const createGroupMutation = useCreateGroupMutation()
  const setJsonStorageMutation = useSetJsonStorageMutation()
  const gqlClient = useGQLQueryClient()
  const getInterfaces = getInterfacesRequest(gqlClient)
  const getMode = getModeRequest(gqlClient)
  const getDefaults = getDefaultsRequest(gqlClient)

  return useCallback(async () => {
    const interfaces = (await getInterfaces()).general.interfaces
      .filter(({ flag }) => !!flag.default)
      .map(({ name }) => name)

    const { defaultConfigID, defaultRoutingID, defaultDNSID, defaultGroupID } = await getDefaults()

    if (!defaultConfigID) {
      const {
        createConfig: { id },
      } = await createConfigMutation.mutateAsync({
        name: DEFAULT_CONFIG_NAME,
        global: DEFAULT_CONFIG_WITH_INTERFACE(interfaces),
      })

      await selectConfigMutation.mutateAsync({
        id,
      })

      await setJsonStorageMutation.mutateAsync({
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

      await setJsonStorageMutation.mutateAsync({
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

      await setJsonStorageMutation.mutateAsync({
        defaultDNSID: id,
      })
    }

    if (!defaultGroupID) {
      const {
        createGroup: { id },
      } = await createGroupMutation.mutateAsync({
        name: DEFAULT_GROUP_NAME,
        policy: Policy.Min,
        policyParams: [],
      })

      await setJsonStorageMutation.mutateAsync({
        defaultGroupID: id,
      })
    }

    const mode = await getMode()

    if (!mode) {
      await setJsonStorageMutation.mutateAsync({
        mode: MODE.simple,
      })

      modeAtom.set(MODE.simple)
    } else {
      modeAtom.set(mode as MODE)
    }

    {
      const { defaultConfigID, defaultDNSID, defaultGroupID, defaultRoutingID } = await getDefaults()

      defaultResourcesAtom.set({
        defaultConfigID,
        defaultDNSID,
        defaultGroupID,
        defaultRoutingID,
      })
    }
  }, [
    createConfigMutation,
    createDNSMutation,
    createGroupMutation,
    createRoutingMutation,
    getDefaults,
    getInterfaces,
    getMode,
    selectConfigMutation,
    selectDNSMutation,
    selectRoutingMutation,
    setJsonStorageMutation,
  ])
}

export const MainLayout = () => {
  const navigate = useNavigate()
  const token = useStore(tokenAtom)
  const endpointURL = useStore(endpointURLAtom)
  const init = useInit()

  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!endpointURL || !token) {
      navigate('/setup')
    }
  }, [endpointURL, navigate, token])

  return (
    <Stack h="100%">
      <Header />

      <main className="w-full overflow-auto">
        <ScrollArea w="100%" h="100%" type="scroll">
          <Container size="lg" p="sm">
            <Outlet />
          </Container>
        </ScrollArea>
      </main>
    </Stack>
  )
}
