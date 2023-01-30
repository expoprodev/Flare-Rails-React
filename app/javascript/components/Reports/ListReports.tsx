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

export default function ListReports() {
  const [reports, setReports] = useState([]);
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

  const fetchReports = async () => {
    const response = await axios.get(`/reports.json`);
    setReports(response.data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchReports();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <>
      {!reports.length ? (
        <Hero
          title="No Reports"
          subtitle="You have not created any reports."
          icon={<GiScrollQuill size="48px" color={theme.colors.purple[500]} />}
          button={{ text: "Create a Report", url: "/reports/new" }}
        />
      ) : (
        <>
          <Flex justifyContent="space-between" mb="15">
            <Flex alignItems={"center"}>
              <Heading size="md" mx={"10px"}>
                Reports
              </Heading>
              <GiScrollQuill size={36} color={theme.colors.purple[500]} />
            </Flex>
            <Button
              colorScheme="purple"
              onClick={() => navigate("/reports/new")}
            >
              Create a Report
            </Button>
          </Flex>
          <Divider />

          <TableContainer w="100%">
            <Table variant="striped">
              <TableCaption>Reports</TableCaption>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Date Range</Th>
                  <Th>Created</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {reports.map((report) => (
                  <ClickableTr
                    key={report.id}
                    onClick={() => {
                      if (report.status === 1) {
                        window.location.href = `/reports/${report.id}`;
                      }
                    }}
                  >
                    <Td>{report.name}</Td>
                    <Td>
                      {report.start_date} - {report.end_date}
                    </Td>
                    <Td>{report.created_at}</Td>
                    <Td>{report.status === 0 ? "Generating" : "Download"}</Td>
                  </ClickableTr>
                ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>Name</Th>
                  <Th>Date Range</Th>
                  <Th>Created</Th>
                  <Th>Action</Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={reports.length}
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
