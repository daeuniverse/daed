import { extendTheme, ThemeConfig } from "@chakra-ui/react";

export const theme = extendTheme({
  initialColorMode: "system",
  useSystemColorMode: true,
  fonts: { heading: `'Open Sans', sans-serif`, body: `'Raleway', sans-serif` },
} as ThemeConfig);

export * from "./src/CreateFormDrawer";
export * from "./src/DescriptiveText";
export * from "./src/GlobalToast";
export * from "./src/GrowableInputList";
export * from "./src/NumberInput";
export * from "./src/SimpleDisplay";
export * from "./src/SortableGrid";
export * from "./src/WithConfirmRemoveButton";
