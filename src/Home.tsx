import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { useStore } from "@nanostores/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import SimpleBar from "simplebar-react";

import { QUERY_KEY_CONFIG, QUERY_KEY_GROUP, QUERY_KEY_NODE, QUERY_KEY_SUBSCRIPTION } from "./constants";
import { ConfigsQuery, GroupsQuery, NodesQuery, SubscriptionsQuery } from "./gql/graphql";
import SortableGrid from "./libraries/SortableGrid";
import { appStateAtom } from "./store";

import { graphql } from "~/gql";
import { gqlClient } from "~/api";

export default () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const appState = useStore(appStateAtom);

  const configQuery = useQuery(QUERY_KEY_CONFIG, async () =>
    gqlClient.request(
      graphql(`
        query Configs {
          configs {
            id
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
    )
  );

  const subscriptionQuery = useQuery(QUERY_KEY_SUBSCRIPTION, async () =>
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
    )
  );

  const nodeQuery = useQuery(QUERY_KEY_NODE, async () =>
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
    )
  );

  const groupQuery = useQuery(QUERY_KEY_GROUP, async () =>
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
    )
  );

  const removeNodeMutation = useMutation({
    mutationFn: async (id: string) => {
      return gqlClient.request(
        graphql(`
          mutation removeNodes($ids: [ID!]!) {
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

  const removeSubscriptionMutation = useMutation({
    mutationFn: async (id: string) => {
      return gqlClient.request(
        graphql(`
          mutation removeSubscriptions($ids: [ID!]!) {
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

  const selectConfigMutation = useMutation({
    mutationFn: async (id: string) => {
      return gqlClient.request(
        graphql(`
          mutation selectConfig($id: ID!) {
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
          mutation removeConfig($id: ID!) {
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

  const removeGroupMutation = useMutation({
    mutationFn: async (id: string) => {
      return gqlClient.request(
        graphql(`
          mutation removeGroup($id: ID!) {
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
    <Flex flex={1} h="100dvh" overflowY="hidden" direction="column" gap={4} px={4} py={6}>
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
        <Accordion allowToggle>
          <AccordionItem border="none">
            <AccordionButton p={4}>
              <Flex w="full" alignItems="center" justifyContent="space-between">
                <Heading size="md">
                  {t("node")} ({nodeQuery.data?.nodes.edges.length || 0})
                </Heading>

                <AccordionIcon />
              </Flex>
            </AccordionButton>

            <AccordionPanel>
              <SortableGrid<NodesQuery["nodes"]["edges"]>
                isLoading={nodeQuery.isLoading}
                unSortedItems={nodeQuery.data?.nodes.edges}
                defaultSortableKeys={appState.nodeSortableKeys}
                onSort={(sortableKeys) => {
                  appStateAtom.setKey("nodeSortableKeys", sortableKeys);
                }}
                onRemove={(data) => {
                  removeNodeMutation.mutate(data.id);
                }}
              />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem border="none">
            <AccordionButton p={4}>
              <Flex w="full" alignItems="center" justifyContent="space-between">
                <Heading size="md">
                  {t("subscription")} ({subscriptionQuery.data?.subscriptions.length || 0})
                </Heading>

                <AccordionIcon />
              </Flex>
            </AccordionButton>

            <AccordionPanel>
              <SortableGrid<SubscriptionsQuery["subscriptions"]>
                isLoading={subscriptionQuery.isLoading}
                unSortedItems={subscriptionQuery.data?.subscriptions}
                defaultSortableKeys={appState.subscriptionSortableKeys}
                onSort={(sortableKeys) => {
                  appStateAtom.setKey("subscriptionSortableKeys", sortableKeys);
                }}
                onRemove={(data) => {
                  removeSubscriptionMutation.mutate(data.id);
                }}
              />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem border="none">
            <AccordionButton p={4}>
              <Flex w="full" alignItems="center" justifyContent="space-between">
                <Heading size="md">
                  {t("config")} ({configQuery.data?.configs.length || 0})
                </Heading>

                <AccordionIcon />
              </Flex>
            </AccordionButton>

            <AccordionPanel>
              <SortableGrid<ConfigsQuery["configs"]>
                isLoading={configQuery.isLoading}
                unSortedItems={configQuery.data?.configs}
                defaultSortableKeys={appState.configSortableKeys}
                onSort={(sortableKeys) => {
                  appStateAtom.setKey("configSortableKeys", sortableKeys);
                }}
                onSelect={(data) => {
                  selectConfigMutation.mutate(data.id);
                }}
                onRemove={(data) => {
                  removeConfigMutation.mutate(data.id);
                }}
              />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem border="none">
            <AccordionButton p={4}>
              <Flex w="full" alignItems="center" justifyContent="space-between">
                <Heading size="md">
                  {t("group")} ({groupQuery.data?.groups.length || 0})
                </Heading>

                <AccordionIcon />
              </Flex>
            </AccordionButton>

            <AccordionPanel>
              <SortableGrid<GroupsQuery["groups"]>
                isLoading={groupQuery.isLoading}
                unSortedItems={groupQuery.data?.groups}
                defaultSortableKeys={appState.groupSortableKeys}
                onSort={(sortableKeys) => {
                  appStateAtom.setKey("groupSortableKeys", sortableKeys);
                }}
                onRemove={(data) => {
                  removeGroupMutation.mutate(data.id);
                }}
              />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </SimpleBar>
    </Flex>
  );
};
