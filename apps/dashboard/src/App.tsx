import { Center, Spinner, useToast } from "@chakra-ui/react";
import { i18nInit } from "@daed/i18n";
import { graphql } from "@daed/schemas/gql";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GraphiQL } from "graphiql";
import { GraphQLClient } from "graphql-request";
import { useEffect, useState } from "react";
import { createBrowserRouter, RouteObject, RouterProvider } from "react-router-dom";

import { DEFAULT_ENDPOINT_URL, GQLClientContext } from "~/constants";
import { Home } from "~/Home";
import { endpointURLAtom } from "~/store";

const GQLQueryClientProvider = ({ client, children }: { client: GraphQLClient; children: React.ReactNode }) => {
  return (
    <GQLClientContext.Provider value={client}>
      <GQLClientContext.Consumer>{() => children}</GQLClientContext.Consumer>
    </GQLClientContext.Provider>
  );
};

export const App = () => {
  const { searchParams } = new URL(location.href);
  const endpointURL = searchParams.get("u") || DEFAULT_ENDPOINT_URL;

  useEffect(() => {
    endpointURLAtom.set(endpointURL);
  }, [endpointURL]);

  const toast = useToast();

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

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: !import.meta.env.DEV,
        onError,
      },
      mutations: {
        onError,
      },
    },
  });

  const gqlClient = new GraphQLClient(endpointURL);

  const healthCheckQuery = async () =>
    gqlClient.request(
      graphql(`
        query HealthCheck {
          healthCheck
        }
      `)
    );

  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([i18nInit(), healthCheckQuery()]).then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <Center w="100dvw" h="100dvh">
        <Spinner size="xl" />
      </Center>
    );
  }

  const routes: RouteObject[] = [
    {
      index: true,
      path: "/",
      element: <Home />,
    },
  ];

  if (import.meta.env.DEV) {
    routes.push({
      path: "/graphql",
      element: (
        <GraphiQL
          fetcher={createGraphiQLFetcher({
            url: endpointURL,
          })}
        />
      ),
    });
  }

  const router = createBrowserRouter(routes);

  return (
    <QueryClientProvider client={queryClient}>
      <GQLQueryClientProvider client={gqlClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools position="bottom-right" />
      </GQLQueryClientProvider>
    </QueryClientProvider>
  );
};
