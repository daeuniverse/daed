import { UniqueIdentifier } from '@dnd-kit/core'
import { ColorScheme } from '@mantine/core'
import { persistentAtom, persistentMap } from '@nanostores/persistent'
import { atom, map } from 'nanostores'

import { COLS_PER_ROW, DEFAULT_ENDPOINT_URL, MODE } from '~/constants'

export type PersistentSortableKeys = {
  nodeSortableKeys: UniqueIdentifier[]
  subscriptionSortableKeys: UniqueIdentifier[]
  configSortableKeys: UniqueIdentifier[]
  routingSortableKeys: UniqueIdentifier[]
  dnsSortableKeys: UniqueIdentifier[]
  groupSortableKeys: UniqueIdentifier[]
}

export type AppState = {
  preferredColorScheme: ColorScheme | ''
  colsPerRow: number
} & PersistentSortableKeys

export const modeAtom = persistentAtom<MODE>('mode')
export const tokenAtom = persistentAtom<string>('token')
export const endpointURLAtom = persistentAtom<string>('endpointURL', DEFAULT_ENDPOINT_URL)
export const appStateAtom = persistentMap<AppState>(
  'APP_STATE',
  {
    preferredColorScheme: '',
    colsPerRow: COLS_PER_ROW,
    nodeSortableKeys: [],
    subscriptionSortableKeys: [],
    configSortableKeys: [],
    routingSortableKeys: [],
    dnsSortableKeys: [],
    groupSortableKeys: [],
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
)

export type DEFAULT_RESOURCES = {
  defaultConfigID: string
  defaultRoutingID: string
  defaultDNSID: string
  defaultGroupID: string
}

export const defaultResourcesAtom = map<DEFAULT_RESOURCES>({
  defaultConfigID: '',
  defaultRoutingID: '',
  defaultDNSID: '',
  defaultGroupID: '',
})

export const colorSchemeAtom = atom<ColorScheme>('dark')
