import { Box, List, ListItem } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { gqlClient } from "~/api";
import { graphql } from "~/gql";

import { QUERY_KEY_CONFIG } from "./constants";

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
    <Box>
      <List>
        {configQueryData?.configs.map((config, i) => (
          <ListItem key={i}>{JSON.stringify(config)}</ListItem>
        ))}
      </List>
    </Box>
  );
};
