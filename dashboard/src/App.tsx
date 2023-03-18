import { useColorMode } from "@daed/components";
import { i18nInit } from "@daed/i18n";
import { graphql } from "@daed/schemas/gql";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { CircularProgress, Stack, TextField } from "@mui/material";
import { useStore } from "@nanostores/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GraphiQL } from "graphiql";
import { GraphQLClient } from "graphql-request";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createBrowserRouter, RouteObject, RouterProvider } from "react-router-dom";

import { DEFAULT_ENDPOINT_URL_INPUT, formatUserInputEndpointURL } from "~/constants";
import { GQLQueryClientProvider } from "~/contexts";
import { Home } from "~/Home";
import { Config } from "~/pages/Config";
import { DNS } from "~/pages/DNS";
import { Node, NodeGroup, NodeList } from "~/pages/Node";
import { Routing } from "~/pages/Routing";
import { appStateAtom, endpointURLAtom } from "~/store";

const Setup = ({ children }: { children: React.ReactElement }) => {
  const endpointURL = useStore(endpointURLAtom);
  const { protocol } = new URL(location.href);
  const [endpointURLInput, setEndpointURLInput] = useState("");
  const { colorMode } = useColorMode();

  useEffect(() => {
    const preventContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", preventContextMenu);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
    };
  }, []);

  useEffect(() => {
    appStateAtom.setKey("darkMode", colorMode === "dark");
  }, [colorMode]);

  if (!endpointURL) {
    return (
      <Stack height="100dvh" alignItems="center" justifyContent="center">
        <TextField
          type="url"
          helperText="Endpoint URL"
          InputProps={{
            startAdornment: `${protocol}//`,
            endAdornment: "/graphql",
          }}
          value={endpointURLInput}
          onChange={(e) => setEndpointURLInput(e.target.value)}
          placeholder={DEFAULT_ENDPOINT_URL_INPUT}
          onKeyDown={(e) => {
            if (e.key === "Enter" && endpointURLInput) {
              endpointURLAtom.set(formatUserInputEndpointURL(endpointURLInput));
            }
          }}
        />
      </Stack>
    );
  }

  return children;
};

const Main = () => {
  const endpointURL = useStore(endpointURLAtom);
  const { enqueueSnackbar } = useSnackbar();

  const onError = (err: unknown) => {
    enqueueSnackbar((err as Error).message, {
      variant: "error",
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

  const gqlClient = useMemo(() => new GraphQLClient(endpointURL), [endpointURL]);

  const healthCheckQuery = useCallback(
    () =>
      gqlClient.request(
        graphql(`
          query HealthCheck {
            healthCheck
          }
        `)
      ),
    [gqlClient]
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
  }, [healthCheckQuery, ready]);

  if (!ready) {
    return (
      <Stack height="100dvh" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    );
  }

  const routes: RouteObject[] = [
    {
      path: "/",
      element: <Home />,
      children: [
        {
          path: "node",
          element: <Node />,
          children: [
            {
              index: true,
              element: <NodeList />,
            },
            {
              path: "group",
              element: <NodeGroup />,
            },
          ],
        },
        {
          path: "config",
          element: <Config />,
        },
        {
          path: "routing",
          element: <Routing />,
        },
        {
          path: "dns",
          element: <DNS />,
        },
      ],
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
