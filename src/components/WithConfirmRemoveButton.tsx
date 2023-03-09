import { CloseIcon, DeleteIcon } from "@chakra-ui/icons";
import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { useState } from "react";

export default ({ onRemove, ...props }: { onRemove: () => void } & IconButtonProps) => {
  const [confirmed, confirm] = useState(false);

  return (
    <IconButton
      {...props}
      colorScheme={confirmed ? "red" : undefined}
      icon={confirmed ? <DeleteIcon /> : <CloseIcon />}
      onClick={async () => {
        if (confirmed) {
          onRemove();
        } else {
          confirm(true);
        }
      }}
      onBlur={() => confirm(false)}
    />
  );
};
