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
import Hero from "../../ui/hero";
import { GiScrollQuill } from "react-icons/gi";

export default function ListResponses() {
  const [responses, setResponses] = useState([]);
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

  const fetchResponses = async () => {
    const response = await axios.get(`/responses.json`);
    setResponses(response.data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchResponses();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <>
      {!responses.length ? (
        <Hero
          title="No Responses"
          subtitle="You have not added any responses."
          button={{ text: "Add a Response", url: "/responses/new" }}
          icon={<GiScrollQuill size={48} color={theme.colors.purple[500]} />}
        />
      ) : (
        <>
          <Flex justifyContent="space-between" mb="15">
            <Flex alignItems={"center"}>
              <Heading size="md" mx={"10px"}>
                SMS Responses
              </Heading>
              <GiScrollQuill size={36} color={theme.colors.purple[500]} />
            </Flex>
            <Button
              colorScheme="purple"
              onClick={() => navigate("/responses/new")}
            >
              Add a Response
            </Button>
          </Flex>
          <Divider />

          <TableContainer w="100%">
            <Table variant="striped">
              <TableCaption>Responses</TableCaption>
              <Thead>
                <Tr>
                  <Th>Message</Th>
                </Tr>
              </Thead>
              <Tbody>
                {responses.map((response) => (
                  <ClickableTr
                    key={response.id}
                    onClick={() => navigate(`/responses/${response.id}/edit`)}
                  >
                    <Td>{response.message}</Td>
                  </ClickableTr>
                ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>Message</Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={responses.length}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 100]}
          />
        </>
      )}
    </>
  );
}
