import { Center, Collapse, Flex, IconButton, Spinner, useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { BsChevronBarLeft } from "react-icons/bs";
import { CiMenuKebab } from "react-icons/ci";

import Sidebar from "~/components/Sidebar";

import Home from "./Home";
import i18n from "./i18n";

const App = () => {
  const { t } = useTranslation();

  const { isOpen: isSidebarOpen, onToggle: onSidebarToggle } = useDisclosure({
    defaultIsOpen: true,
  });

  if (!i18n.isInitialized) {
    return (
      <Center h="full">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Flex>
      <Flex minH="100dvh" py={6}>
        <IconButton
          aria-label={t("collapse")}
          h="full"
          icon={isSidebarOpen ? <BsChevronBarLeft /> : <CiMenuKebab />}
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
    </Flex>
  );
};

export default App;
