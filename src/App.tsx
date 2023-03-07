import { Center, Flex, Spinner } from "@chakra-ui/react";
import SimpleBar from "simplebar-react";

import Sidebar from "~/components/Sidebar";

import Home from "./Home";
import i18n from "./i18n";

function App() {
  if (!i18n.isInitialized) {
    return (
      <Center h="full">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Flex>
      <Flex minH="100dvh">
        <Sidebar />
      </Flex>

      <SimpleBar style={{ width: "100%", maxHeight: "100dvh", overflowX: "hidden" }}>
        <Home />
      </SimpleBar>
    </Flex>
  );
}

export default App;
