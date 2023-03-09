import "~/index.css";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GraphiQL } from "graphiql";
import { Fragment } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { queryClient } from "~/api";
import App from "~/App";
import { DEFAULT_ENDPOINT_URL, theme } from "~/constants";
import { ToastContainer } from "~/libraries/GlobalToast";
import { endpointURLAtom } from "~/store";

const { searchParams } = new URL(location.href);

const getEndpointURL = () => {
  return searchParams.get("u") || endpointURLAtom.get() || DEFAULT_ENDPOINT_URL;
};

endpointURLAtom.set(getEndpointURL());

const debug = searchParams.get("d") || import.meta.env.DEV;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Fragment>
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
              {debug && <ReactQueryDevtools position="bottom-right" />}
            </QueryClientProvider>
          }
        />
        {debug && (
          <Route
            path="/graphql"
            element={
              <GraphiQL
                fetcher={createGraphiQLFetcher({
                  url: endpointURLAtom.get(),
                })}
              />
            }
          />
        )}
      </Routes>
    </BrowserRouter>
    <ToastContainer />
  </Fragment>
);
