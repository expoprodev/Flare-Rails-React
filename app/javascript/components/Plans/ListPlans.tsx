import {
  Flex,
  Heading,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Table,
  TableContainer,
  Button,
  Tag,
  Divider,
  theme,
} from "@chakra-ui/react";
import { TablePagination } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { GiHealthPotion } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import Hero from "../../ui/hero";
import { Loading } from "../../ui/Loading";
import { ClickableTr } from "../../ui/table";

function ListPlans() {
  const navigate = useNavigate();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    const res = await axios.get("/plans.json");
    console.log("res", res);
    setPlans(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
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
      {!plans.length ? (
        <Hero
          title="No plans"
          subtitle="Add a plan to start using memberships."
          button={{ text: "Add a plan", url: "/plans/new" }}
          icon={<GiHealthPotion size={48} color={theme.colors.purple[500]} />}
        />
      ) : (
        <>
          <Flex justifyContent="space-between" mb="15">
            <Flex alignItems={"center"}>
              <Heading size="md" mx={"10px"}>
                Plans
              </Heading>
              <GiHealthPotion size={36} color={theme.colors.purple[500]} />
            </Flex>
            <Button colorScheme="purple" onClick={() => navigate("/plans/new")}>
              Add plan
            </Button>
          </Flex>
          <Divider />
          <TableContainer w="100%">
            <Table variant="striped">
              <TableCaption>Plans</TableCaption>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th align="right">Interval</Th>
                  <Th align="right">Amount</Th>
                </Tr>
              </Thead>
              <Tbody>
                {(rowsPerPage > 0
                  ? plans.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : plans
                ).map((plan) => (
                  <ClickableTr
                    key={plan.id}
                    onClick={() => navigate(`/plans/${plan.id}/edit`)}
                  >
                    <Td>
                      {plan.name}
                      {plan.default && (
                        <Tag ml={4} colorScheme="purple">
                          Default
                        </Tag>
                      )}
                    </Td>
                    <Td align="right">{plan.interval}</Td>
                    <Td align="right">${plan.amount / 100}</Td>
                  </ClickableTr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={plans.length}
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

export default ListPlans;
