import { Flex, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import { Fragment } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Policy, PolicyParam } from "~/gql/graphql";
import CreateFormDrawer from "~/libraries/CreateFormDrawer";
import GrowableInputList from "~/libraries/GrowableInputList";

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
            <option>{Policy.Random}</option>
            <option>{Policy.Fixed}</option>
            <option>{Policy.Min}</option>
            <option>{Policy.MinAvg10}</option>
            <option>{Policy.MinMovingAvg}</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>{t("policyParams")}</FormLabel>

          <GrowableInputList>
            {(i) => (
              <Fragment>
                <Input
                  placeholder={t("name")}
                  {...register(`policyParams.${i}.key`, {
                    setValueAs: (v) => v || null,
                  })}
                />
                <Input isRequired placeholder={t("value")} {...register(`policyParams.${i}.val`)} />
              </Fragment>
            )}
          </GrowableInputList>
        </FormControl>
      </Flex>
    </CreateFormDrawer>
  );
};
