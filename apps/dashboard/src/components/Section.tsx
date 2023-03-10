import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Flex, Heading } from "@chakra-ui/react";
import { SortableGrid, SortableGridProps } from "@daed/components";
import { SortableList } from "@daed/typings";
import { useStore } from "@nanostores/react";

import { appStateAtom, PersistentSortableKeys } from "~/store";

export const Section = <T extends SortableList>({
  name,
  isLoading,
  unSortedItems,
  onSelect,
  onRemove,
  children,
  persistentSortableKeysName,
}: {
  name: string;
  persistentSortableKeysName: keyof PersistentSortableKeys;
} & Omit<SortableGridProps<T>, "colsPerRow" | "defaultSortableKeys">) => {
  const appState = useStore(appStateAtom);
  const defaultSortableKeys = appState[persistentSortableKeysName];

  return (
    <AccordionItem border="none">
      <AccordionButton p={4} rounded="md">
        <Flex w="full" alignItems="center" justifyContent="space-between">
          <Heading size="md">
            {name} ({unSortedItems?.length || 0})
          </Heading>

          <AccordionIcon />
        </Flex>
      </AccordionButton>

      <AccordionPanel>
        <SortableGrid<T>
          colsPerRow={appState.colsPerRow}
          isLoading={isLoading}
          unSortedItems={unSortedItems}
          onSelect={onSelect}
          onRemove={onRemove}
          defaultSortableKeys={defaultSortableKeys}
          onSort={(sortableKeys) => {
            appStateAtom.setKey(persistentSortableKeysName, sortableKeys);
          }}
        >
          {children}
        </SortableGrid>
      </AccordionPanel>
    </AccordionItem>
  );
};
