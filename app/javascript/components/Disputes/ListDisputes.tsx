import { TablePagination } from "@material-ui/core";
import React, { useEffect, useState } from "react";

import {
  Badge,
  Divider,
  Flex,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  theme,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { GiHealingShield } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import Hero from "../../ui/hero";
import { Loading } from "../../ui/Loading";
import { ClickableTr } from "../../ui/table";
import dayjs from "dayjs";
import { currencyFormat } from "../utils";
function ListDisputes() {
  const navigate = useNavigate();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [disputes, setDisputes] = useState([]);

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDisputes = async () => {
    const res = await axios.get("/disputes.json");

    console.log(location);
    setDisputes(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDisputes();
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
      {!disputes.length ? (
        <Hero
          title="No Disputes"
          subtitle="Yay!"
          icon={<GiHealingShield size={48} color={theme.colors.purple[500]} />}
        />
      ) : (
        <>
          <Flex justifyContent="space-between" mb="15">
            <Flex alignItems={"center"}>
              <Heading size="md" mx={"10px"}>
                Disputes
              </Heading>
              <GiHealingShield size={36} color={theme.colors.purple[500]} />
            </Flex>
          </Flex>
          <Divider />

          <TableContainer overflowX={"scroll"}>
            <Table variant="striped">
              <TableCaption>Disputes</TableCaption>
              <Thead>
                <Tr>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                  <Th>Customer</Th>
                  <Th>Fee</Th>
                  <Th>Net</Th>
                  <Th>Evidence Due By</Th>

                  <Th>Created</Th>
                </Tr>
              </Thead>
              <Tbody>
                {(rowsPerPage > 0
                  ? disputes.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : disputes
                ).map((dispute) => {
                  console.log(dispute);
                  return (
                    <ClickableTr
                      key={dispute.id}
                      onClick={() => navigate(`/disputes`)}
                    >
                      <Td>{currencyFormat(dispute.amount / 100)}</Td>
                      <Td>
                        <Badge colorScheme="orange">{dispute.status}</Badge>
                      </Td>
                      <Td>{dispute.evidence.customer_email_address}</Td>
                      <Td>
                        {dispute.balance_transactions.length > 0
                          ? currencyFormat(
                              dispute.balance_transactions[0].fee / 100
                            )
                          : 0}
                      </Td>
                      <Td>
                        {dispute.balance_transactions.length > 0
                          ? currencyFormat(
                              dispute.balance_transactions[0].net / 100
                            )
                          : 0}
                      </Td>
                      <Td>
                        {dayjs
                          .unix(dispute?.evidence_details?.due_by)
                          .format("M/D/YY h:mm a")}
                      </Td>
                      <Td>
                        {dayjs.unix(dispute.created).format("M/D/YY h:mm a")}
                      </Td>
                    </ClickableTr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={disputes.length}
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

export default ListDisputes;
