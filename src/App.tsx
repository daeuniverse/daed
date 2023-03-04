import { Flex } from "@chakra-ui/react";

import Sidebar from "~/components/Sidebar";

import Home from "./Home";

function App() {
  return (
    <Flex h="full">
      <Sidebar />

      <Flex flex={1}>
        <Home />
      </Flex>
    </Flex>
  );
}

export default App;
