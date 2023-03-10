import { UniqueIdentifier } from "@dnd-kit/core";

declare type SortableList = Array<{ id: UniqueIdentifier } & Record<string, unknown>>;

declare type SimpleDisplayable = number | string;

declare type Displayable =
  | null
  | boolean
  | SimpleDisplayable
  | Array<SimpleDisplayable>
  | Array<{ [key: string]: SimpleDisplayable }>;
