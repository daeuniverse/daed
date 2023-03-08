import { Button, Card, CardBody, CardHeader, Center, Flex, Grid, IconButton, Spinner, Tooltip } from "@chakra-ui/react";
import { closestCenter, DndContext, UniqueIdentifier } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useStore } from "@nanostores/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoMoveSharp } from "react-icons/io5";

import { appStateAtom } from "~/store";

import WithConfirmRemoveButton from "./WithConfirmRemoveButton";

type List = Array<{ id: UniqueIdentifier } & Record<string, unknown>>;

const DraggableCard = <T extends List[number]>({
  data,
  onSelect,
  onRemove,
}: {
  data: T;
  onSelect?: (data: T) => void;
  onRemove: (data: T) => void;
}) => {
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
        <IconButton
          cursor={isDragging ? "grabbing" : "grab"}
          aria-label={t("select")}
          icon={<IoMoveSharp />}
          {...listeners}
          {...attributes}
        />

        <Tooltip hasArrow label={data.id} placement="top">
          <Button size="sm" flex={1} noOfLines={1} onClick={() => onSelect && onSelect(data)}>
            {data.id}
          </Button>
        </Tooltip>

        <WithConfirmRemoveButton aria-label={t("remove")} onRemove={() => onRemove(data)} />
      </CardHeader>
      <CardBody>{JSON.stringify(data)}</CardBody>
    </Card>
  );
};

export default <T extends List>({
  isLoading,
  unSortedItems,
  onSelect,
  onRemove,
}: {
  isLoading: boolean;
  unSortedItems?: T;
  onSelect?: (data: T[number]) => void;
  onRemove: (data: T[number]) => void;
}) => {
  const { colsPerRow } = useStore(appStateAtom);
  const [sortableKeys, setSortableKeys] = useState<UniqueIdentifier[]>([]);

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
        <Grid gridTemplateColumns={`repeat(${colsPerRow}, 1fr)`} gap={2}>
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
                (item) => item && <DraggableCard key={item.id} data={item} onSelect={onSelect} onRemove={onRemove} />
              )}
            </SortableContext>
          </DndContext>
        </Grid>
      )}
    </Flex>
  );
};
