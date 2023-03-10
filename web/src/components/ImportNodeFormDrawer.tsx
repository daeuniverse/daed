import { Input } from "@chakra-ui/react";
import { CreateFormDrawer, GrowableInputList } from "@daed/components";
import { ImportArgument } from "@daed/schemas/gql/graphql";
import { Fragment } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

export type FormValues = {
  nodes: ImportArgument[];
};

export const ImportNodeFormDrawer = ({
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
    <CreateFormDrawer<FormValues> header={t("node")} isOpen={isOpen} onClose={onClose} form={form} onSubmit={onSubmit}>
      <GrowableInputList>
        {(i) => (
          <Fragment>
            <Input
              placeholder={t("tag")}
              {...register(`nodes.${i}.tag`, {
                setValueAs: (v) => v || null,
              })}
            />
            <Input isRequired placeholder={t("link")} {...register(`nodes.${i}.link`)} />
          </Fragment>
        )}
      </GrowableInputList>
    </CreateFormDrawer>
  );
};
