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
import { useTranslation } from "react-i18next";
import { CiImport, CiSquarePlus } from "react-icons/ci";

import { gqlClient, queryClient } from "~/api";
import { GET_LOG_LEVEL_STEPS, QUERY_KEY_CONFIG } from "~/constants";
import { graphql } from "~/gql";

import CreateConfigModal, { FormValues as CreateConfigModalFormValues } from "./CreateConfigModal";

export default () => {
  const { t } = useTranslation();
  const { colorMode, setColorMode } = useColorMode();
  const { isOpen: isConfigModalOpen, onOpen: onConfigModalOpen, onClose: onConfigModalClose } = useDisclosure();

  const createConfigMutation = useMutation({
    mutationFn: (values: CreateConfigModalFormValues) => {
      const { logLevelIndex, checkIntervalMS, checkTolerenceMS, dns, routing, ...global } = values;

      return gqlClient.request(
        graphql(`
          mutation createConfig($global: globalInput, $dns: String, $routing: String) {
            createConfig(global: $global, dns: $dns, routing: $routing) {
              id
            }
          }
        `),
        {
          global: {
            logLevel: GET_LOG_LEVEL_STEPS(t)[logLevelIndex][1],
            checkInterval: `${checkIntervalMS}ms`,
            checkTolerance: `${checkTolerenceMS}ms`,
            ...global,
          },
          dns,
          routing,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_CONFIG });
      onConfigModalClose();
    },
  });

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
          await createConfigMutation.mutateAsync(values);
        }}
      />
    </>
  );
};
