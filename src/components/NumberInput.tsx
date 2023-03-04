import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper,
} from "@chakra-ui/react";
import { ForwardedRef, forwardRef } from "react";

export default forwardRef(({ ...props }: NumberInputProps, forwardedRef: ForwardedRef<HTMLDivElement>) => (
  <NumberInput ref={forwardedRef} allowMouseWheel {...props}>
    <NumberInputField />

    <NumberInputStepper>
      <NumberIncrementStepper />
      <NumberDecrementStepper />
    </NumberInputStepper>
  </NumberInput>
));
