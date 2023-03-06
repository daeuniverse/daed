import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Collapse,
  Flex,
  Grid,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { CiCircleRemove, CiSquareChevDown, CiSquareChevUp } from "react-icons/ci";
import SimpleBar from "simplebar-react";

import { gqlClient, queryClient } from "~/api";
import { graphql } from "~/gql";

import { CONFIGS_PER_ROW, GROUPS_PER_ROW, QUERY_KEY_CONFIG, QUERY_KEY_GROUP } from "./constants";

export default () => {
  const { t } = useTranslation();

  const { isOpen: isConfigOpen, onToggle: onConfigToggle } = useDisclosure({
    defaultIsOpen: true,
  });

  const { isOpen: isGroupOpen, onToggle: onGroupToggle } = useDisclosure({
    defaultIsOpen: true,
  });

  const { data: configQueryData } = useQuery(QUERY_KEY_CONFIG, async () =>
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

  const { data: groupQueryData } = useQuery(QUERY_KEY_GROUP, async () =>
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
        {
          id,
        }
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
        {
          id,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_CONFIG });
    },
  });

  return (
    <SimpleBar style={{ width: "100%", height: "100%", padding: 10 }}>
      <Flex gap={4} direction="column">
        <Flex direction="column" gap={4}>
          <Button onClick={onConfigToggle} rightIcon={isConfigOpen ? <CiSquareChevUp /> : <CiSquareChevDown />}>
            {t("config")}
          </Button>

          <Collapse in={isConfigOpen}>
            <Grid gridTemplateColumns={`repeat(${CONFIGS_PER_ROW}, 1fr)`} gap={2} p={2}>
              {configQueryData?.configs.map(({ id, selected, ...config }) => (
                <Card key={id}>
                  <CardBody>{JSON.stringify(config)}</CardBody>

                  <CardFooter>
                    <ButtonGroup isAttached variant="outline" display="flex" w="full">
                      <Button
                        flex={1}
                        bg={selected ? "Highlight" : ""}
                        isLoading={selectConfigMutation.isLoading || removeConfigMutation.isLoading}
                        onClick={() => {
                          selectConfigMutation.mutate(id);
                        }}
                      >
                        {id}
                      </Button>
                      <IconButton
                        aria-label={t("remove")}
                        isLoading={selectConfigMutation.isLoading || removeConfigMutation.isLoading}
                        icon={<CiCircleRemove />}
                        onClick={() => {
                          removeConfigMutation.mutate(id);
                        }}
                      />
                    </ButtonGroup>
                  </CardFooter>
                </Card>
              ))}
            </Grid>
          </Collapse>
        </Flex>

        <Flex direction="column" gap={4}>
          <Button onClick={onGroupToggle} rightIcon={isGroupOpen ? <CiSquareChevUp /> : <CiSquareChevDown />}>
            {t("group")}
          </Button>

          <Collapse in={isGroupOpen}>
            <Grid gridTemplateColumns={`repeat(${GROUPS_PER_ROW}, 1fr)`} gap={2} p={2}>
              {groupQueryData?.groups.map(({ id, ...config }) => (
                <Card key={id}>
                  <CardBody>{JSON.stringify(config)}</CardBody>
                </Card>
              ))}
            </Grid>
          </Collapse>
        </Flex>
      </Flex>
    </SimpleBar>
  );
};
