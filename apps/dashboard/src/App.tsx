import {
  Center,
  Container,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { i18nInit } from "@daed/i18n";
import { graphql } from "@daed/schemas/gql";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { useStore } from "@nanostores/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GraphiQL } from "graphiql";
import { GraphQLClient } from "graphql-request";
import { Fragment, useEffect, useState } from "react";
import { createBrowserRouter, RouteObject, RouterProvider } from "react-router-dom";

import { DEFAULT_ENDPOINT_URL_INPUT, formatUserInputEndpointURL, GQLClientContext } from "~/constants";
import { Home } from "~/Home";
import { endpointURLAtom } from "~/store";

const Setup = ({ children }: { children: React.ReactNode }) => {
  const endpointURL = useStore(endpointURLAtom);
  const { protocol } = new URL(location.href);

  if (!endpointURL) {
    return (
      <Center w="100dvw" h="100dvh">
        <Container>
          <InputGroup>
            <InputLeftAddon>{protocol}//</InputLeftAddon>

            <Input
              type="url"
              placeholder={DEFAULT_ENDPOINT_URL_INPUT}
              onKeyDown={(e) => {
                e.key === "Enter" && endpointURLAtom.set(formatUserInputEndpointURL(e.currentTarget.value));
              }}
            />

            <InputRightAddon>/graphql</InputRightAddon>
          </InputGroup>
        </Container>
      </Center>
    );
  }

  return <Fragment>{children}</Fragment>;
};

const GQLQueryClientProvider = ({ client, children }: { client: GraphQLClient; children: React.ReactNode }) => {
  return (
    <GQLClientContext.Provider value={client}>
      <GQLClientContext.Consumer>{() => children}</GQLClientContext.Consumer>
    </GQLClientContext.Provider>
  );
};

const Main = () => {
  const endpointURL = useStore(endpointURLAtom);
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

  const healthCheckQuery = () =>
    gqlClient.request(
      graphql(`
        query HealthCheck {
          healthCheck
        }
      `)
    );

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready) {
      Promise.all([i18nInit(), healthCheckQuery()])
        .then(() => {
          setReady(true);
        })
        .catch(() => {
          endpointURLAtom.set("");
        });
    }
  }, [ready]);

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
      path: "*",
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

export const App = () => {
  return (
    <Setup>
      <Main />
    </Setup>
  );
};
