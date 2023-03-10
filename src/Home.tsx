import { Accordion, SimpleGrid } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { gqlClient } from "~/api";
import Section from "~/components/Section";
import { QUERY_KEY_CONFIG, QUERY_KEY_GROUP, QUERY_KEY_NODE, QUERY_KEY_SUBSCRIPTION } from "~/constants";
import { graphql } from "~/gql";
import SimpleDisplay from "~/libraries/SimpleDisplay";

export default () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

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
            <SimpleDisplay name={t("address")} value={data.address} encrypt />
            <SimpleDisplay name={t("protocol")} value={data.protocol} />
            <SimpleDisplay name={t("link")} value={data.link} encrypt />
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
            <SimpleDisplay name={t("link")} value={data.link} encrypt />
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
  );
};
