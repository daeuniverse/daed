import { AddIcon, LinkIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Flex,
  Icon,
  IconButton,
  Image,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spacer,
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useStore } from "@nanostores/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, useMotionValue, useMotionValueEvent, useSpring } from "framer-motion";
import { Fragment, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CiStreamOff, CiStreamOn } from "react-icons/ci";
import { HiLanguage } from "react-icons/hi2";

import { gqlClient } from "~/api";
import {
  COLS_PER_ROW,
  GET_LOG_LEVEL_STEPS,
  QUERY_KEY_CONFIG,
  QUERY_KEY_GROUP,
  QUERY_KEY_NODE,
  QUERY_KEY_RUNNING,
  QUERY_KEY_SUBSCRIPTION,
} from "~/constants";
import { graphql } from "~/gql";
import { ConfigsQuery } from "~/gql/graphql";
import i18n from "~/i18n";
import { appStateAtom } from "~/store";

import CreateConfigFormDrawer, { FormValues as CreateConfigFormDrawerFormValues } from "./CreateConfigFormDrawer";
import CreateGroupFormDrawer, { FormValues as CreateGroupFormDrawerFormValues } from "./CreateGroupFormDrawer";
import ImportNodeFormDrawer, { FormValues as ImportNodeFormDrawerFormValues } from "./ImportNodeFormDrawer";
import ImportSubscriptionFormDrawer, {
  FormValues as ImportSubscriptionFormDrawerFormValues,
} from "./ImportSubscriptionFormDrawer";

