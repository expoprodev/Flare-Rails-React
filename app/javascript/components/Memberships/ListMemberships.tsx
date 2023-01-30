import { CircularProgress, debounce, TablePagination } from "@material-ui/core";

import axios from "axios";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { GiHealthPotion, GiPayMoney } from "react-icons/gi";
import Hero from "../../ui/hero";

import { SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Tag,
  Text,
  theme,
  useColorModeValue,
} from "@chakra-ui/react";
import { GiBroadsword } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { formatPhoneNumber } from "../utils";

const Loading = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const getInitials = (name = "") =>
  name
    .replace(/\s+/, " ")
    .split(" ")
    .slice(0, 2)
    .map((v) => v && v[0].toUpperCase())
    .join("");

export default function ListMemberships() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [terms, setTerms] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(1);
  const [initTotal, setInitTotal] = useState(1);
  const [allLoc, setAllLoc] = useState(false);
  const [taxRates, setTaxRates] = useState([]);
  const navigate = useNavigate();

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };

  const search = async (terms, rowsPerPage, page, allLoc) => {
    const response = await axios.get(
      `/membership-search?query=${terms}&page=${page}&per_page=${rowsPerPage}&all_loc=${allLoc}`
    );
    setSearchResults(response.data.memberships);
    setTotal(response.data.total);
    setLoading(false);
  };
  const fetchMemberships = async () => {
    const response = await axios.get(
      `/membership-search?query=${terms}&page=${page}&per_page=${rowsPerPage}&all_loc=${allLoc}`
    );
    setInitTotal(response.data.total);
  };
  const fetchPlans = async () => {
    const res = await axios.get("/plans.json");
    console.log("res", res);
    setPlans(res.data);
    setLoading(false);
  };

  const fetchTaxRates = async () => {
    const res = await axios.get("/tax_rates.json");
    setTaxRates(res.data);
    setLoading(false);
  };

  const searchDebounced = useCallback(
    debounce((terms, rowsPerPage, page, allLoc) => {
      search(terms, rowsPerPage, page, allLoc);
    }, 300),
    []
  ) as any;

  useEffect(() => {
    setLoading(true);
    searchDebounced(terms, rowsPerPage, page, allLoc);
  }, [terms, rowsPerPage, page, allLoc]);

  useEffect(() => {
    fetchMemberships();
    fetchPlans();
    fetchTaxRates();
  }, []);

  return (
    <>
      {taxRates.length === 0 ? (
        <Hero
          title="You have not added any tax rates."
          subtitle="Please add a tax rate before adding memberships"
          button={{ text: "Add a tax rate", url: "/tax_rates/new" }}
          icon={<GiPayMoney size={48} color={theme.colors.purple[500]} />}
        />
      ) : (
        <>
          {plans.length === 0 ? (
            <Hero
              title="You have not added any plans."
              subtitle="Please add a plan before adding memberships"
              button={{ text: "Add a plan", url: "/plans/new" }}
              icon={
                <GiHealthPotion size={48} color={theme.colors.purple[500]} />
              }
            />
          ) : (
            <>
              {!initTotal ? (
                <Hero
                  title="No Members"
                  subtitle="You have not added any members."
                  button={{ text: "Add a membership", url: "/memberships/new" }}
                  icon={
                    <GiBroadsword size={48} color={theme.colors.purple[500]} />
                  }
                />
              ) : (
                <>
                  <div>
                    <Flex justifyContent="space-between" mb="15">
                      <Flex alignItems={"center"}>
                        <Heading size="md" mx={"10px"}>
                          Members
                        </Heading>
                        <GiBroadsword
                          size={36}
                          color={theme.colors.purple[500]}
                        />
                      </Flex>
                      <Button
                        colorScheme="purple"
                        onClick={() => navigate("/memberships/new")}
                      >
                        Add member
                      </Button>
                    </Flex>

                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        children={<SearchIcon color="gray.300" />}
                      />
                      <Input
                        placeholder="Search Members"
                        value={terms}
                        onChange={(e) => setTerms(e.target.value)}
                      />
                    </InputGroup>

                    <Checkbox
                      my="4"
                      checked={allLoc}
                      onChange={(e) => setAllLoc(!allLoc)}
                    >
                      Include All Locations
                    </Checkbox>
                  </div>

                  {loading ? (
                    <Loading>
                      <CircularProgress />
                    </Loading>
                  ) : (
                    <>
                      {searchResults.map((membership) => (
                        <>
                          <Box
                            bg="bg-surface"
                            px={{ base: "4", md: "6" }}
                            py="5"
                            boxShadow={useColorModeValue("sm", "sm-dark")}
                            borderRadius="lg"
                            mb="5"
                          >
                            <Stack
                              spacing="4"
                              cursor={"pointer"}
                              direction={{ base: "column", sm: "row" }}
                              justify="space-between"
                              key={membership.id}
                              onClick={() =>
                                navigate(`/memberships/${membership.id}`)
                              }
                            >
                              <HStack spacing="4">
                                <Avatar
                                  name={
                                    !!membership.name
                                      ? getInitials(membership.name)
                                      : "-"
                                  }
                                  src={membership.avatarUrl}
                                  boxSize={{ base: "12", sm: "14" }}
                                />
                                <Box>
                                  <HStack>
                                    <Text fontSize="lg" fontWeight="medium">
                                      {membership.name} {membership.last_name}
                                    </Text>
                                  </HStack>
                                  <Text color="muted" fontSize="sm">
                                    {membership.email} &middot;{" "}
                                    {formatPhoneNumber(membership.phone)}
                                  </Text>
                                  {membership.additional_members.length > 0 && (
                                    <Text color="muted" fontSize="sm">
                                      Additional members:{" "}
                                      {membership.additional_members.join(", ")}{" "}
                                    </Text>
                                  )}
                                  <Text color="muted" fontSize="sm">
                                    {membership.notes}
                                  </Text>
                                  <Text color="muted" fontSize="sm">
                                    Quantity: {membership.quantity} &middot;
                                    Member since:{" "}
                                    {dayjs(membership.created_at).format(
                                      "M/D/YY h:mm a"
                                    )}
                                  </Text>
                                </Box>
                              </HStack>
                              <Stack direction="row" spacing="3">
                                <div>
                                  {" "}
                                  {membership.stripe_subscription_metadata ? (
                                    <Tag
                                      colorScheme={
                                        membership.stripe_subscription_metadata
                                          .status === "active" ||
                                        membership.stripe_subscription_metadata
                                          .status === "trialing"
                                          ? "green"
                                          : "red"
                                      }
                                    >
                                      {membership.stripe_subscription_metadata
                                        .status === "trialing"
                                        ? "active"
                                        : membership
                                            .stripe_subscription_metadata
                                            .status}
                                    </Tag>
                                  ) : (
                                    <Tag colorScheme="red">Inactive</Tag>
                                  )}
                                </div>
                              </Stack>
                            </Stack>
                          </Box>
                        </>
                      ))}
                    </>
                  )}

                  <TablePagination
                    component="div"
                    count={total}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 100]}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
