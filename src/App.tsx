import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { Center, Collapse, Flex, Icon, IconButton, Spinner, useDisclosure } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import SimpleBar from "simplebar-react";

import Sidebar from "~/components/Sidebar";

import { gqlClient } from "./api";
import { QUERY_KEY_HEALTH_CHECK } from "./constants";
import { graphql } from "./gql";
import Home from "./Home";
import i18n from "./i18n";

const App = () => {
  const { t } = useTranslation();

  const { isOpen: isSidebarOpen, onToggle: onSidebarToggle } = useDisclosure({
    defaultIsOpen: true,
  });

  const healthCheckQuery = useQuery(QUERY_KEY_HEALTH_CHECK, async () =>
    gqlClient.request(
      graphql(`
        query HealthCheck {
          healthCheck
        }
      `)
    )
  );

  if (!i18n.isInitialized || healthCheckQuery.isLoading) {
    return (
      <Center h="full">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Flex h="100dvh" px={4} py={12}>
      <Flex>
        <IconButton
          aria-label={t("collapse")}
          h="full"
          icon={<Icon as={isSidebarOpen ? ArrowLeftIcon : ArrowRightIcon} />}
          onClick={onSidebarToggle}
        />

        <Collapse
          in={isSidebarOpen}
          animateOpacity
          transition={{
            enter: { duration: 0.2 },
            exit: { duration: 0.2 },
          }}
        >
          <Sidebar />
        </Collapse>
      </Flex>

      <Flex flex={1} overflowY="hidden">
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
          <Home />
        </SimpleBar>
      </Flex>
    </Flex>
  );
};

export default App;
