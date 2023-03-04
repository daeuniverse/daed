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
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { gqlClient } from "~/api";
import { graphql } from "~/gql";

import CreateConfigModal, { FormValues as CreateConfigModalFormValues } from "./CreateConfigModal";

export default () => {
  const { t } = useTranslation();
  const { colorMode, setColorMode } = useColorMode();
  const { isOpen: isConfigModalOpen, onOpen: onConfigModalOpen, onClose: onConfigModalClose } = useDisclosure();
  const createConfigMutation = useMutation({
    mutationFn: (config: CreateConfigModalFormValues) => {
      const { logLevel, ...global } = config;

      return gqlClient.request(
        graphql(/* GraphQL */ `
          mutation createConfig($global: globalInput, $dns: String, $routing: String) {
            createConfig(global: $global, dns: $dns, routing: $routing) {
              selected
            }
          }
        `),
        {
          global: {
            logLevel: "info",
            ...global,
          },
        }
      );
    },
  });

  const createConfigSubmitHandler = useCallback(async (values: CreateConfigModalFormValues) => {
    createConfigMutation.mutate(values);
  }, []);

  return (
    <>
      <Flex alignItems="center" justifyContent="center" direction="column" h="full" p={6}>
        <Heading p={10}>daed</Heading>

        <Button onClick={onConfigModalOpen}>{t("create config")}</Button>

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
        submitHandler={createConfigSubmitHandler}
      />
    </>
  );
};
