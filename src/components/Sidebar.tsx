import { Button, Flex, Heading, IconButton, Spacer, useColorMode, useDisclosure, useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { CiDark, CiImport, CiLight, CiSquarePlus } from "react-icons/ci";

import { gqlClient, queryClient } from "~/api";
import { GET_LOG_LEVEL_STEPS, QUERY_KEY_CONFIG, QUERY_KEY_GROUP } from "~/constants";
import { graphql } from "~/gql";

import CreateConfigFormDrawer, { FormValues as CreateConfigFormDrawerFormValues } from "./CreateConfigFormDrawer";
import CreateGroupFormDrawer, { FormValues as CreateGroupFormDrawerFormValues } from "./CreateGroupFormDrawer";

export default () => {
  const { t } = useTranslation();
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  const {
    isOpen: isConfigFormDrawerOpen,
    onOpen: onConfigFormDrawerOpen,
    onClose: onConfigFormDrawerClose,
  } = useDisclosure();
  const {
    isOpen: isGroupFormDrawerOpen,
    onOpen: onGroupFormDrawerOpen,
    onClose: onGroupFormDrawerClose,
  } = useDisclosure();

  const createConfigMutation = useMutation({
    mutationFn: (values: CreateConfigFormDrawerFormValues) => {
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
      onConfigFormDrawerClose();
    },
  });

  const createGroupMutation = useMutation({
    mutationFn: (values: CreateGroupFormDrawerFormValues) => {
      return gqlClient.request(
        graphql(`
          mutation createGroup($name: String!, $policy: Policy!, $policyParams: [PolicyParam!]) {
            createGroup(name: $name, policy: $policy, policyParams: $policyParams) {
              id
            }
          }
        `),
        values
      );
    },
    onSuccess: (data) => {
      toast({
        title: "Group Created",
        description: `${data.createGroup.id}`,
        status: "success",
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GROUP });
      onGroupFormDrawerClose();
    },
  });

  return (
    <Flex alignItems="center" justifyContent="center" direction="column" h="full" p={6} gap={4}>
      <Heading p={6} rounded="full">
        daed
      </Heading>

      <Button w="full" leftIcon={<CiSquarePlus />} onClick={onConfigFormDrawerOpen}>
        {t("config")}
      </Button>

      <Button w="full" leftIcon={<CiSquarePlus />} onClick={onGroupFormDrawerOpen}>
        {t("group")}
      </Button>

      <Button w="full" leftIcon={<CiImport />} onClick={onConfigFormDrawerOpen}>
        {t("subscription")}
      </Button>

      <Spacer />

      <IconButton
        aria-label={t("dark mode")}
        onClick={toggleColorMode}
        icon={colorMode === "dark" ? <CiLight /> : <CiDark />}
      />

      <Fragment>
        <CreateConfigFormDrawer
          isOpen={isConfigFormDrawerOpen}
          onClose={onConfigFormDrawerClose}
          onSubmit={async (form) => {
            await createConfigMutation.mutateAsync(form.getValues());
          }}
        />

        <CreateGroupFormDrawer
          isOpen={isGroupFormDrawerOpen}
          onClose={onGroupFormDrawerClose}
          onSubmit={async (form) => {
            await createGroupMutation.mutateAsync(form.getValues());
          }}
        />
      </Fragment>
    </Flex>
  );
};
