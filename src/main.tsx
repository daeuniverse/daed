import { ChakraProvider, ColorModeScript, extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GraphiQL } from "graphiql";
import "graphiql/graphiql.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { queryClient } from "~/api";
import App from "~/App";
import { DEFAULT_ENDPOINT_URL } from "~/constants";
import initI18n from "~/i18n";
import "~/index.css";
import { endpointURL } from "~/store";

initI18n();

const theme = extendTheme({
  initialColorMode: "system",
  useSystemColorMode: true,
  fonts: { heading: `'Open Sans', sans-serif`, body: `'Raleway', sans-serif` },
} as ThemeConfig);

const getEndpointURL = () => {
  const { searchParams } = new URL(location.href);
  return searchParams.get("u") || endpointURL.get() || DEFAULT_ENDPOINT_URL;
};

endpointURL.set(getEndpointURL());

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
          <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
              <ColorModeScript initialColorMode={theme.config.initialColorMode} />
              <App />
            </ChakraProvider>
            <ReactQueryDevtools position="bottom-right" />
          </QueryClientProvider>
        }
      />
      <Route path="/graphql" element={<GraphiQL fetcher={fetcher} />} />
    </Routes>
  </BrowserRouter>
);
