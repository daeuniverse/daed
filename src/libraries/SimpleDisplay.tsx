import { Flex, Icon, List, ListItem, Skeleton, Tag, Text, Tooltip, useOutsideClick } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";

import { Displayable, SimpleDisplayable } from "~/typings";

const DescriptiveText = ({ title }: { title: SimpleDisplayable }) => {
  const [preventTooltipClose, setPreventTooltipClose] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useOutsideClick({
    ref: tooltipRef,
    handler: () => setPreventTooltipClose(false),
  });

  return (
    <Tooltip
      ref={tooltipRef}
      label={title}
      placement="right"
      hasArrow
      isOpen={preventTooltipClose ? true : undefined}
      pointerEvents="all"
    >
      <Text
        noOfLines={1}
        onClick={() => {
          !preventTooltipClose && setPreventTooltipClose(true);
        }}
      >
        {title}
      </Text>
    </Tooltip>
  );
};

export default ({ name, value, encrypt }: { name: string; value?: Displayable; encrypt?: boolean }) => {
  const [isEncrypted, setIsEncrypted] = useState(encrypt);

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      gap={2}
      fontSize="xs"
      overflow="hidden"
      wordBreak="break-all"
    >
      <Text flexShrink={0}>{name}</Text>

      <Flex textAlign="right">
        {value === undefined || value === null ? null : Array.isArray(value) ? (
          <List>
            {value.map((item, i) => (
              <ListItem key={i}>
                {typeof item === "object" ? (
                  <Flex gap={1}>
                    <Text>{item.key}:</Text>
                    <DescriptiveText title={item.val} />
                  </Flex>
                ) : (
                  <Tag size="sm">
                    <DescriptiveText title={item} />
                  </Tag>
                )}
              </ListItem>
            ))}
          </List>
        ) : typeof value === "boolean" ? (
          <Icon fontSize="lg" as={value ? CiCircleCheck : CiCircleRemove} />
        ) : (
          <Skeleton
            rounded="md"
            pointerEvents="all"
            isLoaded={!isEncrypted}
            startColor="gray.200"
            endColor="gray.300"
            speed={1.6}
            onClick={() => setIsEncrypted(false)}
          >
            <DescriptiveText title={value} />
          </Skeleton>
        )}
      </Flex>
    </Flex>
  );
};
