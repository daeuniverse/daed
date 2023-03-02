import { persistentAtom } from "@nanostores/persistent";

import { DEFAULT_ENDPOINT_URL } from "~/constants";

export const endpointURL = persistentAtom<string>(DEFAULT_ENDPOINT_URL);
