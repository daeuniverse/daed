import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
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
import WithConfirmRemoveButton from "~/components/WithConfirmRemoveButton";
import { graphql } from "~/gql";

import { QUERY_KEY_CONFIG, QUERY_KEY_GROUP } from "./constants";
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
        <Accordion defaultIndex={[0, 1]} allowMultiple>
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
                  {configQuery.data?.configs.map(({ id, selected, ...config }) => (
                    <Card key={id}>
                      <CardBody>{JSON.stringify(config)}</CardBody>

                      <CardFooter>
                        <ButtonGroup w="full" isAttached variant="outline">
                          <Button
                            display="inline-block"
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            bg={selected ? "Highlight" : ""}
                            isLoading={selectConfigMutation.isLoading || removeConfigMutation.isLoading}
                            onClick={() => {
                              if (!selected) {
                                selectConfigMutation.mutate(id);
                              }
                            }}
                          >
                            {id}
                          </Button>
                          <WithConfirmRemoveButton
                            aria-label={t("remove")}
                            isLoading={selectConfigMutation.isLoading || removeConfigMutation.isLoading}
                            onRemove={() => {
                              removeConfigMutation.mutate(id);
                            }}
                          />
                        </ButtonGroup>
                      </CardFooter>
                    </Card>
                  ))}
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
