import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { useState } from "react";
import { CiCircleRemove, CiTrash } from "react-icons/ci";

export default ({ onRemove, ...props }: { onRemove: () => void } & IconButtonProps) => {
  const [confirmed, confirm] = useState(false);

  return (
    <IconButton
      {...props}
      colorScheme={confirmed ? "red" : undefined}
      icon={confirmed ? <CiTrash /> : <CiCircleRemove />}
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
