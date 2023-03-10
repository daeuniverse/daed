import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { Flex, IconButton, StackDivider, useCounter, VStack } from "@chakra-ui/react";

export const GrowableInputList = ({ children }: { children: (i: number) => React.ReactNode }) => {
  const { t } = useTranslation();

  const { value, increment, decrement } = useCounter({ defaultValue: 1 });
  const inputList = useMemo(() => Array(Number(value)).fill(undefined), [value]);

  return (
    <VStack divider={<StackDivider borderColor="Highlight" />}>
      {inputList.map((_, i) => (
        <Flex key={i} w="full" gap={2}>
          {children(i)}

          <IconButton aria-label={t("create")} icon={<AddIcon />} onClick={() => increment()} />
          <IconButton aria-label={t("remove")} icon={<DeleteIcon />} onClick={() => value > 1 && decrement()} />
        </Flex>
      ))}
    </VStack>
  );
};
