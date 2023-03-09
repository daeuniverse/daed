import { Flex, IconButton, Input, InputProps, StackDivider, useCounter, VStack } from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CiSquarePlus, CiSquareRemove } from "react-icons/ci";

export default ({
  getNameInputProps,
  getValueInputProps,
}: {
  getNameInputProps: (i: number) => InputProps;
  getValueInputProps: (i: number) => InputProps;
}) => {
  const { t } = useTranslation();

  const { value, increment, decrement } = useCounter({ defaultValue: 1 });
  const inputList = useMemo(() => Array(Number(value)).fill(undefined), [value]);

  return (
    <VStack divider={<StackDivider borderColor="Highlight" />}>
      {inputList.map((_, i) => (
        <Flex key={i} gap={2}>
          <Input placeholder={t("name")} {...getNameInputProps(i)} />
          <Input placeholder={t("value")} {...getValueInputProps(i)} />

          <IconButton aria-label={t("create")} icon={<CiSquarePlus />} onClick={() => increment()} />
          <IconButton aria-label={t("remove")} icon={<CiSquareRemove />} onClick={() => decrement()} />
        </Flex>
      ))}
    </VStack>
  );
};
