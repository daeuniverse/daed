import { extendTheme, ThemeConfig } from "@chakra-ui/react";

export const theme = extendTheme({
  initialColorMode: "system",
  useSystemColorMode: true,
  fonts: { heading: `'Open Sans', sans-serif`, body: `'Raleway', sans-serif` },
} as ThemeConfig);
