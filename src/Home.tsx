import { Card, CardBody, CardHeader, Grid, Heading } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import SimpleBar from "simplebar-react";

import { gqlClient } from "~/api";
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

  return (
    <SimpleBar style={{ width: "100%", height: "100%" }}>
      <Grid gridTemplateColumns={`repeat(${CONFIGS_PER_ROW}, 1fr)`} gap={2}>
        {configQueryData?.configs.map(({ id, ...config }, i) => (
          <Card key={i}>
            <CardHeader>
              <Heading>{id}</Heading>
            </CardHeader>
            <CardBody>{JSON.stringify(config)}</CardBody>
          </Card>
        ))}
      </Grid>
    </SimpleBar>
  );
};
