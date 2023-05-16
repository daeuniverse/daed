import { UniqueIdentifier } from '@dnd-kit/core'

import { defaultNS, resources } from '~/i18n'

declare type SortableList = Array<{ id: UniqueIdentifier } & Record<string, unknown>>

declare type SimpleDisplayable = number | string

declare type Displayable =
  | null
  | boolean
  | SimpleDisplayable
  | Array<SimpleDisplayable>
  | Array<{ [key: string]: SimpleDisplayable }>

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    resources: {
      translation: (typeof resources)['zh-Hans'][typeof defaultNS]
    }
  }
}
