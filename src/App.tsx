import { Flex } from "@chakra-ui/react";
import SimpleBar from "simplebar-react";

import Sidebar from "~/components/Sidebar";

import Home from "./Home";

function App() {
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
