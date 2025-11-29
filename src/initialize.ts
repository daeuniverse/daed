import { useCallback } from 'react'

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
import {
  DEFAULT_CONFIG_NAME,
  DEFAULT_CONFIG_WITH_LAN_INTERFACEs,
  DEFAULT_DNS,
  DEFAULT_DNS_NAME,
  DEFAULT_GROUP_NAME,
  DEFAULT_GROUP_POLICY,
  DEFAULT_ROUTING,
  DEFAULT_ROUTING_NAME,
  MODE,
} from '~/constants'
import { useGQLQueryClient } from '~/contexts'
import { defaultResourcesAtom, modeAtom } from '~/store'

export function useInitialize() {
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
    const lanInterfaces = (await getInterfaces()).general.interfaces.filter(({ flag }) => !!flag.default).map(({ name }) => name)

    const { defaultConfigID, defaultRoutingID, defaultDNSID, defaultGroupID } = await getDefaults()

    if (!defaultConfigID) {
      const {
        createConfig: { id },
      } = await createConfigMutation.mutateAsync({
        name: DEFAULT_CONFIG_NAME,
        global: DEFAULT_CONFIG_WITH_LAN_INTERFACEs(lanInterfaces),
      })

      await selectConfigMutation.mutateAsync({ id })
      await setJsonStorageMutation.mutateAsync({ defaultConfigID: id })
    }

    if (!defaultRoutingID) {
      const {
        createRouting: { id },
      } = await createRoutingMutation.mutateAsync({ name: DEFAULT_ROUTING_NAME, routing: DEFAULT_ROUTING })

      await selectRoutingMutation.mutateAsync({ id })
      await setJsonStorageMutation.mutateAsync({ defaultRoutingID: id })
    }

    if (!defaultDNSID) {
      const {
        createDns: { id },
      } = await createDNSMutation.mutateAsync({ name: DEFAULT_DNS_NAME, dns: DEFAULT_DNS })

      await selectDNSMutation.mutateAsync({ id })
      await setJsonStorageMutation.mutateAsync({ defaultDNSID: id })
    }

    if (!defaultGroupID) {
      const {
        createGroup: { id },
      } = await createGroupMutation.mutateAsync({
        name: DEFAULT_GROUP_NAME,
        policy: DEFAULT_GROUP_POLICY,
        policyParams: [],
      })
      await setJsonStorageMutation.mutateAsync({ defaultGroupID: id })
    }

    const mode = await getMode()

    if (!mode) {
      await setJsonStorageMutation.mutateAsync({ mode: MODE.simple })

      modeAtom.set(MODE.simple)
    }
    else {
      modeAtom.set(mode as MODE)
    }

    {
      const { defaultConfigID, defaultDNSID, defaultGroupID, defaultRoutingID } = await getDefaults()

      defaultResourcesAtom.set({ defaultConfigID, defaultDNSID, defaultGroupID, defaultRoutingID })
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
