import { Button, Flex, IconButton, Image, Spacer, useColorMode, useDisclosure, useToast } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { CiDark, CiImport, CiLight, CiSquarePlus, CiStreamOff, CiStreamOn } from "react-icons/ci";
import { HiLanguage } from "react-icons/hi2";

import { gqlClient } from "~/api";
import { GET_LOG_LEVEL_STEPS, QUERY_KEY_CONFIG, QUERY_KEY_GROUP, QUERY_KEY_RUNNING } from "~/constants";
import { graphql } from "~/gql";
import i18n from "~/i18n";

import CreateConfigFormDrawer, { FormValues as CreateConfigFormDrawerFormValues } from "./CreateConfigFormDrawer";
import CreateGroupFormDrawer, { FormValues as CreateGroupFormDrawerFormValues } from "./CreateGroupFormDrawer";

export default () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
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

  const isRunningQuery = useQuery(QUERY_KEY_RUNNING, async () =>
    gqlClient.request(
      graphql(`
        query Running {
          general {
            dae {
              running
            }
          }
        }
      `)
    )
  );

  const runMutation = useMutation({
    mutationFn: () => {
      return gqlClient.request(
        graphql(`
          mutation Run($dry: Boolean!) {
            run(dry: $dry)
          }
        `),
        { dry: false }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_RUNNING });
    },
  });

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

  const switchLanguage = () => {
    if (i18n.language.startsWith("zh")) {
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage("zh-Hans");
    }
  };

  return (
    <Flex alignItems="center" justifyContent="center" direction="column" p={6} gap={4}>
      <Image m={10} boxSize={24} borderRadius="md" src="/logo.png" alt="logo" />

      <Button w="full" leftIcon={<CiSquarePlus />} onClick={onConfigFormDrawerOpen}>
        {`${t("create")} ${t("config")}`}
      </Button>

      <Button w="full" leftIcon={<CiSquarePlus />} onClick={onGroupFormDrawerOpen}>
        {`${t("create")} ${t("group")}`}
      </Button>

      <Button w="full" leftIcon={<CiImport />} onClick={onConfigFormDrawerOpen}>
        {`${t("create")} ${t("subscription")}`}
      </Button>

      <Spacer />

      <Flex direction="column" gap={4}>
        <IconButton aria-label={t("switchLanguage")} icon={<HiLanguage />} onClick={switchLanguage} />

        <IconButton
          aria-label={isRunningQuery.data?.general.dae.running ? t("connected") : t("disconnected")}
          icon={isRunningQuery.data?.general.dae.running ? <CiStreamOn /> : <CiStreamOff />}
          onClick={() => {
            if (isRunningQuery.data?.general.dae.running) {
              return;
            }

            runMutation.mutate();
          }}
        />

        <IconButton
          aria-label={t("dark mode")}
          icon={colorMode === "dark" ? <CiDark /> : <CiLight />}
          onClick={toggleColorMode}
        />
      </Flex>

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
