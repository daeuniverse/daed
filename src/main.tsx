import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";

import App from "~/App";
import { DEFAULT_ENDPOINT_URL } from "~/constants";
import "~/index.css";
import { endpointURL } from "~/store";

const client = new QueryClient();

const getEndpointURL = () => {
  const { searchParams } = new URL(location.href);
  return searchParams.get("u") || endpointURL.get() || DEFAULT_ENDPOINT_URL;
};

endpointURL.set(getEndpointURL());

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={client}>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </QueryClientProvider>
);
