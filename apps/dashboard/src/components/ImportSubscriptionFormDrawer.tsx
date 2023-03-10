import { Flex, FormControl, Input, StackDivider, VStack } from "@chakra-ui/react";
import { CreateFormDrawer } from "@daed/components";
import { ImportArgument } from "@daed/schemas/gql/graphql";

export type FormValues = {
  subscription: ImportArgument;
};

export const ImportSubscriptionFormDrawer = ({
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
      header={t("subscription")}
      isOpen={isOpen}
      onClose={onClose}
      form={form}
      onSubmit={onSubmit}
    >
      <Flex direction="column" gap={4}>
        <FormControl>
          <VStack divider={<StackDivider borderColor="Highlight" />}>
            <Flex gap={2}>
              <Input
                autoFocus
                placeholder={t("tag")}
                {...register(`subscription.tag`, {
                  setValueAs: (v) => v || null,
                })}
              />
              <Input isRequired placeholder={t("link")} {...register(`subscription.link`)} />
            </Flex>
          </VStack>
        </FormControl>
      </Flex>
    </CreateFormDrawer>
  );
};
