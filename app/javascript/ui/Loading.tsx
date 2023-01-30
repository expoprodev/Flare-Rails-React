import { Flex, Spinner } from "@chakra-ui/react";
import React from "react";

export function Loading() {
  return (
    <Flex alignItems="center" justifyContent="center" w="100%" height="100%">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="purple.500"
        size="xl"
      />
    </Flex>
  );
}
