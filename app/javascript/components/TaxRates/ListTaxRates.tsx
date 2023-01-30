import {
  Button,
  Divider,
  Flex,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  theme,
  Tr,
} from "@chakra-ui/react";
import { TablePagination } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { GiPayMoney } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import Hero from "../../ui/hero";
import { Loading } from "../../ui/Loading";
import { ClickableTr } from "../../ui/table";

export default function ListTaxRates() {
  const navigate = useNavigate();

  const [taxRates, setTaxRates] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTaxRates = async () => {
    const res = await axios.get("/tax_rates.json");
    setTaxRates(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTaxRates();
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
      {!taxRates.length ? (
        <Hero
          title="No Tax Rates"
          subtitle="You have not added any tax rates."
          button={{ text: "Add a Tax Rate", url: "/tax_rates/new" }}
          icon={<GiPayMoney size="48px" color={theme.colors.purple[500]} />}
        />
      ) : (
        <>
          <Flex justifyContent="space-between" mb="15">
            <Flex alignItems={"center"}>
              <Heading size="md" mx={"10px"}>
                Tax Rates
              </Heading>
              <GiPayMoney size={36} color={theme.colors.purple[500]} />
            </Flex>

            <Button
              colorScheme="purple"
              onClick={() => navigate("/tax_rates/new")}
            >
              Add a Tax Rate
            </Button>
          </Flex>
          <Divider />
          <TableContainer w="100%">
            <Table variant="striped">
              <TableCaption>Tax Rates</TableCaption>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th align="right">Description</Th>
                  <Th align="right">Type</Th>
                  <Th align="right">Percentage</Th>
                </Tr>
              </Thead>
              <Tbody>
                {(rowsPerPage > 0
                  ? taxRates.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : taxRates
                ).map((taxRate) => (
                  <ClickableTr
                    key={taxRate.id}
                    hover
                    onClick={() => navigate(`/tax_rates/${taxRate.id}/edit`)}
                  >
                    <Td>
                      {taxRate.display_name}
                      {taxRate.default && (
                        <Tag colorScheme="purple" ml={4}>
                          Default
                        </Tag>
                      )}
                    </Td>
                    <Td align="right">{taxRate.description}</Td>
                    <Td align="right">
                      {taxRate.inclusive ? "Inclusive" : "Exclusive"}
                    </Td>
                    <Td align="right">{taxRate.percentage}</Td>
                  </ClickableTr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={taxRates.length}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}
    </>
  );
}
