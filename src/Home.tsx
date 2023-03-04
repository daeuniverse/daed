import { Button, HStack, List, ListItem, useDisclosure } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request";
import { useTranslation } from "react-i18next";

import { graphql } from "~/gql";
import { endpointURL } from "~/store";

import CreateConfigModal from "./components/CreateConfigModal";

export default () => {
  const { t } = useTranslation();
  const { isOpen: isConfigModalOpen, onOpen: onConfigModalOpen, onClose: onConfigModalClose } = useDisclosure();

  const { data: configQueryData } = useQuery(["configs"], async () =>
    request(
      endpointURL.get(),
      graphql(/* GraphQL */ `
        query Configs {
          configs {
            selected
          }
        }
      `)
    )
  );

  return (
    <HStack>
      <List>
        {configQueryData?.configs.map((config, i) => (
          <ListItem key={i}>{JSON.stringify(config)}</ListItem>
        ))}
      </List>

      <Button
        onClick={() => {
          onConfigModalOpen();
        }}
      >
        {t("create config")}
      </Button>

      <CreateConfigModal isOpen={isConfigModalOpen} onClose={onConfigModalClose} />
    </HStack>
  );
};
