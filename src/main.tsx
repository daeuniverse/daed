import { ChakraProvider, ColorModeScript, extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GraphiQL } from "graphiql";
import "graphiql/graphiql.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "~/App";
import { DEFAULT_ENDPOINT_URL } from "~/constants";
import "~/index.css";
import { endpointURL } from "~/store";

const theme = extendTheme({
  initialColorMode: "system",
  useSystemColorMode: true,
} as ThemeConfig);

const getEndpointURL = () => {
  const { searchParams } = new URL(location.href);
  return searchParams.get("u") || endpointURL.get() || DEFAULT_ENDPOINT_URL;
};

endpointURL.set(getEndpointURL());

const gqlClient = new QueryClient();
const fetcher = createGraphiQLFetcher({
  url: endpointURL.get(),
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <Routes>
      <Route
        index
        path="/"
        element={
          <QueryClientProvider client={gqlClient}>
            <ChakraProvider theme={theme}>
              <ColorModeScript initialColorMode={theme.config.initialColorMode} />
              <App />
            </ChakraProvider>
          </QueryClientProvider>
        }
      />
      <Route path="/graphql" element={<GraphiQL fetcher={fetcher} />} />
    </Routes>
  </BrowserRouter>
);
