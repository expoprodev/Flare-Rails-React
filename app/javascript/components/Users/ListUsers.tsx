import { TablePagination } from "@material-ui/core";

import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

import {
  Avatar,
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
import { GiMeepleGroup } from "react-icons/gi";

const getInitials = (name = "") =>
  name
    .replace(/\s+/, " ")
    .split(" ")
    .slice(0, 2)
    .map((v) => v && v[0].toUpperCase())
    .join("");

export default function ListUsers() {
  const [users, setUsers] = useState([]);
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

  const fetchUsers = async () => {
    const response = await axios.get(`/users.json`);
    setUsers(response.data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchUsers();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <>
      <Flex justifyContent="space-between" mb="15">
        <Flex alignItems={"center"}>
          <Heading size="md" mx={"10px"}>
            Users
          </Heading>
          <GiMeepleGroup size={36} color={theme.colors.purple[500]} />
        </Flex>
        <Button colorScheme="purple" onClick={() => navigate("/users/new")}>
          Invite User
        </Button>
      </Flex>
      <Divider />

      <TableContainer w="100%">
        <Table variant="striped">
          <TableCaption>Users</TableCaption>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Last Logged In</Th>
              <Th>Role</Th>
              <Th align="right">Pin</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => {
              console.log(user);
              return (
                <ClickableTr
                  key={user.id}
                  onClick={() => navigate(`/users/${user.id}/edit`)}
                >
                  <Td>
                    <Flex alignItems="center" justify-content="space-between">
                      <Avatar
                        name={!!user.name ? getInitials(user.name) : "-"}
                        src={user.avatarUrl}
                        mr="8"
                      />
                      {user.name} {user.last_name}
                    </Flex>
                  </Td>
                  <Td>{user.email}</Td>
                  <Td>
                    {user?.last_sign_in_at
                      ? dayjs(user?.last_sign_in_at).format("M/D/YY h:mm a")
                      : "Not yet logged in"}
                    {}
                  </Td>
                  <Td align="right">{user.role}</Td>

                  <Td align="right">{user.pin}</Td>
                </ClickableTr>
              );
            })}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Last Logged In</Th>
              <Th>Role</Th>
              <Th align="right">Pin</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={users.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 100]}
      />
    </>
  );
}
