import { TablePagination } from "@material-ui/core";

import axios from "axios";
import React, { useEffect, useState } from "react";

import {
  Button,
  Divider,
  Flex,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  theme,
  Tr,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../ui/Loading";
import { ClickableTr } from "../../ui/table";
import { GiShop } from "react-icons/gi";

export default function ListLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };

  const fetchLocations = async () => {
    const response = await axios.get(`/locations.json`);
    setLocations(response.data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchLocations();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <>
      <Flex justifyContent="space-between" mb="15">
        <Flex alignItems={"center"}>
          <Heading size="md" mx={"10px"}>
            Locations
          </Heading>
          <GiShop size={36} color={theme.colors.purple[500]} />
        </Flex>
        <Button colorScheme="purple" onClick={() => navigate("/locations/new")}>
          Add a Location
        </Button>
      </Flex>
      <Divider />

      <TableContainer w="100%">
        <Table variant="striped">
          <TableCaption>Locations</TableCaption>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Address</Th>
              <Th>Address Ext</Th>
              <Th>City</Th>
              <Th>State</Th>
              <Th align="right">Zip</Th>
            </Tr>
          </Thead>
          <Tbody>
            {locations.map((location) => (
              <ClickableTr
                key={location.id}
                onClick={() => navigate(`/locations/${location.id}/edit`)}
              >
                <Td>{location.name}</Td>
                <Td>{location.address}</Td>
                <Td>{location.address_ext}</Td>
                <Td>{location.city}</Td>
                <Td>{location.state}</Td>

                <Td align="right">{location.zip}</Td>
              </ClickableTr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Name</Th>
              <Th>Address</Th>
              <Th>Address Ext</Th>
              <Th>City</Th>
              <Th>State</Th>
              <Th align="right">Zip</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={locations.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 100]}
      />
    </>
  );
}
