import { Flex, FormControl, FormLabel, Input, Textarea } from "@chakra-ui/react";
import { CreateFormDrawer } from "@daed/components";
import { useForm, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

export type FormValues = {
  name: string;
  routing: string;
};

export const CreateRoutingFormDrawer = ({
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
    <CreateFormDrawer<FormValues>
      header={t("routing")}
      isOpen={isOpen}
      onClose={onClose}
      form={form}
      onSubmit={onSubmit}
    >
      <Flex direction="column" gap={4}>
        <FormControl>
          <FormLabel>{t("name")}</FormLabel>

          <Input isRequired {...register("name")} />
        </FormControl>

        <Textarea h="md" isRequired {...register("routing")} />
      </Flex>
    </CreateFormDrawer>
  );
};
