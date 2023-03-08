import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Select,
  StackDivider,
  useCounter,
  VStack,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CiSquarePlus, CiSquareRemove } from "react-icons/ci";

import { Policy, PolicyParam } from "~/gql/graphql";

import CreateFormDrawer from "./CreateFormDrawer";

export type FormValues = {
  name: string;
  policy: Policy;
  policyParams: PolicyParam[];
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

  const { value: policyParamsCount, increment: incPolicyParamsCount, decrement: decPolicyParamsCount } = useCounter();
  const policyParamsInputList = useMemo(() => Array(Number(policyParamsCount)).fill(undefined), [policyParamsCount]);

  return (
    <CreateFormDrawer<FormValues> header={t("group")} isOpen={isOpen} onClose={onClose} form={form} onSubmit={onSubmit}>
      <Flex direction="column" gap={4}>
        <FormControl>
          <FormLabel>{t("name")}</FormLabel>

          <Input {...register("name")} />
        </FormControl>

        <FormControl>
          <FormLabel>{t("policy")}</FormLabel>

          <Select defaultValue={Policy.Random} {...register("policy")}>
            <option>{Policy.Fixed}</option>
            <option>{Policy.Min}</option>
            <option>{Policy.MinAvg10}</option>
            <option>{Policy.MinMovingAvg}</option>
            <option>{Policy.Random}</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>
            <Flex alignItems="center" gap={2}>
              <Box>{t("policyParams")}</Box>
              <IconButton
                aria-label={t("policyParams")}
                icon={<CiSquarePlus />}
                onClick={() => incPolicyParamsCount()}
              />
            </Flex>
          </FormLabel>

          <VStack divider={<StackDivider borderColor="Highlight" />}>
            {policyParamsInputList.map((_, i) => (
              <Flex key={i} gap={2}>
                <Input autoFocus placeholder={t("name")} {...register(`policyParams.${i}.key`)} />
                <Input placeholder={t("value")} {...register(`policyParams.${i}.val`)} />

                <IconButton
                  aria-label={t("policyParams")}
                  icon={<CiSquareRemove />}
                  onClick={() => decPolicyParamsCount()}
                />
              </Flex>
            ))}
          </VStack>
        </FormControl>
      </Flex>
    </CreateFormDrawer>
  );
};
