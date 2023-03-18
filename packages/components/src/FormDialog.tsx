import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import { useEffect } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FormDialog = <T extends FieldValues>({
  open,
  close,
  form,
  onSubmit,
  title,
  children,
}: {
  open: boolean;
  close: () => void;
  form: UseFormReturn<T>;
  onSubmit: (form: UseFormReturn<T>) => Promise<void>;
  title: string;
  children: React.ReactNode;
}) => {
  const { t } = useTranslation();
  const {
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = form;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <Dialog open={open} onClose={() => close()}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} py={2}>
          {children}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleSubmit(async () => {
            await onSubmit(form);
            close();
          })}
        >
          {t("actions.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
