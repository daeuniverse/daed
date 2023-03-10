import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput as NumberInputImpl,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper,
} from "@chakra-ui/react";

export const NumberInput = forwardRef(({ ...props }: NumberInputProps, forwardedRef: ForwardedRef<HTMLDivElement>) => (
  <NumberInputImpl ref={forwardedRef} allowMouseWheel {...props}>
    <NumberInputField />

    <NumberInputStepper>
      <NumberIncrementStepper />
      <NumberDecrementStepper />
    </NumberInputStepper>
  </NumberInputImpl>
));
