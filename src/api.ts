import { QueryClient } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";

import { endpointURL } from "./store";

export const queryClient = new QueryClient();
export const gqlClient = new GraphQLClient(endpointURL.get());
