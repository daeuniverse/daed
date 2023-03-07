import { persistentAtom } from "@nanostores/persistent";
import { atom } from "nanostores";

import { COLS_PER_ROW, DEFAULT_ENDPOINT_URL } from "~/constants";

export const endpointURL = persistentAtom<string>(DEFAULT_ENDPOINT_URL);
export const colsPerRowAtom = atom(COLS_PER_ROW);
