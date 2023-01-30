import { ArrowBackIcon, CheckIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  LinkBox,
  LinkOverlay,
  Table,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import {
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Select,
  TableContainer,
  TextField,
  Typography,
} from "@material-ui/core";
import { loadStripeTerminal } from "@stripe/terminal-js";
import axios from "axios";
import dayjs from "dayjs";
import { Html4Entities } from "html-entities";
import { round } from "lodash";
import React, { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { useParams } from "react-router-dom";
import { PaymentMethod } from "../../types";
import { Loading } from "../../ui/Loading";
import SimpleDialog from "../../ui/SimpleDialog";
import { formatPhoneNumber } from "../utils";
import { AdditionalMembers } from "./AdditionalMembers";
import AddSubscription from "./AddSubscription";
import DeleteMemberDialog from "./DeleteMemberDialog";
import EditMembership from "./EditMembership";
import EditSubscription from "./EditSubscription";
import ReceiptDialog from "./ReceiptDialog";

let terminal;
const entities = new Html4Entities();

export default function ShowMembership() {
  const [showEditMember, setShowEditMember] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showPaymentUpdate, setShowPaymentUpdate] = useState(false);
  const [showManualForm, setShowManualForm] = useState(true);
  const [showReaders, setShowReaders] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [showReaderInstructions, setShowReaderInstructions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>();
  const [availableReaders, setAvailableReaders] = useState([]);
  const [readerLoadingText, setReaderLoadingText] = useState("");
  const [showAttachSubscription, setShowAttachSubscription] = useState(false);
  const [showEditSubscription, setShowEditSubscription] = useState(false);
  const [showDeleteMember, setShowDeleteMember] = useState(false);
  const [showRefund, setShowRefund] = useState(false);
  const [showSignpad, setShowSignpad] = useState(false);
  const [isChangingSubscriptionStatus, setIsChangingSubscriptionStatus] =
    useState({});
  const [isDetachingPaymentMethod, setIsDetachingPaymentMethod] = useState({});
  const [isSavingPaymentMethod, setIsSavingPaymentMethod] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const [paymentCardNumber, setPaymentCardNumber] = useState("");
  const [paymentCardMonth, setPaymentCardMonth] = useState("");
  const [paymentCardYear, setPaymentCardYear] = useState("");
  const [paymentCardCvc, setPaymentCardCvc] = useState("");

  const [subToEdit, setSubToEdit] = useState({});

  const [charge, setCharge] = useState<{ id?: string; amount?: number }>({});
  const [reason, setReason] = useState();
  const [subToCancel, setSubToCancel] = useState("");
  const [membership, setMembership] = useState({
    id: 0,
    name: "",
    last_name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [stripeMembership, setStripeMembership] = useState({
    subscriptions: {
      data: [{ invoice_settings: { default_payment_method: "" } }],
    },
  });
  const [locationName, setLocationName] = useState();
  const [additionalMembers, setAdditionalMembers] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState({ data: [] });
  const [stripeLocationId, setStripeLocationId] = useState("");
  const [checkins, setCheckins] = useState([]);
  const [charges, setCharges] = useState({ data: [] });
  const [audits, setAudits] = useState([]);
  const [locations, setLocations] = useState([]);
  const [taxRates, setTaxRates] = useState([{ stripe_metadata: { id: "" } }]);
  const [coupons, setCoupons] = useState([]);
  const [plans, setPlans] = useState([{ stripe_plan_id: "" }]);

  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();

  const params = useParams();
  const fetchMember = async () => {
    const res = await axios.get(`/memberships/${params.id}.json`);

    setMembership(res.data.membership);
    setStripeMembership(res.data.stripe_membership);
    setLocationName(res.data.location_name);
    setAdditionalMembers(res.data.additional_members);
    setPaymentMethods(res.data.payment_methods);
    setCharges(res.data.charges);
    setCheckins(res.data.checkins);
    setAudits(res.data.audits);
    setLocations(res.data.locations);
    setTaxRates(res.data.tax_rates);
    setCoupons(res.data.coupons);
    setPlans(res.data.plans);
    setStripeLocationId(res.data.stripe_location_id);

    setIsLoading(false);
  };

  useEffect(() => {
    fetchMember();
  }, []);

  const fetchConnectionToken = async () => {
    // Your backend should call /v1/terminal/connection_tokens and return the JSON response from Stripe
    return fetch("/connection-token", { method: "POST" })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        return data.secret;
      });
  };
  const unexpectedDisconnect = (error) => {
    // Your backend should call /v1/terminal/connection_tokens and return the JSON response from Stripe
    console.log(error);
    return { error };
  };

  const discorverReaders = async () => {
    setShowManualForm(false);
    setReaderLoadingText("Searching ...");
    const StripeTerminal = await loadStripeTerminal();

    terminal = StripeTerminal.create({
      onFetchConnectionToken: fetchConnectionToken,
      onUnexpectedReaderDisconnect: unexpectedDisconnect,
    });

    const readers = await terminal.discoverReaders({
      location: stripeLocationId,
    });
    if (!!readers.length) {
      selectReader(readers[0]);
    }
    setReaderLoadingText("");
    setShowReaders(true);
    setAvailableReaders(readers.discoveredReaders);
  };

  const cancelReusableCard = async () => {
    await terminal.cancelReadReusableCard();
    await terminal.disconnectReader();
    setShowReaderInstructions(false);
  };

  const selectReader = async (reader) => {
    setReaderLoadingText("Connecting ...");
    setShowReaders(false);
    const connectResult = await terminal.connectReader(reader);
    setReaderLoadingText("");
    if (connectResult.error) {
      console.log("Failed to connect: ", connectResult.error);
    } else {
      console.log("Connected to reader: ", connectResult.reader.label);
      setShowReaderInstructions(true);
      setShowReaders(false);

      const result = await terminal.readReusableCard();

      if (result.error) {
        // Placeholder for handling result.error
        console.log(result.error);
      } else {
        // Placeholder for sending result.payment_method.id to your backend.
        setPaymentMethod(result.payment_method);
        setShowPaymentMethod(true);
        setShowReaderInstructions(false);
        setShowReaders(false);
        await terminal.disconnectReader();
        console.log(result);
      }
    }
  };

  const clearPayment = () => {
    setPaymentMethod(null);
    setShowPaymentMethod(false);
  };

  const closeConfirmCancel = () => {
    setShowConfirmCancel(false);
  };
  const closePaymentUpdate = () => {
    setShowPaymentUpdate(false);
  };

  const cancelMembership = async () => {
    setIsCanceling(true);
    await axios.post(
      `/memberships/${membership.id}/cancel_cycle_end/${subToCancel}`
    );
    fetchMember();
    closeConfirmCancel();
    setIsCanceling(false);
  };
  const reverseCancelMembership = async (subscription_id) => {
    setIsChangingSubscriptionStatus({ [subscription_id]: true });
    await axios.post(`/memberships/${membership.id}/reverse_cancel_cycle_end`, {
      membership: { subscription_id },
    });
    closeConfirmCancel();
    setIsChangingSubscriptionStatus({ [subscription_id]: false });
    fetchMember();
  };
  const detachPaymentMethod = async (payment_method_id: string) => {
    setIsDetachingPaymentMethod({ [payment_method_id]: true });
    await axios.post(`/memberships/${membership.id}/detach_payment_method`, {
      payment_method_id,
    });
    await fetchMember();
    closeConfirmCancel();
    setIsDetachingPaymentMethod({ [payment_method_id]: false });
  };

  const handlePaymentUpdateSubmit = async () => {
    setIsSavingPaymentMethod(true);
    const payload = {
      payment_method_id: paymentMethod?.id,
      card_number: paymentCardNumber.replace(/\s/g, ""),
      card_exp_month: paymentCardMonth,
      card_exp_year: paymentCardYear,
      card_cvc: paymentCardCvc,
    };

    try {
      await axios.post(
        `/memberships/${membership.id}/attach_payment_method`,
        payload
      );
      await fetchMember();
      setIsSavingPaymentMethod(false);
      setShowPaymentUpdate(false);
    } catch (error) {
      setIsSavingPaymentMethod(false);
      toast({
        title: "Payment method error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleEditMemberSubmit = async (values) => {
    await axios.put(`/memberships/${membership.id}`, {
      membership: {
        ...values,
      },
    });
    setShowEditMember(false);
    fetchMember();
  };
  const handleAttachSubscriptionSubmit = async (values) => {
    await axios.post(`/memberships/${membership.id}/attach_subscription`, {
      membership: {
        ...values,
      },
    });
    setShowAttachSubscription(false);
    fetchMember();
  };

  const handleEditSubscriptionSubmit = async (values) => {
    await axios.post(`/memberships/${membership.id}/edit_subscription`, {
      membership: {
        ...values,
      },
    });
    toast({
      title: "Subscription updated.",
      description: "Subscription was successfully updated.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    setSubToEdit({});
    setShowEditSubscription(false);
    fetchMember();
  };

  const handleDeleteMember = async () => {
    await axios.delete(`/memberships/${membership.id}`);
    setShowDeleteMember(false);
    fetchMember();
  };

  const handleRefund = async () => {
    const res = await axios.post(`/memberships/${membership.id}/refund`, {
      membership: {
        charge_amount: charge.amount,
        charge_id: charge?.id,
        refund_reason: reason,
      },
    });
    if (res.data.error) {
      toast({
        title: "Error",
        description: res.data.error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    setShowRefund(false);
    fetchMember();
  };

  const handleCheckin = async () => {
    await axios.post(`/memberships/${membership.id}/checkin`);
    toast({
      title: "Member checked in.",
      description: "Member was successfully checked in.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    fetchMember();
  };

  const handleRemoveAdditionalMember = async (additional_member_id) => {
    await axios.post(`/memberships/${membership.id}/remove-additional-member`, {
      membership: { additional_member_id },
    });
    fetchMember();
    toast({
      title: "Member removed",
      description: "Member was successfully removed.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  const handleAddAdditionalMembers = async (additional_member) => {
    await axios.post(`/memberships/${membership.id}/add-additional-member`, {
      membership: { ...additional_member },
    });
    fetchMember();
    toast({
      title: "Member added",
      description: "Member was successfully added.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  const onRefund = async (charge) => {
    setShowRefund(true);
    setCharge(charge);
  };

  const subs = stripeMembership.subscriptions?.data || [];

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <LinkBox as="article" maxW="sm">
        <LinkOverlay href="/memberships">
          <Heading mb="10" size="md">
            <ArrowBackIcon /> Back
          </Heading>
        </LinkOverlay>
      </LinkBox>

      <Flex alignItems="center" justifyContent="space-between" mb={4}>
        <Heading alignSelf="flex-start">
          {membership.name} {membership.last_name}
        </Heading>
        <Flex alignItems="center" justifyContent="flex-end">
          <Button
            onClick={() => setShowEditMember(true)}
            colorScheme="purple"
            mr={2}
            leftIcon={<EditIcon />}
          >
            Edit
          </Button>
          <Button onClick={handleCheckin} mr={2} leftIcon={<CheckIcon />}>
            Check In
          </Button>
          <Button onClick={() => setShowSignpad(true)}>View Signature</Button>
        </Flex>
      </Flex>

      <Typography variant="subtitle1">
        {membership.email} - {formatPhoneNumber(membership.phone)}
      </Typography>
      {membership.notes && (
        <Typography variant="subtitle1">Notes: {membership.notes}</Typography>
      )}
      <Typography variant="subtitle1">Home Location: {locationName}</Typography>
      <Box my={8}>
        <Divider />
      </Box>
      <Heading size="md" mb="4">
        Subscriptions
      </Heading>

      <TableContainer>
        <Table variant="simple" borderWidth="1px" rounded="md">
          <Thead>
            <Tr>
              <Th>Plan</Th>
              <Th align="right">Quantity</Th>
              <Th align="right">Status</Th>
              <Th align="right">Trial Ends</Th>
              <Th align="right">Valid Until</Th>
              <Th align="right">Total</Th>
              <Th align="right">Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {subs.length > 0 ? (
              subs.map((s) => (
                <Tr key={s.id}>
                  <Td>
                    {s.plan.nickname} (${s.plan.amount / 100}/{s.plan.interval})
                  </Td>
                  <Td align="right">
                    <Tag>{s.quantity}</Tag>
                  </Td>
                  <Td align="right">
                    <Tag
                      colorScheme={
                        s.status === "active" || s.status === "trialing"
                          ? "green"
                          : "red"
                      }
                    >
                      {s.status}{" "}
                    </Tag>
                  </Td>
                  <Td align="right">
                    {s.trial_end
                      ? dayjs.unix(s.trial_end).format("MM/DD/YYYY")
                      : "-"}
                  </Td>
                  <Td align="right">
                    {s.cancel_at
                      ? dayjs.unix(s.cancel_at).format("MM/DD/YYYY")
                      : entities.decode("&infin;")}
                  </Td>
                  <Td align="right">
                    ${(s.plan.amount / 100) * s.quantity}/{s.plan.interval}
                  </Td>
                  <Td align="right">
                    <Button
                      onClick={() => {
                        setSubToEdit(s);
                        setShowEditSubscription(true);
                      }}
                    >
                      Edit
                    </Button>{" "}
                    {s.cancel_at ? (
                      <Button
                        onClick={() => {
                          reverseCancelMembership(s.id);
                        }}
                        colorScheme="teal"
                        isLoading={isChangingSubscriptionStatus[s.id]}
                      >
                        Reinstate Subscription
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          setSubToCancel(s.id);
                          setShowConfirmCancel(true);
                        }}
                        colorScheme="red"
                      >
                        Cancel Subscription
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={6}>No Subscriptions Attached</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <Box mt={4}>
        <Button
          colorScheme="purple"
          onClick={() => setShowAttachSubscription(true)}
        >
          Add Subscription
        </Button>
      </Box>
      <Box my={8}>
        <Divider />
      </Box>

      <AdditionalMembers
        handleAddAdditionalMembers={handleAddAdditionalMembers}
        handleRemoveAdditionalMember={handleRemoveAdditionalMember}
        additionalMembers={additionalMembers}
      />
      <Box my={8}>
        <Divider />
      </Box>

      <Heading size="md" mb="4">
        Payment Info
      </Heading>

      <TableContainer>
        <Table variant="simple" borderWidth="1px" rounded="md">
          <Thead>
            <Tr>
              <Th>Card</Th>
              <Th align="right">Expiration</Th>
              <Th align="right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paymentMethods.data.map((payment_method) => {
              const { brand, exp_month, exp_year, last4 } = payment_method.card;
              return (
                <Tr key={payment_method.id}>
                  <Td>
                    {brand} *{last4}{" "}
                    {stripeMembership.invoice_settings
                      .default_payment_method === payment_method?.id && (
                      <Tag>Default</Tag>
                    )}
                  </Td>
                  <Td align="right">
                    {exp_month}/{exp_year}
                  </Td>
                  <Td align="right">
                    <Button
                      onClick={() => detachPaymentMethod(payment_method?.id)}
                      isLoading={isDetachingPaymentMethod[payment_method?.id]}
                    >
                      Remove
                    </Button>
                  </Td>
                </Tr>
              );
            })}
            {!paymentMethods.data.length && (
              <Tr>
                <Td>No Payment Methods Attached</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <Box mt={4}>
        <Button colorScheme="purple" onClick={() => setShowPaymentUpdate(true)}>
          Attach Payment Method
        </Button>
      </Box>

      <Box my={8}>
        <Divider />
      </Box>

      <Heading size="md" mb="4">
        Charges
      </Heading>

      <TableContainer>
        <Table variant="simple" borderWidth="1px" rounded="md">
          <Thead>
            <Tr>
              <Th>Amount</Th>
              <Th>Description</Th>
              <Th>Status</Th>
              <Th>Method</Th>
              <Th>Date</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {charges.data.map((charge) => {
              return (
                <Tr key={charge.id}>
                  <Td>${(charge.amount / 100).toFixed(2)}</Td>
                  <Td>{charge.description}</Td>
                  <Td>{charge.status}</Td>
                  <Td>
                    {charge.payment_method_details.card.brand} ****
                    {charge.payment_method_details.card.last4} -{" "}
                    {charge.payment_method_details.card.exp_month}/
                    {charge.payment_method_details.card.exp_year}
                  </Td>
                  <Td>{dayjs.unix(charge.created).format("M/D/YY h:mm a")}</Td>
                  <Td>
                    {charge.refunded ? (
                      "refunded"
                    ) : (
                      <Button onClick={() => onRefund(charge)}>Refund</Button>
                    )}
                  </Td>
                </Tr>
              );
            })}
            {!charges.data.length && (
              <Tr>
                <Td>No Charges</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <Box my={8}>
        <Divider />
      </Box>

      <Heading size="md" mb="4">
        Check Ins
      </Heading>
      <TableContainer>
        <Table variant="simple" borderWidth="1px" rounded="md">
          <Thead>
            <Tr>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {checkins.length > 0 &&
              checkins.map((checkin) => {
                return (
                  <Tr key={checkin.id}>
                    <Td>{dayjs(checkin.created_at).format("M/D/YY h:mm a")}</Td>
                  </Tr>
                );
              })}
            {checkins.length === 0 && (
              <Tr>
                <Td>No Check Ins</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <Box my={8}>
        <Divider />
      </Box>

      <Heading size="md" mb="4">
        Audit Log
      </Heading>

      <TableContainer>
        <Table variant="simple" borderWidth="1px" rounded="md">
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th>Action</Th>
              <Th>Details</Th>
              <Th align="right">Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {audits.map((audit) => {
              return (
                <Tr key={audit.id}>
                  <Td>{audit.user}</Td>
                  <Td>{audit.action}</Td>
                  <Td>{audit.comment}</Td>
                  <Td align="right">
                    {dayjs.unix(audit.created_at).format("M/D/YY h:mm a")}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Box my={8}>
        <Divider />
      </Box>

      <Heading mb="4" size="md">
        Danger Area
      </Heading>
      <Box mr={2}>
        <Button colorScheme="red" onClick={() => setShowDeleteMember(true)}>
          Delete Member
        </Button>
      </Box>

      <Dialog
        open={showConfirmCancel}
        onClose={closeConfirmCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Cancel Subscription</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Canceling the subscription will stop billing at the end of the
            cycle. Subscription will remain active until end of cycle.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmCancel}>Close</Button>
          <Button
            onClick={cancelMembership}
            colorScheme="red"
            isLoading={isCanceling}
          >
            Cancel Membership
          </Button>
        </DialogActions>
      </Dialog>
      <DeleteMemberDialog
        open={showDeleteMember}
        close={() => setShowDeleteMember(false)}
        cancelMembership={handleDeleteMember}
      />
      <SimpleDialog
        open={showRefund}
        close={() => setShowRefund(false)}
        onSubmit={handleRefund}
        actionButtonText="Refund"
        title="Refund Charge"
      >
        This will refund the full amount.
        <FormControl fullWidth variant="outlined" required>
          <InputLabel id="demo-simple-select-label">Reason</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            onChange={(e: any) => {
              setReason(e.target.value);
            }}
            label="Reason"
          >
            {["duplicate", "fraudulent", "requested_by_customer"].map(
              (reason) => (
                <MenuItem key={reason} value={reason}>
                  {reason}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </SimpleDialog>
      <Dialog
        open={showPaymentUpdate}
        onClose={closePaymentUpdate}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Attach Payment</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please select to use a connected card reader or to enter in card
            information manually.
          </DialogContentText>
          <Button onClick={discorverReaders} mr={2}>
            Use Reader
          </Button>
          <Button
            onClick={() => {
              setShowManualForm(true);
              setShowReaders(false);
            }}
            autoFocus
          >
            Enter Manually
          </Button>
          {showManualForm && (
            <Box my={2}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InputMask
                    mask="9999 9999 9999 9999"
                    value={paymentCardNumber}
                    disabled={false}
                    maskChar={null}
                    onChange={(e) => setPaymentCardNumber(e.target.value)}
                  >
                    {() => (
                      <TextField
                        id="card_number"
                        name="membership[card_number]"
                        label="Card Number"
                        variant="outlined"
                        required
                        fullWidth
                        value={paymentCardNumber}
                        placeholder="XXXX XXXX XXXX XXXX"
                      />
                    )}
                  </InputMask>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    id="card_exp_month"
                    name="membership[card_exp_month]"
                    label="Card Exp Month"
                    variant="outlined"
                    required
                    fullWidth
                    value={paymentCardMonth}
                    placeholder="MM"
                    onChange={(e) => setPaymentCardMonth(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    id="card_exp_year"
                    name="membership[card_exp_year]"
                    label="Card Exp Year"
                    variant="outlined"
                    required
                    fullWidth
                    placeholder="YYYY"
                    value={paymentCardYear}
                    onChange={(e) => setPaymentCardYear(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    id="card_cvc"
                    name="membership[card_cvc]"
                    variant="outlined"
                    label="CVC"
                    required
                    fullWidth
                    value={paymentCardCvc}
                    onChange={(e) => setPaymentCardCvc(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
          {!!readerLoadingText && (
            <Typography variant="subtitle1">{readerLoadingText}</Typography>
          )}
          {showReaders && (
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Available Readers
              </Typography>
              <List>
                {availableReaders.map((reader) => (
                  <ListItem
                    key={reader?.id}
                    onClick={() => selectReader(reader)}
                    button
                  >
                    <ListItemText
                      primary={reader.label}
                      secondary={reader.device_type}
                    />
                    <ListItemSecondaryAction>
                      {reader.status}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>
          )}
          {showReaderInstructions && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Connected to reader
                  </Typography>
                  <Typography variant="h5" component="h2">
                    Follow instructions on reader.
                  </Typography>
                  <Typography color="textSecondary">Tip</Typography>
                  <Typography variant="body2" component="p">
                    If you are having trouble with the reader, press cancel then
                    re-select it.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={cancelReusableCard}>
                    Cancel
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )}

          {showPaymentMethod && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Payment Attached
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {paymentMethod.card.brand} &bull; {paymentMethod.card.last4}
                  </Typography>
                  <Typography color="textSecondary">
                    {
                      paymentMethod.card.generated_from.payment_method_details
                        .card_present.cardholder_name
                    }
                  </Typography>
                  <Typography variant="body2" component="p">
                    {paymentMethod.card.exp_month}/{paymentMethod.card.exp_year}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={clearPayment}>
                    Remove
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closePaymentUpdate}>Close</Button>
          <Button
            onClick={handlePaymentUpdateSubmit}
            colorScheme="green"
            autoFocus
            isLoading={isSavingPaymentMethod}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <EditMembership
        open={showEditMember}
        onClose={() => setShowEditMember(false)}
        onSave={handleEditMemberSubmit}
        member={membership}
        locations={locations}
      />
      <AddSubscription
        open={showAttachSubscription}
        onClose={() => setShowAttachSubscription(false)}
        onSave={handleAttachSubscriptionSubmit}
        tax_rates={taxRates}
        coupons={coupons}
        plans={plans}
        payment_methods={paymentMethods}
      />
      <EditSubscription
        subscription={subToEdit}
        open={showEditSubscription}
        onClose={() => setShowEditSubscription(false)}
        onSave={handleEditSubscriptionSubmit}
        tax_rates={taxRates}
        coupons={coupons}
        payment_methods={paymentMethods}
      />
      <ReceiptDialog
        open={showSignpad}
        subscription={{
          name: membership.name,
          last_name: membership.last_name,
          email: membership.email,
          phone: membership.phone,
          notes: membership.notes,
          additionalMembers: additionalMembers.map((am) => am.name).join(", "),
          signature: membership.signature,
          recurring: round(
            subs[0]
              ? (subs[0].plan.amount * subs[0].quantity +
                  subs[0].plan.amount *
                    subs[0].quantity *
                    (subs[0].tax_percent / 100)) /
                  100
              : 0,
            2
          ).toFixed(2),
          interval: subs[0] ? subs[0].plan.interval : "error",
        }}
        close={() => setShowSignpad(false)}
      />
    </>
  );
}
