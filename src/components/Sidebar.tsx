import { Box, Flex, FormLabel, Spacer, Switch, useColorMode } from "@chakra-ui/react";

export default () => {
  const { colorMode, setColorMode } = useColorMode();

  return (
    <Flex alignItems="center" direction="column" h="full" p={6} pt={4}>
      <Box>daed</Box>

      <Spacer />

      <FormLabel display="flex" alignItems="center" m={0}>
        <Box mr={2}>Dark Mode</Box>

        <Switch isChecked={colorMode === "dark"} onChange={(e) => setColorMode(e.target.checked ? "dark" : "light")} />
      </FormLabel>
    </Flex>
  );
};
