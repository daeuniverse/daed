import { createStandaloneToast } from "@chakra-ui/toast";

import { theme } from "./theme";

export const { ToastContainer, toast } = createStandaloneToast({
  theme: theme,
});
