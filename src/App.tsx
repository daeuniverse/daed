import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { Center, Collapse, Flex, IconButton, Spinner, useDisclosure } from "@chakra-ui/react";
import { DndContext } from "@dnd-kit/core";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

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
    <Flex>
      <DndContext>
        <Flex minH="100dvh" py={6}>
          <IconButton
            aria-label={t("collapse")}
            h="full"
            icon={isSidebarOpen ? <ArrowLeftIcon /> : <ArrowRightIcon />}
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

        <Home />
      </DndContext>
    </Flex>
  );
};

export default App;
