import { Center, ChakraProvider, ColorModeScript, Spinner, useToast } from "@chakra-ui/react";
import { theme } from "@daed/components";
import { i18nInit } from "@daed/i18n";
import { graphql } from "@daed/schemas/gql";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GraphiQL } from "graphiql";
import { GraphQLClient } from "graphql-request";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Home } from "~/Home";
import { endpointURLAtom } from "~/store";

import { DEFAULT_ENDPOINT_URL, GQLClientContext } from "./constants";

const GQLQueryClientProvider = ({ client, children }: { client: GraphQLClient; children: React.ReactNode }) => {
  return (
    <GQLClientContext.Provider value={client}>
      <GQLClientContext.Consumer>{() => children}</GQLClientContext.Consumer>
    </GQLClientContext.Provider>
  );
};

export const App = () => {
  const { searchParams } = new URL(location.href);
  const endpointURL = searchParams.get("u") || endpointURLAtom.get() || DEFAULT_ENDPOINT_URL;

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([i18nInit(), healthCheckQuery()]).then(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Center h="full">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          path="/"
          element={
            <QueryClientProvider client={queryClient}>
              <GQLQueryClientProvider client={gqlClient}>
                <ChakraProvider theme={theme}>
                  <ColorModeScript initialColorMode={theme.config.initialColorMode} />
                  <Home />
                </ChakraProvider>
                <ReactQueryDevtools position="bottom-right" />
              </GQLQueryClientProvider>
            </QueryClientProvider>
          }
        />

        <Route
          path="/graphql"
          element={
            <GraphiQL
              fetcher={createGraphiQLFetcher({
                url: endpointURL,
              })}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
