import "~/index.css";

import { ThemeProvider } from "@daed/components";
import { SnackbarProvider } from "notistack";
import ReactDOM from "react-dom/client";

import { App } from "~/App";

import { appStateAtom } from "./store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider colorMode={appStateAtom.get().darkMode ? "dark" : "light"}>
    <SnackbarProvider
      anchorOrigin={{
        horizontal: "center",
        vertical: "bottom",
      }}
    >
      <App />
    </SnackbarProvider>
  </ThemeProvider>
);
