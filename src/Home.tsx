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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { gqlClient } from "~/api";
import WithConfirmRemoveButton from "~/components/WithConfirmRemoveButton";
import { graphql } from "~/gql";

import { CONFIGS_PER_ROW, GROUPS_PER_ROW, QUERY_KEY_CONFIG, QUERY_KEY_GROUP } from "./constants";

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
    <Flex direction="column" gap={4} px={2} py={4}>
      <Accordion
        defaultIndex={[0, 1]}
        allowMultiple
        allowToggle
        borderRadius="2xl"
        borderWidth={4}
        borderColor="Highlight"
      >
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
              <Grid gridTemplateColumns={`repeat(${CONFIGS_PER_ROW}, 1fr)`} gap={2}>
                {configQuery.data?.configs.map(({ id, selected, ...config }) => (
                  <Card key={id}>
                    <CardBody>{JSON.stringify(config)}</CardBody>

                    <CardFooter>
                      <ButtonGroup isAttached variant="outline" display="flex" w="full">
                        <Button
                          flex={1}
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
                <Grid gridTemplateColumns={`repeat(${GROUPS_PER_ROW}, 1fr)`} gap={2}>
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
    </Flex>
  );
};
