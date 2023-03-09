import { DragHandleIcon } from "@chakra-ui/icons";
import { Button, Card, CardBody, CardHeader, Center, Flex, Grid, IconButton, Spinner, Tooltip } from "@chakra-ui/react";
import { closestCenter, DndContext, UniqueIdentifier } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useStore } from "@nanostores/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import WithConfirmRemoveButton from "~/libraries/WithConfirmRemoveButton";
import { appStateAtom, PersistentSortableKeys } from "~/store";

export type GridList = Array<{ id: UniqueIdentifier } & Record<string, unknown>>;

export type DraggableGridCardProps<T extends GridList[number]> = {
  data: T;
  onSelect?: (data: T) => void;
  onRemove: (data: T) => void;
  children: (data: T) => React.ReactNode;
};

const DraggableGridCard = <T extends GridList[number]>({
  data,
  onSelect,
  onRemove,
  children,
}: DraggableGridCardProps<T>) => {
  const { t } = useTranslation();
  const { listeners, attributes, setNodeRef, isDragging, transform, transition } = useSortable({
    id: data.id,
  });

  return (
    <Card
      ref={setNodeRef}
      bg={data.selected ? "Highlight" : ""}
      size="sm"
      style={{
        zIndex: isDragging ? Number.MAX_SAFE_INTEGER : 0,
        transform: CSS.Translate.toString(transform),
        transition,
      }}
    >
      <CardHeader as={Flex} gap={2} alignItems="center">
        <WithConfirmRemoveButton size="sm" aria-label={t("remove")} onRemove={() => onRemove(data)} />

        <Tooltip hasArrow label={data.id} placement="top">
          <Button flex={1} noOfLines={1} onClick={() => onSelect && onSelect(data)}>
            {data.id}
          </Button>
        </Tooltip>

        <IconButton
          size="sm"
          cursor={isDragging ? "grabbing" : "grab"}
          aria-label={t("select")}
          icon={<DragHandleIcon />}
          {...listeners}
          {...attributes}
        />
      </CardHeader>
      <CardBody>{children(data)}</CardBody>
    </Card>
  );
};

export type SortableGridProps<T extends GridList> = {
  isLoading: boolean;
  unSortedItems?: T;
  persistentSortableKeysName: keyof PersistentSortableKeys;
} & Omit<DraggableGridCardProps<T[number]>, "data">;

export default <T extends GridList>({
  isLoading,
  unSortedItems,
  onSelect,
  onRemove,
  persistentSortableKeysName,
  children,
}: SortableGridProps<T>) => {
  const appState = useStore(appStateAtom);
  const [sortableKeys, setSortableKeys] = useState<UniqueIdentifier[]>(appState[persistentSortableKeysName]);

  useEffect(() => {
    if (unSortedItems) {
      if (sortableKeys.length === 0) {
        setSortableKeys(unSortedItems.map(({ id }) => id));

        return;
      }

      if (sortableKeys.length > unSortedItems.length) {
        setSortableKeys((keys) => keys.filter((key) => unSortedItems.some(({ id }) => key === id)));
      } else {
        setSortableKeys((keys) => [...keys, ...unSortedItems.slice(keys.length).map(({ id }) => id)]);
      }
    }
  }, [unSortedItems]);

  useEffect(() => {
    appStateAtom.setKey(persistentSortableKeysName, sortableKeys);
  }, [sortableKeys]);

  const sortedItems = useMemo(() => {
    if (!unSortedItems) {
      return [];
    }

    return sortableKeys.map((id) => unSortedItems.find((config) => id === config.id));
  }, [sortableKeys, unSortedItems]);

  return (
    <Flex direction="column" gap={4}>
      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <Grid gridTemplateColumns={`repeat(${appState.colsPerRow}, 1fr)`} gap={2}>
          <DndContext
            modifiers={[restrictToParentElement]}
            collisionDetection={closestCenter}
            onDragEnd={({ over, active }) =>
              over &&
              active.id !== over.id &&
              setSortableKeys((keys) => arrayMove(keys, keys.indexOf(active.id), keys.indexOf(over.id)))
            }
          >
            <SortableContext items={sortableKeys} strategy={rectSortingStrategy}>
              {sortedItems.map(
                (item) =>
                  item && (
                    <DraggableGridCard key={item.id} data={item} onSelect={onSelect} onRemove={onRemove}>
                      {children}
                    </DraggableGridCard>
                  )
              )}
            </SortableContext>
          </DndContext>
        </Grid>
      )}
    </Flex>
  );
};
