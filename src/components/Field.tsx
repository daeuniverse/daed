import { FormControl, FormControlProps, FormLabel } from "@chakra-ui/react";
import { ForwardedRef, forwardRef } from "react";

export default forwardRef(
  (
    { labelNode, children, ...props }: { labelNode: React.ReactNode } & FormControlProps,
    forwardedRef: ForwardedRef<HTMLDivElement>
  ) => (
    <FormControl ref={forwardedRef} {...props}>
      <FormLabel>{labelNode}</FormLabel>

      {children}
    </FormControl>
  )
);
