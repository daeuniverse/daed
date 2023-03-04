import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";

export default ({ min, max }: { min?: number; max?: number }) => (
  <NumberInput min={min} max={max} allowMouseWheel>
    <NumberInputField />

    <NumberInputStepper>
      <NumberIncrementStepper />
      <NumberDecrementStepper />
    </NumberInputStepper>
  </NumberInput>
);
