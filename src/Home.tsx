import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Card,
  CardBody,
  Center,
  Flex,
  Grid,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { useStore } from "@nanostores/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import SimpleBar from "simplebar-react";

import { gqlClient } from "~/api";
import { graphql } from "~/gql";

import SortableGrid from "./components/SortableGrid";
import { QUERY_KEY_CONFIG, QUERY_KEY_GROUP, QUERY_KEY_NODE } from "./constants";
import { ConfigsQuery, NodesQuery } from "./gql/graphql";
import { colsPerRowAtom } from "./store";

export default () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const colsPerRow = useStore(colsPerRowAtom);

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
                <Heading size="md">{t("node")}</Heading>

                <AccordionIcon />
              </Flex>
            </AccordionButton>

            <AccordionPanel>
              <SortableGrid<NodesQuery["nodes"]["edges"]>
                isLoading={nodeQuery.isLoading}
                unSortedItems={nodeQuery.data?.nodes.edges}
                onRemove={(data) => {
                  removeNodeMutation.mutate(data.id);
                }}
              />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem border="none">
            <AccordionButton p={4}>
              <Flex w="full" alignItems="center" justifyContent="space-between">
                <Heading size="md">{t("config")}</Heading>

                <AccordionIcon />
              </Flex>
            </AccordionButton>

            <AccordionPanel>
              <SortableGrid<ConfigsQuery["configs"]>
                isLoading={configQuery.isLoading}
                unSortedItems={configQuery.data?.configs}
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
                <Heading size="md">{t("group")}</Heading>

                <AccordionIcon />
              </Flex>
            </AccordionButton>

            <AccordionPanel>
              <Flex direction="column" gap={4}>
                {groupQuery.isLoading ? (
                  <Center>
                    <Spinner />
                  </Center>
                ) : (
                  <Grid gridTemplateColumns={`repeat(${colsPerRow}, 1fr)`} gap={2}>
                    {groupQuery.data?.groups.map(({ id, ...config }) => (
                      <Card key={id}>
                        <CardBody>{JSON.stringify(config)}</CardBody>
                      </Card>
                    ))}
                  </Grid>
                )}
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </SimpleBar>
    </Flex>
  );
};
