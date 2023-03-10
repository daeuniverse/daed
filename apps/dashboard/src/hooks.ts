import { useContext } from "react";

import { GQLClientContext } from "./constants";

export const useQGLQueryClient = () => useContext(GQLClientContext);
