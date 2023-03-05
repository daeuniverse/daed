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
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { CiImport, CiSquarePlus } from "react-icons/ci";

import { gqlClient, queryClient } from "~/api";
import { GET_LOG_LEVEL_STEPS, QUERY_KEY_CONFIG } from "~/constants";
import { graphql } from "~/gql";

import CreateConfigDrawer, { FormValues as CreateConfigDrawerFormValues } from "./CreateConfigDrawer";

export default () => {
  const { t } = useTranslation();
  const { colorMode, setColorMode } = useColorMode();
  const toast = useToast();
  const { isOpen: isConfigDrawerOpen, onOpen: onConfigDrawerOpen, onClose: onConfigDrawerClose } = useDisclosure();

  const createConfigMutation = useMutation({
    mutationFn: (values: CreateConfigDrawerFormValues) => {
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
    <>
      <Flex alignItems="center" justifyContent="center" direction="column" h="full" p={6} gap={4}>
        <Heading p={10} rounded="full">
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

        <FormControl as={Flex} alignItems="center" justifyContent="center" gap={2}>
          <FormLabel m={0}>{t("dark mode")}</FormLabel>

          <Switch
            isChecked={colorMode === "dark"}
            onChange={(e) => setColorMode(e.target.checked ? "dark" : "light")}
          />
        </FormControl>
      </Flex>

      <CreateConfigDrawer
        isOpen={isConfigDrawerOpen}
        onClose={onConfigDrawerClose}
        submitHandler={async (form) => {
          const values = form.getValues();
          await createConfigMutation.mutateAsync(values);
          form.reset();
        }}
      />
    </>
  );
};
