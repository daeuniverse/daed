import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  StackDivider,
  useCounter,
  VStack,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CiSquarePlus, CiSquareRemove } from "react-icons/ci";

import { ImportArgument } from "~/gql/graphql";

import CreateFormDrawer from "./CreateFormDrawer";

export type FormValues = {
  nodes: ImportArgument[];
};

export default ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: UseFormReturn<FormValues>) => Promise<void>;
}) => {
  const { t } = useTranslation();

  const form = useForm<FormValues>();
  const { register } = form;

  const { value: nodesCount, increment: incNodesCount, decrement: decNodesCount } = useCounter();
  const nodesInputList = useMemo(() => Array(Number(nodesCount)).fill(undefined), [nodesCount]);

  return (
    <CreateFormDrawer<FormValues> header={t("node")} isOpen={isOpen} onClose={onClose} form={form} onSubmit={onSubmit}>
      <Flex direction="column" gap={4}>
        <FormControl>
          <FormLabel>
            <Flex alignItems="center" gap={2}>
              <Box>{t("node")}</Box>
              <IconButton aria-label={t("create")} icon={<CiSquarePlus />} onClick={() => incNodesCount()} />
            </Flex>
          </FormLabel>

          <VStack divider={<StackDivider borderColor="Highlight" />}>
            {nodesInputList.map((_, i) => (
              <Flex key={i} gap={2}>
                <Input autoFocus placeholder={t("tag")} {...register(`nodes.${i}.tag`)} />
                <Input placeholder={t("link")} {...register(`nodes.${i}.link`)} />

                <IconButton aria-label={t("remove")} icon={<CiSquareRemove />} onClick={() => decNodesCount()} />
              </Flex>
            ))}
          </VStack>
        </FormControl>
      </Flex>
    </CreateFormDrawer>
  );
};
