import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Spacer,
  Switch,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import CreateConfigModal from "./CreateConfigModal";

export default () => {
  const { t } = useTranslation();
  const { colorMode, setColorMode } = useColorMode();
  const { isOpen: isConfigModalOpen, onOpen: onConfigModalOpen, onClose: onConfigModalClose } = useDisclosure();

  return (
    <>
      <Flex alignItems="center" direction="column" h="full" p={6}>
        <Box p={10}>daed</Box>

        <Button onClick={onConfigModalOpen}>{t("create config")}</Button>

        <Spacer />

        <FormControl as={Flex} alignItems="center" gap={2}>
          <FormLabel m={0}>{t("dark mode")}</FormLabel>

          <Switch
            isChecked={colorMode === "dark"}
            onChange={(e) => setColorMode(e.target.checked ? "dark" : "light")}
          />
        </FormControl>
      </Flex>

      <CreateConfigModal
        isOpen={isConfigModalOpen}
        onClose={onConfigModalClose}
        submitHandler={async (values) => {
          console.log(values);
        }}
      />
    </>
  );
};
