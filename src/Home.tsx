import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
  Grid,
  Heading,
  IconButton,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import { closestCenter, DndContext, UniqueIdentifier } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useStore } from "@nanostores/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoMoveSharp } from "react-icons/io5";
import SimpleBar from "simplebar-react";

import { gqlClient } from "~/api";
import { graphql } from "~/gql";

import WithConfirmRemoveButton from "./components/WithConfirmRemoveButton";
import { QUERY_KEY_CONFIG, QUERY_KEY_GROUP, QUERY_KEY_NODE } from "./constants";
import { colsPerRowAtom } from "./store";

const DraggableCard = <T extends { id: UniqueIdentifier } & Record<string, unknown>>({
  data,
  onSelect,
  onRemove,
}: {
  data: T;
  onSelect?: () => void;
  onRemove: () => void;
}) => {
  const { t } = useTranslation();
  const { listeners, attributes, setNodeRef, isDragging, transform, transition } = useSortable({
    id: data.id,
  });

  return (
    <Card
      ref={setNodeRef}
      bg={data.selected ? "Highlight" : ""}
      size="sm"
      style={{
        zIndex: isDragging ? Number.MAX_SAFE_INTEGER : 0,
        transform: CSS.Translate.toString(transform),
        transition,
      }}
    >
      <CardHeader as={Flex} gap={2} alignItems="center">
        <IconButton aria-label={t("select")} icon={<IoMoveSharp />} {...listeners} {...attributes} />

        <Tooltip hasArrow label={data.id} placement="top">
          <Button size="sm" flex={1} noOfLines={1} onClick={() => onSelect && onSelect()}>
            {data.id}
          </Button>
        </Tooltip>

        <WithConfirmRemoveButton aria-label={t("remove")} onRemove={onRemove} />
      </CardHeader>
      <CardBody>{JSON.stringify(data)}</CardBody>
    </Card>
  );
};

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

  const [sortableConfigKeys, setSortableConfigKeys] = useState<UniqueIdentifier[]>([]);

  useEffect(() => {
    if (configQuery.data) {
      if (sortableConfigKeys.length === 0) {
        setSortableConfigKeys(configQuery.data.configs.map(({ id }) => id));
      }
    }
  }, [configQuery.data]);

  const sortedConfigItems = useMemo(() => {
    if (!configQuery.data) {
      return [];
    }

    return sortableConfigKeys.map((id) => configQuery.data.configs.find((config) => id === config.id));
  }, [sortableConfigKeys, configQuery.data]);

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

  const [sortableNodeKeys, setSortableNodeKeys] = useState<UniqueIdentifier[]>([]);

  useEffect(() => {
    if (nodeQuery.data) {
      if (sortableConfigKeys.length === 0) {
        setSortableNodeKeys(nodeQuery.data.nodes.edges.map(({ id }) => id));
      }
    }
  }, [nodeQuery.data]);

  const sortedNodeItems = useMemo(() => {
    if (!nodeQuery.data) {
      return [];
    }

    return sortableNodeKeys.map((id) => nodeQuery.data.nodes.edges.find((config) => id === config.id));
  }, [sortableNodeKeys, nodeQuery.data]);

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
        <Accordion defaultIndex={[0]} allowMultiple>
          <AccordionItem border="none">
            <AccordionButton p={4}>
              <Flex w="full" alignItems="center" justifyContent="space-between">
                <Heading size="md">{t("node")}</Heading>

                <AccordionIcon />
              </Flex>
            </AccordionButton>

            <AccordionPanel>
              <Flex direction="column" gap={4}>
                {nodeQuery.isLoading ? (
                  <Center>
                    <Spinner />
                  </Center>
                ) : (
                  <Grid gridTemplateColumns={`repeat(${colsPerRow}, 1fr)`} gap={2}>
                    <DndContext
                      modifiers={[restrictToParentElement]}
                      collisionDetection={closestCenter}
                      onDragEnd={({ over, active }) =>
                        over &&
                        active.id !== over.id &&
                        setSortableNodeKeys((keys) => arrayMove(keys, keys.indexOf(active.id), keys.indexOf(over.id)))
                      }
                    >
                      <SortableContext items={sortableNodeKeys} strategy={rectSortingStrategy}>
                        {sortedNodeItems.map(
                          (data) =>
                            data && (
                              <DraggableCard
                                key={data.id}
                                data={data}
                                onRemove={() => {
                                  removeNodeMutation.mutate(data.id);
                                }}
                              />
                            )
                        )}
                      </SortableContext>
                    </DndContext>
                  </Grid>
                )}
              </Flex>
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
              {configQuery.isLoading ? (
                <Center>
                  <Spinner />
                </Center>
              ) : (
                <Grid gridTemplateColumns={`repeat(${colsPerRow}, 1fr)`} gap={2}>
                  <DndContext
                    modifiers={[restrictToParentElement]}
                    collisionDetection={closestCenter}
                    onDragEnd={({ over, active }) =>
                      over &&
                      active.id !== over.id &&
                      setSortableConfigKeys((keys) => arrayMove(keys, keys.indexOf(active.id), keys.indexOf(over.id)))
                    }
                  >
                    <SortableContext items={sortableConfigKeys} strategy={rectSortingStrategy}>
                      {sortedConfigItems.map(
                        (data) =>
                          data && (
                            <DraggableCard
                              key={data.id}
                              data={data}
                              onSelect={() => selectConfigMutation.mutate(data.id)}
                              onRemove={() => removeConfigMutation.mutate(data.id)}
                            />
                          )
                      )}
                    </SortableContext>
                  </DndContext>
                </Grid>
              )}
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
