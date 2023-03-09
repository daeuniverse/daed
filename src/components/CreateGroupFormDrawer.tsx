import { Flex, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Policy, PolicyParam } from "~/gql/graphql";

import CreateFormDrawer from "./CreateFormDrawer";
import GrowableInputList from "./GrowableInputList";

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
          <FormLabel>{t("policyParams")}</FormLabel>

          <GrowableInputList
            getNameInputProps={(i) => ({ ...register(`policyParams.${i}.key`) })}
            getValueInputProps={(i) => ({ ...register(`policyParams.${i}.val`) })}
          />
        </FormControl>
      </Flex>
    </CreateFormDrawer>
  );
};
