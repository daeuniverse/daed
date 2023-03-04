import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Spacer,
  Switch,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { CiImport, CiSquarePlus } from "react-icons/ci";

import { gqlClient } from "~/api";
import { graphql } from "~/gql";

import CreateConfigModal, { FormValues as CreateConfigModalFormValues } from "./CreateConfigModal";

export default () => {
  const { t } = useTranslation();
  const { colorMode, setColorMode } = useColorMode();
  const { isOpen: isConfigModalOpen, onOpen: onConfigModalOpen, onClose: onConfigModalClose } = useDisclosure();

  return (
    <>
      <Flex alignItems="center" justifyContent="center" direction="column" h="full" p={6} gap={4}>
        <Heading p={10} rounded="full">
          daed
        </Heading>

        <Button w="full" leftIcon={<CiSquarePlus />} onClick={onConfigModalOpen}>
          {t("config")}
        </Button>

        <Button w="full" leftIcon={<CiImport />} onClick={onConfigModalOpen}>
          {t("group")}
        </Button>

        <Button w="full" leftIcon={<CiImport />} onClick={onConfigModalOpen}>
          {t("subscription")}
        </Button>

        <Spacer />

        <FormControl as={Flex} alignItems="center" justifyContent="center" gap={2}>
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
        submitHandler={async (values: CreateConfigModalFormValues) => {
          const { logLevel, checkInterval, checkTolerence, tproxyPort, ...global } = values;
          console.log(values);

          try {
            await gqlClient.request(
              graphql(`
                mutation createConfig($global: globalInput, $dns: String, $routing: String) {
                  createConfig(global: $global, dns: $dns, routing: $routing) {
                    selected
                  }
                }
              `),
              {
                global: {
                  logLevel: "info",
                  tproxyPort: Number(tproxyPort),
                  checkInterval: `${checkInterval}ms`,
                  checkTolerance: `${checkTolerence}ms`,
                  ...global,
                },
                dns: null,
                routing: null,
              }
            );
          } catch {
            //
          }
        }}
      />
    </>
  );
};
