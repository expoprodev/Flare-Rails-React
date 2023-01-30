import {
  Box,
  Heading,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  TableContainer,
  Table,
  Button,
} from "@chakra-ui/react";

import React, { useState } from "react";
import AddAdditionalMember from "./AddAdditionalMember";

export function AdditionalMembers({
  additionalMembers,
  handleAddAdditionalMembers,
  handleRemoveAdditionalMember,
}) {
  const [showAdditionalMembers, setShowAdditionalMembers] = useState(false);
  return (
    <>
      <Heading size="md" mb="4">
        Additional Members
      </Heading>

      <TableContainer>
        <Table variant="simple" borderWidth="1px" rounded="md">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Notes</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {additionalMembers &&
              additionalMembers.map((am) => (
                <Tr key={am.id}>
                  <Td> {am.name}</Td>
                  <Td> {am.email}</Td>
                  <Td> {am.phone}</Td>
                  <Td> {am.notes}</Td>
                  <Td>
                    <Button onClick={() => handleRemoveAdditionalMember(am.id)}>
                      Remove
                    </Button>
                  </Td>
                </Tr>
              ))}
            {!additionalMembers.length && (
              <Tr>
                <Td>No Additional Members</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <Box mt={4}>
        <Button
          onClick={() => setShowAdditionalMembers(true)}
          colorScheme="purple"
        >
          Add Members
        </Button>
      </Box>
      <AddAdditionalMember
        open={showAdditionalMembers}
        onSave={handleAddAdditionalMembers}
        additionalMembers={additionalMembers}
        close={() => setShowAdditionalMembers(false)}
      />
    </>
  );
}
