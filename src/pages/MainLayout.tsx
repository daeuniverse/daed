import { ScrollArea, Stack } from '@mantine/core'
import { useStore } from '@nanostores/react'
import { useCallback, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import {
  getInterfacesRequest,
  getJsonStorageRequest,
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
import { DEFAULT_CONFIG_WITH_INTERFACE, DEFAULT_DNS, DEFAULT_ROUTING } from '~/constants'
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
  const navigate = useNavigate()
  const token = useStore(tokenAtom)
  const endpointURL = useStore(endpointURLAtom)
  const init = useInit()

  useEffect(() => {
    init()
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
          <div className="p-6">
            <Outlet />
          </div>
        </ScrollArea>
      </main>
    </Stack>
  )
}
