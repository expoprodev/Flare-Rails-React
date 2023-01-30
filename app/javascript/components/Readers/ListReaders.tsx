import React, { useState, useEffect } from "react";
import { TablePagination } from "@material-ui/core";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import Hero from "../../ui/hero";
import { Loading } from "../../ui/Loading";
import {
  Flex,
  Heading,
  Button,
  Divider,
  Tr,
  TableContainer,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  theme,
} from "@chakra-ui/react";
import { ClickableTr } from "../../ui/table";
import { GiBank, GiCalculator, GiPsychicWaves, GiShop } from "react-icons/gi";
import { BsCreditCard2Front } from "react-icons/bs";
function ListReaders() {
  const navigate = useNavigate();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [readers, setReaders] = useState([]);
  const [defaultLocation, setDefaultLocation] = useState({
    id: "",
    name: "",
    stripe_location_id: "",
  });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchReaders = async () => {
    const res = await axios.get("/readers.json");
    const location = await axios.get("/default-location.json");
    console.log(location);
    setReaders(res.data);
    setDefaultLocation(location.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReaders();
  }, []);

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };

  return loading ? (
    <Loading />
  ) : (
    <>
      {defaultLocation.stripe_location_id ? (
        <>
          {!readers.length ? (
            <Hero
              title="No Readers"
              subtitle="You have not added any readers. Add a reader to start scanning credit cards."
              button={{ text: "Add reader", url: "/readers/new" }}
              icon={
                <BsCreditCard2Front
                  size={48}
                  color={theme.colors.purple[500]}
                />
              }
            />
          ) : (
            <>
              <Flex justifyContent="space-between" mb="15">
                <Flex alignItems={"center"}>
                  <Heading size="md" mx={"10px"}>
                    Card Readers
                  </Heading>
                  <BsCreditCard2Front
                    size={36}
                    color={theme.colors.purple[500]}
                  />
                </Flex>

                <Button
                  colorScheme="purple"
                  onClick={() => navigate("/readers/new")}
                >
                  Add a Card Reader
                </Button>
              </Flex>
              <Divider />

              <TableContainer w="100%">
                <Table variant="striped">
                  <TableCaption>Card Readers</TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Nickname</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {(rowsPerPage > 0
                      ? readers.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : readers
                    ).map((reader) => (
                      <ClickableTr
                        key={reader.id}
                        onClick={() => navigate(`/readers/${reader.id}/edit`)}
                      >
                        <Td>{reader.label}</Td>
                      </ClickableTr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={readers.length}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </>
          )}
        </>
      ) : (
        <Hero
          title="Enable card readers at this location?"
          subtitle="To start using credit card readers at this location, you must enable this feature."
          button={{ text: "Enable", url: "/enable-readers" }}
        />
      )}
    </>
  );
}

export default ListReaders;
