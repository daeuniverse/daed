import { Button, Flex, Heading, IconButton, Spacer, useColorMode, useDisclosure, useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { CiDark, CiImport, CiLight, CiSquarePlus } from "react-icons/ci";

import { gqlClient, queryClient } from "~/api";
import { GET_LOG_LEVEL_STEPS, QUERY_KEY_CONFIG } from "~/constants";
import { graphql } from "~/gql";

import CreateConfigDrawer, { FormValues as CreateConfigDrawerFormValues } from "./CreateConfigDrawer";

export default () => {
  const { t } = useTranslation();
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const { isOpen: isConfigDrawerOpen, onOpen: onConfigDrawerOpen, onClose: onConfigDrawerClose } = useDisclosure();

  const createConfigMutation = useMutation({
    mutationFn: (values: CreateConfigDrawerFormValues) => {
      const {
        logLevelIndex,
        checkIntervalSeconds: checkIntervalMS,
        checkTolerenceSeconds: checkTolerenceMS,
        dns,
        routing,
        ...global
      } = values;

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
            checkInterval: `${checkIntervalMS}s`,
            checkTolerance: `${checkTolerenceMS}s`,
            ...global,
          },
          dns,
          routing,
        }
      );
    },
    onSuccess: (data) => {
      toast({
        title: "Config Created",
        description: `${data.createConfig.id}`,
        status: "success",
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_CONFIG });
      onConfigDrawerClose();
    },
  });

  return (
    <Flex alignItems="center" justifyContent="center" direction="column" h="full" p={6} gap={4}>
      <Heading p={6} rounded="full">
        daed
      </Heading>

      <Button w="full" leftIcon={<CiSquarePlus />} onClick={onConfigDrawerOpen}>
        {t("config")}
      </Button>

      <Button w="full" leftIcon={<CiImport />} onClick={onConfigDrawerOpen}>
        {t("group")}
      </Button>

      <Button w="full" leftIcon={<CiImport />} onClick={onConfigDrawerOpen}>
        {t("subscription")}
      </Button>

      <Spacer />

      <IconButton
        aria-label={t("dark mode")}
        onClick={toggleColorMode}
        icon={colorMode === "dark" ? <CiLight /> : <CiDark />}
      />

      <CreateConfigDrawer
        isOpen={isConfigDrawerOpen}
        onClose={onConfigDrawerClose}
        submitHandler={async (form) => {
          const values = form.getValues();
          await createConfigMutation.mutateAsync(values);
          form.reset();
        }}
      />
    </Flex>
  );
};
