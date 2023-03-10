import { Text, TextProps, Tooltip, useOutsideClick } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { SimpleDisplayable } from "@daed/typings";

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
      placement="right"
      hasArrow
      isOpen={preventTooltipClose ? true : undefined}
      pointerEvents="all"
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
