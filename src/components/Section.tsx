import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Flex, Heading } from "@chakra-ui/react";

import SortableGrid, { SortableGridProps } from "~/libraries/SortableGrid";
import { SortableList } from "~/typings";

export default <T extends SortableList>({
  name,
  isLoading,
  unSortedItems,
  onSelect,
  onRemove,
  persistentSortableKeysName,
  children,
}: {
  name: string;
} & SortableGridProps<T>) => (
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
        isLoading={isLoading}
        unSortedItems={unSortedItems}
        onSelect={onSelect}
        onRemove={onRemove}
        persistentSortableKeysName={persistentSortableKeysName}
      >
        {children}
      </SortableGrid>
    </AccordionPanel>
  </AccordionItem>
);
