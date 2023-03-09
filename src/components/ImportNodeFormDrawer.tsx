import { Input } from "@chakra-ui/react";
import { Fragment } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ImportArgument } from "~/gql/graphql";
import CreateFormDrawer from "~/libraries/CreateFormDrawer";
import GrowableInputList from "~/libraries/GrowableInputList";

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

  return (
    <CreateFormDrawer<FormValues> header={t("node")} isOpen={isOpen} onClose={onClose} form={form} onSubmit={onSubmit}>
      <GrowableInputList>
        {(i) => (
          <Fragment>
            <Input placeholder={t("tag")} {...register(`nodes.${i}.tag`)} />
            <Input placeholder={t("link")} {...register(`nodes.${i}.link`)} />
          </Fragment>
        )}
      </GrowableInputList>
    </CreateFormDrawer>
  );
};
