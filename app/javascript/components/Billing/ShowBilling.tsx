import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@material-ui/core";

import axios from "axios";
import { Loading } from "../../ui/Loading";
import {
  Box,
  Button,
  Flex,
  Heading,
  Divider,
  useToast,
  theme,
} from "@chakra-ui/react";
import { FiExternalLink } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { GiBossKey } from "react-icons/gi";
import { EditIcon } from "@chakra-ui/icons";

export default function ShowBilling() {
  const [company, setCompany] = useState({ stripe_user_id: "" });
  const [connectedAccount, setConnectedAccount] = useState({});
  const [stripeConnectUrl, setStripeConnectUrl] = useState("");
  const [stripePortalUrl, setStripePortalUrl] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);

  const handleConfirm = () => {
    setOpen(true);
  };

  const handleDelete = async () => {
    // await axios.delete(`/users/${user.id}.json`);
    setOpen(false);
    navigate("/settings");
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function fetchData() {
    const res = await axios.get("/billing.json");

    console.log("res", res);
    setCompany(res.data.company);
    setConnectedAccount(res.data.connected_account);
    setStripeConnectUrl(res.data.stripe_connect_url);
    setStripePortalUrl(res.data.stripe_portal_url);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <>
      <Flex justifyContent="space-between" mb="15">
        <Flex alignItems={"center"} mb={8}>
          <Heading size="md" mx={"10px"}>
            Edit Business Settings
          </Heading>
          <GiBossKey size={36} color={theme.colors.purple[500]} />
        </Flex>
        <Box>
          <Button
            onClick={() => navigate(`/companies/${company.id}/edit`)}
            mr={2}
            leftIcon={<EditIcon />}
          >
            Edit
          </Button>
          <Button
            colorScheme="purple"
            onClick={() => window.open(stripePortalUrl)}
            leftIcon={<FiExternalLink size={20} />}
          >
            Stripe Portal
          </Button>
        </Box>
      </Flex>
      <Divider />
      <>
        <Typography>Name: {company.name}</Typography>
        <Typography>Address: {company.address}</Typography>
        <Typography>Address Ext: {company.address_ext}</Typography>
        <Typography>City: {company.city}</Typography>
        <Typography>State: {company.state}</Typography>
        <Typography>Zip: {company.zip}</Typography>
        Press start phone number: {company.program_code}
      </>
      <Heading size={"md"}>Stripe Connect</Heading>
      {company.stripe_user_id ? (
        <>
          {connectedAccount.external_accounts.data.map((ea) => (
            <>
              <Typography>Bank: {ea.bank_name}</Typography>
              <Typography>Routing Number: {ea.routing_number}</Typography>
              <Typography>Account Number: {ea.last4}</Typography>
            </>
          ))}
          <>
            <Divider my={8} />
            <Heading mb="4" size="md">
              Danger Area
            </Heading>
            <Box mr={2}>
              <Button colorScheme="red" onClick={handleConfirm}>
                Disconnect
              </Button>
            </Box>
          </>
        </>
      ) : (
        <Button
          colorScheme="purple"
          onClick={() => window.open(stripeConnectUrl)}
        >
          Connect With Stripe
        </Button>
      )}

      {company.stripe_customer && (
        <>
          <strong>Current Card:</strong>
          <br />
          {company.stripe_customer.brand}ending in{" "}
          {company.stripe_customer.last4}
        </>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will disconnect your Stripe account. You will no longer be able
            to accept payments.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} colorScheme="red">
            Disconnect
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
