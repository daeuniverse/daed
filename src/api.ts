import { QueryClient } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";

import { endpointURLAtom } from "./store";

import { toast } from "~/libraries/GlobalToast";

const onError = (err: unknown) => {
  toast({
    title: (err as Error).message,
    status: "error",
  });
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError,
    },
    mutations: {
      onError,
    },
  },
});

export const gqlClient = new GraphQLClient(endpointURLAtom.get());
