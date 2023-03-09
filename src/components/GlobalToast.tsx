import { createStandaloneToast } from "@chakra-ui/toast";

import { theme } from "~/constants";

export const { ToastContainer, toast } = createStandaloneToast({
  theme: theme,
});
