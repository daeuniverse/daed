import { Text, TextProps, Tooltip, useOutsideClick } from "@chakra-ui/react";
import { SimpleDisplayable } from "@daed/typings";
import { useRef, useState } from "react";

export const DescriptiveText = ({ tip, ...props }: { tip: SimpleDisplayable } & TextProps) => {
  const [preventTooltipClose, setPreventTooltipClose] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useOutsideClick({
    ref: tooltipRef,
    handler: () => setPreventTooltipClose(false),
  });

  return (
    <Tooltip
      ref={tooltipRef}
      label={tip}
      placement="auto"
      hasArrow
      maxW="unset"
      isOpen={preventTooltipClose ? true : undefined}
      pointerEvents="all"
      whiteSpace="break-spaces"
    >
      <Text
        cursor="pointer"
        noOfLines={1}
        onClick={() => {
          !preventTooltipClose && setPreventTooltipClose(true);
        }}
        {...props}
      >
        {tip}
      </Text>
    </Tooltip>
  );
};
