import { Button, ButtonGroup, Card, CardBody, CardHeader, Grid, Heading, IconButton } from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CiCircleRemove } from "react-icons/ci";
import SimpleBar from "simplebar-react";

import { gqlClient, queryClient } from "~/api";
import { graphql } from "~/gql";

import { CONFIGS_PER_ROW, QUERY_KEY_CONFIG } from "./constants";

export default () => {
  const { data: configQueryData } = useQuery(QUERY_KEY_CONFIG, async () =>
    gqlClient.request(
      graphql(`
        query Query {
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
    <SimpleBar style={{ width: "100%", height: "100%" }}>
      <Grid gridTemplateColumns={`repeat(${CONFIGS_PER_ROW}, 1fr)`} gap={2} p={2}>
        {configQueryData?.configs.map(({ id, selected, ...config }, i) => (
          <Card key={i}>
            <CardHeader>
              <Heading>
                <ButtonGroup isAttached variant="outline">
                  <Button
                    bg={selected ? "Highlight" : ""}
                    isLoading={selectConfigMutation.isLoading || removeConfigMutation.isLoading}
                    onClick={() => {
                      selectConfigMutation.mutate(id);
                    }}
                  >
                    {id}
                  </Button>
                  <IconButton
                    aria-label="remove config"
                    isLoading={selectConfigMutation.isLoading || removeConfigMutation.isLoading}
                    icon={<CiCircleRemove />}
                    onClick={() => {
                      removeConfigMutation.mutate(id);
                    }}
                  />
                </ButtonGroup>
              </Heading>
            </CardHeader>
            <CardBody>{JSON.stringify(config)}</CardBody>
          </Card>
        ))}
      </Grid>
    </SimpleBar>
  );
};
