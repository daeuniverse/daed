import { Box, List, ListItem } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { gqlClient } from "~/api";
import { graphql } from "~/gql";

export default () => {
  const { data: configQueryData } = useQuery(["configs"], async () =>
    gqlClient.request(
      graphql(`
        query Query {
          configs {
            selected
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
