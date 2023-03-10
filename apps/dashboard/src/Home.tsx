import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { Accordion, Collapse, Flex, Icon, IconButton, Progress, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import { SimpleDisplay } from "@daed/components";
import { graphql } from "@daed/schemas/gql";
import { useIsFetching, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import SimpleBar from "simplebar-react";

import { Section } from "~/components/Section";
import { Sidebar } from "~/components/Sidebar";
import {
  QUERY_KEY_CONFIG,
  QUERY_KEY_DNS,
  QUERY_KEY_GROUP,
  QUERY_KEY_NODE,
  QUERY_KEY_ROUTING,
  QUERY_KEY_SUBSCRIPTION,
} from "~/constants";

import { useQGLQueryClient } from "./hooks";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();

  const { isOpen: isSidebarOpen, onToggle: onSidebarToggle } = useDisclosure({
    defaultIsOpen: true,
  });
  const fetching = useIsFetching();

  return (
    <Flex h="100dvh" px={4} py={12}>
      {fetching > 0 && <Progress isIndeterminate pos="fixed" top={2} left={0} right={0} mx={4} rounded="md" />}

      <Flex>
        <IconButton
          aria-label={t("collapse")}
          h="full"
          icon={<Icon as={isSidebarOpen ? ArrowLeftIcon : ArrowRightIcon} />}
          onClick={onSidebarToggle}
        />

        <Collapse
          in={isSidebarOpen}
          animateOpacity
          transition={{
            enter: { duration: 0.2 },
            exit: { duration: 0.2 },
          }}
        >
          <Sidebar />
        </Collapse>
      </Flex>

      <Flex flex={1} overflowY="hidden">
        <SimpleBar
          style={{
            width: "100%",
            height: "100%",
            paddingInline: 10,
            paddingBlock: 20,
            borderRadius: 12,
            borderWidth: 4,
            borderColor: "Highlight",
          }}
        >
          {children}
        </SimpleBar>
      </Flex>
    </Flex>
  );
};

export const Home = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const gqlClient = useQGLQueryClient();

  const nodeQuery = useQuery({
    queryKey: QUERY_KEY_NODE,
    queryFn: async () =>
      gqlClient.request(
        graphql(`
          query Nodes {
            nodes {
              edges {
                id
                link
                name
                address
                protocol
                tag
              }
            }
          }
        `)
      ),
  });

  const removeNodeMutation = useMutation({
    mutationFn: async (id: string) => {
      return gqlClient.request(
        graphql(`
          mutation RemoveNodes($ids: [ID!]!) {
            removeNodes(ids: $ids)
          }
        `),
        { ids: [id] }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_NODE });
    },
  });

  const subscriptionQuery = useQuery({
    queryKey: QUERY_KEY_SUBSCRIPTION,
    queryFn: async () =>
      gqlClient.request(
        graphql(`
          query Subscriptions {
            subscriptions {
              id
              tag
              link
              nodes {
                edges {
                  id
                  link
                  name
                  protocol
                  tag
                }
              }
            }
          }
        `)
      ),
  });

  const removeSubscriptionMutation = useMutation({
    mutationFn: async (id: string) => {
      return gqlClient.request(
        graphql(`
          mutation RemoveSubscriptions($ids: [ID!]!) {
            removeSubscriptions(ids: $ids)
          }
        `),
        { ids: [id] }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_SUBSCRIPTION });
    },
  });

  const configQuery = useQuery({
    queryKey: QUERY_KEY_CONFIG,
    queryFn: async () =>
      gqlClient.request(
        graphql(`
          query Configs {
            configs {
              id
              name
              selected
              global {
                tproxyPort
                logLevel
                tcpCheckUrl
                udpCheckDns
                checkInterval
                checkTolerance
                lanInterface
                wanInterface
                allowInsecure
                dialMode
              }
            }
          }
        `)
      ),
  });

  const selectConfigMutation = useMutation({
    mutationFn: async (id: string) => {
      return gqlClient.request(
        graphql(`
          mutation SelectConfig($id: ID!) {
            selectConfig(id: $id)
          }
        `),
        { id }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_CONFIG });
    },
  });

  const removeConfigMutation = useMutation({
    mutationFn: async (id: string) => {
      return gqlClient.request(
        graphql(`
          mutation RemoveConfig($id: ID!) {
            removeConfig(id: $id)
          }
        `),
        { id }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_CONFIG });
    },
  });

  const routingQuery = useQuery({
    queryKey: QUERY_KEY_ROUTING,
    queryFn: async () =>
      gqlClient.request(
        graphql(`
          query Routings {
            routings {
              id
              name
              selected
              routing {
                string
              }
            }
          }
        `)
      ),
  });

  const selectRoutingMutation = useMutation({
    mutationFn: async (id: string) => {
      return gqlClient.request(
        graphql(`
          mutation SelectRouting($id: ID!) {
            selectRouting(id: $id)
          }
        `),
        { id }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_ROUTING });
    },
  });

  const removeRoutingMutation = useMutation({
    mutationFn: async (id: string) => {
      return gqlClient.request(
        graphql(`
          mutation RemoveRouting($id: ID!) {
            removeRouting(id: $id)
          }
        `),
        { id }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_ROUTING });
    },
  });

  const dnsQuery = useQuery({
    queryKey: QUERY_KEY_DNS,
    queryFn: async () =>
      gqlClient.request(
        graphql(`
          query Dnss {
            dnss {
              id
              name
              selected
              dns {
                string
              }
            }
          }
        `)
      ),
  });

  const selectDNSMutation = useMutation({
    mutationFn: async (id: string) => {
      return gqlClient.request(
        graphql(`
          mutation SelectDNS($id: ID!) {
            selectDns(id: $id)
          }
        `),
        { id }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_DNS });
    },
  });

  const removeDNSMutation = useMutation({
    mutationFn: async (id: string) => {
      return gqlClient.request(
        graphql(`
          mutation RemoveDns($id: ID!) {
            removeDns(id: $id)
          }
        `),
        { id }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_DNS });
    },
  });

  const groupQuery = useQuery({
    queryKey: QUERY_KEY_GROUP,
    queryFn: async () =>
      gqlClient.request(
        graphql(`
          query Groups {
            groups {
              id
              name
              policy
              policyParams {
                key
                val
              }
            }
          }
        `)
      ),
  });

  const removeGroupMutation = useMutation({
    mutationFn: async (id: string) => {
      return gqlClient.request(
        graphql(`
          mutation RemoveGroup($id: ID!) {
            removeGroup(id: $id)
          }
        `),
        { id }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GROUP });
    },
  });

  return (
    <Layout>
      <Accordion allowToggle fontFamily={`"Source Code Pro", monospace`}>
        <Section
          name={t("node")}
          isLoading={nodeQuery.isLoading}
          unSortedItems={nodeQuery.data?.nodes.edges}
          persistentSortableKeysName="nodeSortableKeys"
          onRemove={(data) => removeNodeMutation.mutate(data.id)}
        >
          {(data) => (
            <SimpleGrid gap={2}>
              <SimpleDisplay name={t("name")} value={data.name} />
              <SimpleDisplay name={t("tag")} value={data.tag} />
              <SimpleDisplay name={t("address")} value={data.address} defaultEncrypted />
              <SimpleDisplay name={t("protocol")} value={data.protocol} />
              <SimpleDisplay name={t("link")} value={data.link} defaultEncrypted />
            </SimpleGrid>
          )}
        </Section>

        <Section
          name={t("subscription")}
          isLoading={subscriptionQuery.isLoading}
          unSortedItems={subscriptionQuery.data?.subscriptions}
          onRemove={(data) => removeSubscriptionMutation.mutate(data.id)}
          persistentSortableKeysName="subscriptionSortableKeys"
        >
          {(data) => (
            <SimpleGrid gap={2}>
              <SimpleDisplay name={t("link")} value={data.link} defaultEncrypted />
              <SimpleDisplay name={t("tag")} value={data.tag} />
            </SimpleGrid>
          )}
        </Section>

        <Section
          name={t("config")}
          isLoading={configQuery.isLoading}
          unSortedItems={configQuery.data?.configs}
          onSelect={(data) => selectConfigMutation.mutate(data.id)}
          onRemove={(data) => removeConfigMutation.mutate(data.id)}
          persistentSortableKeysName="configSortableKeys"
        >
          {(data) => (
            <SimpleGrid gap={2}>
              <SimpleDisplay name={t("name")} value={data.name} />
              <SimpleDisplay name={t("tproxyPort")} value={data.global.tproxyPort} />
              <SimpleDisplay name={t("logLevel")} value={data.global.logLevel} />
              <SimpleDisplay name={t("tcpCheckUrl")} value={data.global.tcpCheckUrl} />
              <SimpleDisplay name={t("udpCheckDns")} value={data.global.udpCheckDns} />
              <SimpleDisplay name={t("checkInterval")} value={data.global.checkInterval} />
              <SimpleDisplay name={t("checkTolerance")} value={data.global.checkTolerance} />
              <SimpleDisplay name={t("lanInterface")} value={data.global.lanInterface} />
              <SimpleDisplay name={t("wanInterface")} value={data.global.wanInterface} />
              <SimpleDisplay name={t("allowInsecure")} value={data.global.allowInsecure} />
            </SimpleGrid>
          )}
        </Section>

        <Section
          name={t("routing")}
          isLoading={routingQuery.isLoading}
          unSortedItems={routingQuery.data?.routings}
          onSelect={(data) => selectRoutingMutation.mutate(data.id)}
          onRemove={(data) => removeRoutingMutation.mutate(data.id)}
          persistentSortableKeysName="routingSortableKeys"
        >
          {(data) => (
            <SimpleGrid gap={2}>
              <SimpleDisplay name={t("name")} value={data.name} />
              <SimpleDisplay name={t("routing")} value={data.routing.string} />
            </SimpleGrid>
          )}
        </Section>

        <Section
          name={t("dns")}
          isLoading={dnsQuery.isLoading}
          unSortedItems={dnsQuery.data?.dnss}
          onSelect={(data) => selectDNSMutation.mutate(data.id)}
          onRemove={(data) => removeDNSMutation.mutate(data.id)}
          persistentSortableKeysName="dnsSortableKeys"
        >
          {(data) => (
            <SimpleGrid gap={2}>
              <SimpleDisplay name={t("name")} value={data.name} />
              <SimpleDisplay name={t("dns")} value={data.dns.string} />
            </SimpleGrid>
          )}
        </Section>

        <Section
          name={t("group")}
          isLoading={groupQuery.isLoading}
          unSortedItems={groupQuery.data?.groups}
          onRemove={(data) => removeGroupMutation.mutate(data.id)}
          persistentSortableKeysName="groupSortableKeys"
        >
          {(data) => (
            <SimpleGrid gap={2}>
              <SimpleDisplay name={t("name")} value={data.name} />
              <SimpleDisplay name={t("policy")} value={data.policy} />
              <SimpleDisplay name={t("policyParams")} value={data.policyParams} />
            </SimpleGrid>
          )}
        </Section>
      </Accordion>
    </Layout>
  );
};
