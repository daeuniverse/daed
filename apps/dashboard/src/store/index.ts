import { UniqueIdentifier } from "@dnd-kit/core";
import { persistentAtom, persistentMap } from "@nanostores/persistent";

import { COLS_PER_ROW, DEFAULT_ENDPOINT_URL } from "~/constants";

export type PersistentSortableKeys = {
  nodeSortableKeys: UniqueIdentifier[];
  subscriptionSortableKeys: UniqueIdentifier[];
  configSortableKeys: UniqueIdentifier[];
  routingSortableKeys: UniqueIdentifier[];
  dnsSortableKeys: UniqueIdentifier[];
  groupSortableKeys: UniqueIdentifier[];
};

export type APP_STATE = {
  colsPerRow: number;
} & PersistentSortableKeys;

export const endpointURLAtom = persistentAtom<string>(DEFAULT_ENDPOINT_URL);
export const appStateAtom = persistentMap<APP_STATE>(
  "APP_STATE",
  {
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
);
