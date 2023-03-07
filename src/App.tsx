import { Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SimpleBar from "simplebar-react";

import Sidebar from "~/components/Sidebar";
import initI18n from "~/i18n";

import Home from "./Home";

function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    Promise.all([initI18n()]).then(() => {
      setInitialized(true);
    });
  }, []);

  if (!initialized) {
    return (
      <Flex w="full" h="full" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Flex>
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
