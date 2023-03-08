import { persistentAtom } from "@nanostores/persistent";

import { COLS_PER_ROW, DEFAULT_ENDPOINT_URL } from "~/constants";

export type APP_STATE = {
  colsPerRow: number;
};

export const endpointURLAtom = persistentAtom<string>(DEFAULT_ENDPOINT_URL);
export const appStateAtom = persistentAtom<APP_STATE>(
  "APP_STATE",
  {
    colsPerRow: COLS_PER_ROW,
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);
