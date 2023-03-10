import { Flex, Icon, ListItem, Skeleton, Tag, Text, UnorderedList } from "@chakra-ui/react";
import { Displayable } from "@daed/typings";
import { useState } from "react";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";

import { DescriptiveText } from "./DescriptiveText";

export const SimpleDisplay = ({
  name,
  value,
  defaultEncrypted,
  children,
}: {
  name: string;
  value?: Displayable;
  defaultEncrypted?: boolean;
  children?: React.ReactNode;
}) => {
  const [encrypted, setEncrypted] = useState(defaultEncrypted);

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
        {children ? (
          children
        ) : value === undefined || value === null ? null : Array.isArray(value) ? (
          <UnorderedList spacing={2}>
            {value.map((item, i) => (
              <ListItem key={i}>
                {typeof item === "object" ? (
                  Object.entries(item).map(([key, val], i) => (
                    <Flex gap={1} key={i}>
                      <DescriptiveText tip={key} />
                      :
                      <DescriptiveText tip={val} />
                    </Flex>
                  ))
                ) : (
                  <Tag size="sm">
                    <DescriptiveText tip={item} />
                  </Tag>
                )}
              </ListItem>
            ))}
          </UnorderedList>
        ) : typeof value === "boolean" ? (
          <Icon fontSize="lg" as={value ? CiCircleCheck : CiCircleRemove} />
        ) : (
          <Skeleton
            rounded="md"
            pointerEvents="all"
            isLoaded={!encrypted}
            startColor="gray.200"
            endColor="gray.300"
            speed={1.6}
            onClick={() => setEncrypted(false)}
            onContextMenu={(e) => e.preventDefault()}
          >
            <DescriptiveText
              tip={value}
              onContextMenu={(e) => {
                e.preventDefault();
                setEncrypted(true);
              }}
            />
          </Skeleton>
        )}
      </Flex>
    </Flex>
  );
};
