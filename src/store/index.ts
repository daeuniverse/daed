import type { UniqueIdentifier } from '@dnd-kit/core'
import type { MODE, ThemeId } from '~/constants'
import { persistentAtom, persistentMap } from '@nanostores/persistent'
import { atom, map } from 'nanostores'

import { COLS_PER_ROW, DEFAULT_ENDPOINT_URL, DEFAULT_THEME_ID } from '~/constants'

export type ColorScheme = 'light' | 'dark'
export type ThemeMode = 'system' | 'light' | 'dark'

export interface PersistentSortableKeys {
  nodeSortableKeys: UniqueIdentifier[]
  subscriptionSortableKeys: UniqueIdentifier[]
  configSortableKeys: UniqueIdentifier[]
  routingSortableKeys: UniqueIdentifier[]
  dnsSortableKeys: UniqueIdentifier[]
  groupSortableKeys: UniqueIdentifier[]
}

// Group-specific sort order storage (groupId -> { nodes: string[], subscriptions: string[] })
export interface GroupSortOrder {
  nodes: string[]
  subscriptions: string[]
}

export type GroupSortOrders = Record<string, GroupSortOrder>

// Profile/Preset type for saving and restoring configurations
export interface Profile {
  id: string
  name: string
  configID: string
  routingID: string
  dnsID: string
  createdAt: number
  updatedAt: number
}

export interface ProfilesState {
  profiles: Profile[]
  currentProfileID: string | null
}

export type AppState = {
  themeMode: ThemeMode
  colorTheme: ThemeId
  colsPerRow: number
} & PersistentSortableKeys

export const modeAtom = persistentAtom<MODE>('mode')
export const tokenAtom = persistentAtom<string>('token')
export const endpointURLAtom = persistentAtom<string>('endpointURL', DEFAULT_ENDPOINT_URL)
export const appStateAtom = persistentMap<AppState>(
  'APP_STATE',
  {
    themeMode: 'system',
    colorTheme: DEFAULT_THEME_ID,
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
  },
)

export interface DEFAULT_RESOURCES {
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

// Persistent storage for group-specific sort orders
export const groupSortOrdersAtom = persistentAtom<GroupSortOrders>(
  'GROUP_SORT_ORDERS',
  {},
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
)

// Persistent storage for profiles/presets
export const profilesAtom = persistentAtom<ProfilesState>(
  'PROFILES',
  {
    profiles: [],
    currentProfileID: null,
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
)
