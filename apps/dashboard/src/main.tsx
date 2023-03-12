import "~/index.css";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { theme } from "@daed/components";
import ReactDOM from "react-dom/client";

import { App } from "~/App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </ChakraProvider>
);
