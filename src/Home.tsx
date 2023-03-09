import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Heading,
  List,
  ListItem,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { gqlClient } from "~/api";
import { graphql } from "~/gql";
import { SortableList } from "~/typings";

import { QUERY_KEY_CONFIG, QUERY_KEY_GROUP, QUERY_KEY_NODE, QUERY_KEY_SUBSCRIPTION } from "./constants";
import SortableGrid, { SortableGridProps } from "./libraries/SortableGrid";

const Section = <T extends SortableList>({
  name,
  isLoading,
  unSortedItems,
  onSelect,
  onRemove,
  persistentSortableKeysName,
  children,
}: {
  name: string;
} & SortableGridProps<T>) => {
  return (
    <AccordionItem border="none">
      <AccordionButton p={4}>
        <Flex w="full" alignItems="center" justifyContent="space-between">
          <Heading size="md">
            {name} ({unSortedItems?.length || 0})
          </Heading>

          <AccordionIcon />
        </Flex>
      </AccordionButton>

      <AccordionPanel>
        <SortableGrid<T>
          isLoading={isLoading}
          unSortedItems={unSortedItems}
          onSelect={onSelect}
          onRemove={onRemove}
          persistentSortableKeysName={persistentSortableKeysName}
        >
          {children}
        </SortableGrid>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

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
    <Accordion allowToggle>
      <Section
        name={t("node")}
        isLoading={nodeQuery.isLoading}
        unSortedItems={nodeQuery.data?.nodes.edges}
        persistentSortableKeysName="nodeSortableKeys"
        onRemove={(data) => {
          removeNodeMutation.mutate(data.id);
        }}
      >
        {(data) => (
          <List>
            {Object.entries(data).map(([name, value], i) => (
              <ListItem key={i}>
                {name}: {JSON.stringify(value)}
              </ListItem>
            ))}
          </List>
        )}
      </Section>

      <Section
        name={t("subscription")}
        isLoading={subscriptionQuery.isLoading}
        unSortedItems={subscriptionQuery.data?.subscriptions}
        onRemove={(data) => {
          removeSubscriptionMutation.mutate(data.id);
        }}
        persistentSortableKeysName="subscriptionSortableKeys"
      >
        {(data) => (
          <List>
            {Object.entries(data).map(([name, value], i) => (
              <ListItem key={i}>
                {name}: {JSON.stringify(value)}
              </ListItem>
            ))}
          </List>
        )}
      </Section>

      <Section
        name={t("config")}
        isLoading={configQuery.isLoading}
        unSortedItems={configQuery.data?.configs}
        onSelect={(data) => {
          selectConfigMutation.mutate(data.id);
        }}
        onRemove={(data) => {
          removeConfigMutation.mutate(data.id);
        }}
        persistentSortableKeysName="configSortableKeys"
      >
        {(data) => (
          <List>
            {Object.entries(data).map(([name, value], i) => (
              <ListItem key={i}>
                {name}: {JSON.stringify(value)}
              </ListItem>
            ))}
          </List>
        )}
      </Section>

      <Section
        name={t("group")}
        isLoading={groupQuery.isLoading}
        unSortedItems={groupQuery.data?.groups}
        onRemove={(data) => {
          removeGroupMutation.mutate(data.id);
        }}
        persistentSortableKeysName="groupSortableKeys"
      >
        {(data) => (
          <List>
            {Object.entries(data).map(([name, value], i) => (
              <ListItem as={Flex} key={i}>
                <Flex>{name}</Flex>: <Flex>{JSON.stringify(value)}</Flex>
              </ListItem>
            ))}
          </List>
        )}
      </Section>
    </Accordion>
  );
};
