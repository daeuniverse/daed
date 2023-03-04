import { Box, Flex, FormControl, FormLabel, Spacer, Switch, useColorMode } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export default () => {
  const { t } = useTranslation();
  const { colorMode, setColorMode } = useColorMode();

  return (
    <Flex alignItems="center" direction="column" h="full" p={6} pt={4}>
      <Box>daed</Box>

      <Spacer />

      <FormControl as={Flex} alignItems="center" gap={2}>
        <FormLabel m={0}>{t("dark mode")}</FormLabel>

        <Switch isChecked={colorMode === "dark"} onChange={(e) => setColorMode(e.target.checked ? "dark" : "light")} />
      </FormControl>
    </Flex>
  );
};
