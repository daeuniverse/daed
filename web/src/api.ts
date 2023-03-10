import { toast } from "@daed/components";
import { QueryClient } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";

import { endpointURLAtom } from "./store";

const onError = (err: unknown) => {
  const id = "api-error";

  if (toast.isActive(id)) {
    return;
  }

  toast({
    id,
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
