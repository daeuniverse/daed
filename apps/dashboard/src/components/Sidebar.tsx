import { AddIcon, LinkIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Flex,
  Heading,
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
import { i18n } from "@daed/i18n";
import { graphql } from "@daed/schemas/gql";
import { ConfigsQuery } from "@daed/schemas/gql/graphql";
import { useStore } from "@nanostores/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, useMotionValue, useMotionValueEvent, useSpring } from "framer-motion";
import { Fragment, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CiStreamOff, CiStreamOn } from "react-icons/ci";
import { HiLanguage } from "react-icons/hi2";

import {
  COLS_PER_ROW,
  GET_LOG_LEVEL_STEPS,
  QUERY_KEY_CONFIG,
  QUERY_KEY_DNS,
  QUERY_KEY_GROUP,
  QUERY_KEY_NODE,
  QUERY_KEY_ROUTING,
  QUERY_KEY_RUNNING,
  QUERY_KEY_SUBSCRIPTION,
} from "~/constants";
import { useQGLQueryClient } from "~/hooks";
import { appStateAtom } from "~/store";

import { CreateConfigFormDrawer, FormValues as CreateConfigFormDrawerFormValues } from "./CreateConfigFormDrawer";
import { CreateDNSFormDrawer, FormValues as CreateDNSFormDrawerFormValues } from "./CreateDNSFormDrawer";
import { CreateGroupFormDrawer, FormValues as CreateGroupFormDrawerFormValues } from "./CreateGroupFormDrawer";
import { CreateRoutingFormDrawer, FormValues as CreateRoutingFormDrawerFormValues } from "./CreateRoutingFormDrawer";
import { FormValues as ImportNodeFormDrawerFormValues, ImportNodeFormDrawer } from "./ImportNodeFormDrawer";
import {
  FormValues as ImportSubscriptionFormDrawerFormValues,
  ImportSubscriptionFormDrawer,
} from "./ImportSubscriptionFormDrawer";

export const Sidebar = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const gqlClient = useQGLQueryClient();
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
  const {
    isOpen: isRoutingFormDrawerOpen,
    onOpen: onRoutingFormDrawerOpen,
    onClose: onRoutingFormDrawerClose,
  } = useDisclosure();
  const { isOpen: isDNSFormDrawerOpen, onOpen: onDNSFormDrawerOpen, onClose: onDNSFormDrawerClose } = useDisclosure();

  const isRunningQuery = useQuery({
    queryKey: QUERY_KEY_RUNNING,
    queryFn: async () =>
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
      ),
  });

  const runMutation = useMutation({
    mutationFn: (run: boolean) => {
      return gqlClient.request(
        graphql(`
          mutation Run($dry: Boolean!) {
            run(dry: $dry)
          }
        `),
        { dry: !run }
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
          mutation ImportNodes($rollbackError: Boolean!, $args: [ImportArgument!]!) {
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
      toast({ title: t("success"), status: "success" });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_NODE });
      onNodeFormDrawerClose();
    },
  });

  const importSubscriptionMutation = useMutation({
    mutationFn: (values: ImportSubscriptionFormDrawerFormValues) => {
      return gqlClient.request(
        graphql(`
          mutation ImportSubscription($rollbackError: Boolean!, $arg: ImportArgument!) {
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
      toast({ title: t("success"), status: "success" });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_SUBSCRIPTION });
      onSubscriptionFormDrawerClose();
    },
  });

  const createConfigMutation = useMutation({
    mutationFn: (values: CreateConfigFormDrawerFormValues) => {
      const {
        name,
        global: { logLevelIndex, checkIntervalSeconds, checkTolerenceMS: checkTolerenceMS, ...global },
      } = values;

      return gqlClient.request(
        graphql(`
          mutation CreateConfig($name: String, $global: globalInput) {
            createConfig(name: $name, global: $global) {
              id
            }
          }
        `),
        {
          name,
          global: {
            logLevel: GET_LOG_LEVEL_STEPS(t)[logLevelIndex][1],
            checkInterval: `${checkIntervalSeconds}s`,
            checkTolerance: `${checkTolerenceMS}ms`,
            ...global,
          },
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

  const createRoutingMutation = useMutation({
    mutationFn: (values: CreateRoutingFormDrawerFormValues) => {
      const { name, routing } = values;

      return gqlClient.request(
        graphql(`
          mutation CreateRouting($name: String!, $routing: String) {
            createRouting(name: $name, routing: $routing) {
              id
            }
          }
        `),
        { name, routing }
      );
    },
    onSuccess: (data) => {
      toast({
        title: `${data.createRouting.id}`,
        status: "success",
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_ROUTING });
      onRoutingFormDrawerClose();
    },
  });

  const createDNSMutation = useMutation({
    mutationFn: (values: CreateDNSFormDrawerFormValues) => {
      const { name, dns } = values;

      return gqlClient.request(
        graphql(`
          mutation CreateDns($name: String!, $dns: String) {
            createDns(name: $name, dns: $dns) {
              id
            }
          }
        `),
        { name, dns }
      );
    },
    onSuccess: (data) => {
      toast({
        title: `${data.createDns.id}`,
        status: "success",
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_DNS });
      onDNSFormDrawerClose();
    },
  });

  const createGroupMutation = useMutation({
    mutationFn: (values: CreateGroupFormDrawerFormValues) => {
      const { policyParams, ...data } = values;

      return gqlClient.request(
        graphql(`
          mutation CreateGroup($name: String!, $policy: Policy!, $policyParams: [PolicyParam!]) {
            createGroup(name: $name, policy: $policy, policyParams: $policyParams) {
              id
            }
          }
        `),
        { policyParams: policyParams.filter((param) => !!param.val), ...data }
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
    <Flex ref={platform} h="full" alignItems="center" justifyContent="center" direction="column" px={10} pt={4}>
      <motion.div
        drag
        style={{
          x,
          y,
          height: showSave ? 0 : "auto",
          marginBlock: 20,
          zIndex: Number.MAX_SAFE_INTEGER,
          touchAction: "none",
        }}
        dragConstraints={{ left: 0, right: 0, top: 0 }}
        whileHover={{
          rotate: 360,
          transition: {
            duration: 0.3,
          },
        }}
      >
        <Image ref={dae} draggable={false} boxSize={24} rounded="md" src="/logo.svg" alt="logo" />
      </motion.div>

      <Flex w="full" direction="column" gap={4}>
        <Heading as="h1" textAlign="center">
          daed
        </Heading>

        <Button w="full" leftIcon={<LinkIcon />} onClick={onNodeFormDrawerOpen}>
          {`${t("actions.import")} ${t("node")}`}
        </Button>

        <Button w="full" leftIcon={<LinkIcon />} onClick={onSubscriptionFormDrawerOpen}>
          {`${t("actions.import")} ${t("subscription")}`}
        </Button>

        <Button w="full" leftIcon={<AddIcon />} onClick={onConfigFormDrawerOpen}>
          {`${t("actions.create")} ${t("config")}`}
        </Button>

        <Button w="full" leftIcon={<AddIcon />} onClick={onRoutingFormDrawerOpen}>
          {`${t("actions.create")} ${t("routing")}`}
        </Button>

        <Button w="full" leftIcon={<AddIcon />} onClick={onDNSFormDrawerOpen}>
          {`${t("actions.create")} ${t("dns")}`}
        </Button>

        <Button w="full" leftIcon={<AddIcon />} onClick={onGroupFormDrawerOpen}>
          {`${t("actions.create")} ${t("group")}`}
        </Button>
      </Flex>

      <Spacer />

      <Flex direction="column" gap={6}>
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
            isLoading={runMutation.isLoading}
            aria-label={isRunningQuery.data?.general.dae.running ? t("connected") : t("disconnected")}
            icon={
              <Icon
                as={isRunningQuery.data?.general.dae.running ? CiStreamOn : CiStreamOff}
                color={isRunningQuery.data?.general.dae.running ? "Highlight" : ""}
              />
            }
            onClick={() => {
              if (!queryClient.getQueryData<ConfigsQuery>(QUERY_KEY_CONFIG)?.configs.some(({ selected }) => selected)) {
                toast({
                  title: t("please select a config first"),
                  status: "error",
                });

                return;
              } else {
                runMutation.mutate(!isRunningQuery.data?.general.dae.running);
              }
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
            <Button onClick={() => y.jump(0)}>{t("actions.save dae")}</Button>
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

        <CreateRoutingFormDrawer
          isOpen={isRoutingFormDrawerOpen}
          onClose={onRoutingFormDrawerClose}
          onSubmit={async (form) => {
            await createRoutingMutation.mutateAsync(form.getValues());
          }}
        />

        <CreateDNSFormDrawer
          isOpen={isDNSFormDrawerOpen}
          onClose={onDNSFormDrawerClose}
          onSubmit={async (form) => {
            await createDNSMutation.mutateAsync(form.getValues());
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
