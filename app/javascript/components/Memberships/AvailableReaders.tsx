import {
  Divider,
  Text,
  Button,
  Box,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Icon,
  theme,
  Flex,
} from "@chakra-ui/react";

import React from "react";
import { RadioCardGroup, RadioCard } from "./RadioCardGroup";
import { BsCreditCard2Front } from "react-icons/bs";

export default function AvailableReaders({
  availableReaders,
  selectReader,
  showReaderInstructions,
  cancelReusableCard,
  loadingText,
}) {
  return (
    <>
      <Divider />
      <Text
        fontSize="md"
        fontWeight="semibold"
        color={useColorModeValue("gray.700", "gray.200")}
        mt={8}
      >
        Available Readers
      </Text>
      <Text fontSize={"sm"}>{loadingText}</Text>
      <Box as="section" bg="bg-surface" py={{ base: "4", md: "8" }}>
        <RadioCardGroup defaultValue="manual" spacing="4" direction="row">
          {availableReaders.map((reader) => (
            <RadioCard
              key={"skip_payment"}
              value="true"
              onClick={() => {
                selectReader(reader);
              }}
            >
              <Text color="emphasized" fontWeight="medium" fontSize="sm">
                {reader.label}
              </Text>
              <Text color="muted" fontSize="sm">
                Click/Tap to select reader
              </Text>
            </RadioCard>
          ))}
        </RadioCardGroup>
      </Box>

      <Modal isOpen={showReaderInstructions} onClose={cancelReusableCard}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Follow Instructions on Reader</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex
              justifyContent={"center"}
              alignItems="center"
              direction="column"
            >
              <BsCreditCard2Front size={72} color={theme.colors.purple[500]} />
              <Text>Continue transaction on the reader.</Text>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              onClick={() => {
                cancelReusableCard();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
