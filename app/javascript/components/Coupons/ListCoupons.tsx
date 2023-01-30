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
  Th,
  Thead,
  theme,
  Tr,
} from "@chakra-ui/react";
import { TablePagination } from "@material-ui/core";
import MoneyOffIcon from "@material-ui/icons/MoneyOff";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../../ui/hero";
import { Loading } from "../../ui/Loading";
import { MdMoneyOff } from "react-icons/md";
import { ClickableTr } from "../../ui/table";
import { GiTicket } from "react-icons/gi";

export function ListCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchCoupons = async () => {
    const res = await axios("/coupons.json");

    setCoupons(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

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
      {!coupons.length ? (
        <Hero
          title="No Coupons"
          subtitle="No coupons to show, click the button below to add some."
          icon={<GiTicket size="48px" color={theme.colors.purple[500]} />}
          button={{ text: "Add a coupon", url: "/coupons/new" }}
        />
      ) : (
        <>
          <Flex justifyContent="space-between" mb="15">
            <Flex alignItems={"center"}>
              <Heading size="md" mx={"10px"}>
                Coupons
              </Heading>
              <GiTicket size={36} color={theme.colors.purple[500]} />
            </Flex>
            <Button
              colorScheme="purple"
              onClick={() => navigate("/coupons/new")}
            >
              Add coupon
            </Button>
          </Flex>
          <Divider />

          <TableContainer w="100%">
            <Table variant="striped">
              <TableCaption>Coupons</TableCaption>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th align="right">Duration</Th>
                  <Th align="right">Percent off</Th>
                  <Th align="right">Amount off</Th>
                </Tr>
              </Thead>
              <Tbody>
                {(rowsPerPage > 0
                  ? coupons.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : coupons
                ).map((coupon) => (
                  <ClickableTr
                    key={coupon.id}
                    hover
                    onClick={() => navigate(`/coupons/${coupon.id}/edit`)}
                  >
                    <Td>{coupon.name}</Td>
                    <Td align="right">{coupon.duration}</Td>
                    <Td align="right">
                      {coupon.percent_off ? `${coupon.percent_off} %` : ""}
                    </Td>
                    <Td align="right">
                      {coupon.amount_off
                        ? `$${(coupon.amount_off / 100).toFixed(2)}`
                        : ""}
                    </Td>
                  </ClickableTr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={coupons.length}
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