export default () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const { colsPerRow } = useStore(appStateAtom);

  const {
    isOpen: isConfigFormDrawerOpen,
    onOpen: onConfigFormDrawerOpen,
    onClose: onConfigFormDrawerClose,
  } = useDisclosure();
  const {
    isOpen: isSubscriptionFormDrawerOpen,
    onOpen: onSubscriptionFormDrawerOpen,
    onClose: onSubscriptionFormDrawerClose,
  } = useDisclosure();
  const {
    isOpen: isGroupFormDrawerOpen,
    onOpen: onGroupFormDrawerOpen,
    onClose: onGroupFormDrawerClose,
  } = useDisclosure();
  const {
    isOpen: isNodeFormDrawerOpen,
    onOpen: onNodeFormDrawerOpen,
    onClose: onNodeFormDrawerClose,
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

  const importNodesMutation = useMutation({
    mutationFn: (values: ImportNodeFormDrawerFormValues) => {
      return gqlClient.request(
        graphql(`
          mutation importNodes($rollbackError: Boolean!, $args: [ImportArgument!]!) {
            importNodes(rollbackError: $rollbackError, args: $args) {
              link
              error
            }
          }
        `),
        {
          rollbackError: true,
          args: values.nodes,
        }
      );
    },
    onSuccess: () => {
      toast({ status: "success" });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_NODE });
      onNodeFormDrawerClose();
    },
  });

  const importSubscriptionMutation = useMutation({
    mutationFn: (values: ImportSubscriptionFormDrawerFormValues) => {
      return gqlClient.request(
        graphql(`
          mutation importSubscription($rollbackError: Boolean!, $arg: ImportArgument!) {
            importSubscription(rollbackError: $rollbackError, arg: $arg) {
              link
            }
          }
        `),
        {
          rollbackError: true,
          arg: values.subscription,
        }
      );
    },
    onSuccess: () => {
      toast({ status: "success" });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_SUBSCRIPTION });
      onSubscriptionFormDrawerClose();
    },
  });

  const createConfigMutation = useMutation({
    mutationFn: (values: CreateConfigFormDrawerFormValues) => {
      const {
        logLevelIndex,
        checkIntervalSeconds,
        checkTolerenceMS: checkTolerenceMS,
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
            checkInterval: `${checkIntervalSeconds}s`,
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
        title: `${data.createConfig.id}`,
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
        title: `${data.createGroup.id}`,
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

  const platform = useRef<HTMLDivElement>(null);
  const dae = useRef<HTMLImageElement>(null);
  const [showSave, setShowSave] = useState(false);
  const x = useMotionValue(0);
  const y = useSpring(0);

  useMotionValueEvent(y, "change", (latest) => {
    const platformBottomLimit = platform.current?.clientHeight;
    const daeHeight = dae.current?.clientHeight;

    if (!platformBottomLimit || !daeHeight) {
      return;
    }

    setShowSave(latest >= platformBottomLimit - daeHeight);
  });

  return (
    <Flex
      ref={platform}
      h="full"
      alignItems="center"
      justifyContent="center"
      direction="column"
      px={2}
      pt={6}
      pb={12}
      gap={4}
    >
      <motion.div
        drag
        style={{ x, y, zIndex: Number.MAX_SAFE_INTEGER, height: showSave ? 0 : "auto" }}
        dragConstraints={{ left: 0, right: 0, top: 0 }}
      >
        <Image ref={dae} draggable={false} m={10} boxSize={24} rounded="md" src="/logo.svg" alt="logo" />
      </motion.div>

      <Button w="full" leftIcon={<LinkIcon />} onClick={onNodeFormDrawerOpen}>
        {`${t("import")} ${t("node")}`}
      </Button>

      <Button w="full" leftIcon={<LinkIcon />} onClick={onSubscriptionFormDrawerOpen}>
        {`${t("import")} ${t("subscription")}`}
      </Button>

      <Button w="full" leftIcon={<AddIcon />} onClick={onConfigFormDrawerOpen}>
        {`${t("create")} ${t("config")}`}
      </Button>

      <Button w="full" leftIcon={<AddIcon />} onClick={onGroupFormDrawerOpen}>
        {`${t("create")} ${t("group")}`}
      </Button>

      <Spacer />

      <Flex direction="column" gap={4}>
        <Slider
          min={1}
          max={5}
          defaultValue={COLS_PER_ROW}
          value={colsPerRow}
          textAlign="center"
          onChange={(colsPerRow) => appStateAtom.setKey("colsPerRow", colsPerRow)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>

          <SliderThumb />
        </Slider>

        <Flex gap={4}>
          <IconButton
            aria-label={isRunningQuery.data?.general.dae.running ? t("connected") : t("disconnected")}
            icon={<Icon as={isRunningQuery.data?.general.dae.running ? CiStreamOn : CiStreamOff} />}
            onClick={() => {
              if (isRunningQuery.data?.general.dae.running) {
                return;
              }

              if (!queryClient.getQueryData<ConfigsQuery>(QUERY_KEY_CONFIG)?.configs.some(({ selected }) => selected)) {
                toast({
                  title: t("please select a config first"),
                  status: "error",
                });

                return;
              }

              runMutation.mutate();
            }}
          />

          <IconButton aria-label={t("switchLanguage")} icon={<Icon as={HiLanguage} />} onClick={switchLanguage} />

          <IconButton
            aria-label={t("dark mode")}
            icon={<Icon as={colorMode === "dark" ? MoonIcon : SunIcon} />}
            onClick={toggleColorMode}
          />
        </Flex>

        {showSave && (
          <Center alignItems="center">
            <Button onClick={() => y.jump(0)}>Save the goose</Button>
          </Center>
        )}
      </Flex>

      <Fragment>
        <ImportNodeFormDrawer
          isOpen={isNodeFormDrawerOpen}
          onClose={onNodeFormDrawerClose}
          onSubmit={async (form) => {
            await importNodesMutation.mutateAsync(form.getValues());
          }}
        />

        <ImportSubscriptionFormDrawer
          isOpen={isSubscriptionFormDrawerOpen}
          onClose={onSubscriptionFormDrawerClose}
          onSubmit={async (form) => {
            await importSubscriptionMutation.mutateAsync(form.getValues());
          }}
        />

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
