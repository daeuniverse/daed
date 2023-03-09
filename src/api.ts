import { QueryClient } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";

import { toast } from "~/libraries/GlobalToast";

import { endpointURLAtom } from "./store";

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
