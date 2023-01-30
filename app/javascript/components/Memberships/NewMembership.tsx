import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  LinkBox,
  LinkOverlay,
  Select,
  SimpleGrid,
  Square,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useColorModeValue,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { BsCreditCard2Front } from "react-icons/bs";
import { FormHelperText, Typography } from "@material-ui/core";
import { loadStripeTerminal } from "@stripe/terminal-js";
import axios from "axios";
import { Formik } from "formik";
import { round } from "lodash";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coupon, PaymentMethod, Plan } from "../../types";
import { Loading } from "../../ui/Loading";
import AddAdditionalMember from "./AddAdditionalMember";
import AvailableReaders from "./AvailableReaders";
import ManualCardForm from "./ManualCardForm";
import OrderSummary from "./OrderSummary";
import { RadioCard, RadioCardGroup } from "./RadioCardGroup";
import SignpadDialog from "./SignpadDialog";

interface Errors {
  stripe_plan_id?: string;
  quantity?: string;
  name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  card_number?: string;
  card_cvc?: string;
  card_exp_month?: string;
  card_exp_year?: string;
  payment_id?: string;
  stripe_tax_rate_id?: string;
  trial_end?: string;
  cancel_at?: string;
  skip_payment?: string;
  payment_method_id?: string;
}

let terminal;

export default function NewMembership() {
  const [availableReaders, setAvailableReaders] = useState([]);
  const [manualForm, setManualForm] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>();
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [plan, setPlan] = useState<Plan>({ stripe_plan_id: "" });
  const [taxRate, setTaxRate] = useState({
    percentage: 0,
    inclusive: false,
    stripe_metadata: { id: "" },
  });
  const [coupon, setCoupon] = useState<Coupon>({});
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [showReaderInstructions, setShowReaderInstructions] = useState(false);
  const [showReaders, setShowReaders] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const [showSignpad, setShowSignpad] = useState(false);
  const [showAdditionalMembers, setShowAdditionalMembers] = useState(false);
  const [signature, setSignature] = useState("");
  const [additionalMembers, setAdditionalMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [taxRates, setTaxRates] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [stripeLocationId, setStripeLocationId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const toast = useToast();

  const fetchData = async () => {
    const res = await axios.get("/memberships/new.json");

    setPlans(res.data.plans);
    setTaxRates(res.data.tax_rates);
    setCoupons(res.data.coupons);
    setStripeLocationId(res.data.stripe_location_id);
    setPlan(res.data.plans.find((p) => p.default));
    setTaxRate(res.data.tax_rates[0]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
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

    return { error };
  };

  const discorverReaders = async () => {
    setManualForm(false);
    setLoadingText("Searching for available readers.");
    const StripeTerminal = await loadStripeTerminal();

    terminal = StripeTerminal.create({
      onFetchConnectionToken: fetchConnectionToken,
      onUnexpectedReaderDisconnect: unexpectedDisconnect,
      readerBehavior: { allowCustomerCancel: true },
    });

    const readers = await terminal.discoverReaders({
      location: stripeLocationId,
    });
    setLoadingText("");

    setShowReaders(true);
    setAvailableReaders(readers.discoveredReaders);
  };

  const handleSignature = async (data) => {
    setSignature(data);
    setShowSignpad(false);
  };

  const handleAdditionalMembers = (data) => {
    const newArr = additionalMembers.concat(data);
    setQuantity(quantity + 1);
    setAdditionalMembers(newArr);
    setShowAdditionalMembers(false);
  };
  const removeAdditionalMembers = (name) => {
    const newMembers = additionalMembers.filter((e) => e.name !== name);
    setQuantity(quantity - 1);
    setAdditionalMembers(newMembers);
  };

  const cancelReusableCard = async () => {
    await terminal.cancelReadReusableCard();
    await terminal.disconnectReader();
    setShowReaderInstructions(false);
  };

  const selectReader = async (reader) => {
    setLoadingText("Connecting...");
    console.log(reader);
    const connectResult = await terminal.connectReader(reader);
    if (connectResult.error) {
      console.log(connectResult.error);
    } else {
      setShowReaderInstructions(true);
      setShowReaders(true);
      setLoadingText("");
      const result = await terminal.readReusableCard();

      if (result.error) {
        console.log(result.error);
        // Placeholder for handling result.error
        // setLoadingText("error");
      } else {
        // Placeholder for sending result.payment_method.id to your backend.
        console.log("card result", result);
        setPaymentMethodId(result.payment_method.id);
        setPaymentMethod(result.payment_method);
        setShowPaymentMethod(true);
        setShowReaderInstructions(false);
        setShowReaders(false);
        await terminal.disconnectReader();
        setLoadingText("");
      }
    }
  };

  const clearPayment = () => {
    setPaymentMethodId("");
    setPaymentMethod(null);
    setShowPaymentMethod(false);
  };

  const calcSubtotal = (values) => (plan?.amount / 100) * quantity;

  const calcTotal = (values) => {
    let total = (plan?.amount / 100) * quantity;

    if (coupon && coupon.percent_off) {
      total = total - total * (coupon.percent_off / 100);
    }
    if (coupon && coupon.amount_off) {
      total = total - coupon.amount_off / 100;
    }

    if (!taxRate.inclusive) {
      total = round(total + (total * taxRate.percentage) / 100, 2);
    }
    if (taxRate.inclusive) {
      total = round(total, 2);
    }

    return total.toFixed(2);
  };

  const navigate = useNavigate();

  const processSubmit = async (values, setSubmitting) => {
    try {
      await axios.post(`/memberships`, {
        membership: {
          ...values,
          signature,
          card_number: values.card_number.replace(/\s/g, ""),
          payment_method_id: paymentMethodId,
          quantity: quantity,
          total: calcTotal(values),
          recurring: calcSubtotal(values),
          interval: plan?.interval,
          additional_members: additionalMembers,
        },
      });
      navigate("/memberships");
    } catch (err) {
      toast({
        title: "An error occurred.",
        description: err.response.data.error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });

      setSubmitting(false);
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <LinkBox as="article" maxW="sm">
        <LinkOverlay href="/memberships">
          <Heading mb="10" size="xs">
            <ArrowBackIcon /> Back
          </Heading>
        </LinkOverlay>
      </LinkBox>
      <Formik
        initialValues={{
          name: "",
          last_name: "",
          phone: "",
          email: "",
          stripe_plan_id: plan?.stripe_plan_id,
          card_number: "",
          card_cvc: "",
          card_exp_month: "",
          card_exp_year: "",
          payment_method_id: "",
          stripe_tax_rate_id: taxRate.stripe_metadata.id,
          stripe_coupon_id: "",
          notes: "",
          trial_end: "",
          cancel_at: "",
          skip_payment: "false",
        }}
        isInitialValid={false}
        validate={(values) => {
          const errors: Errors = {};

          if (!values?.stripe_plan_id) {
            errors.stripe_plan_id = "A plan is required";
          }

          if (!values.name) {
            errors.name = "A name is required";
          }
          if (!values.last_name) {
            errors.last_name = "A last name is required";
          }
          if (!values.phone) {
            errors.phone = "A phone is required";
          }
          if (!values.email.length) {
            errors.email = "An email is required";
          }
          if (values.skip_payment === "true") {
            return errors;
          }

          if (!manualForm && !paymentMethodId) {
            errors.payment_method_id = "A payment method is required";
          }

          if (manualForm) {
            if (!values.card_number) {
              errors.card_number = "A card number is required";
            }
            if (!values.card_cvc) {
              errors.card_cvc = "A card number is required";
            }
            if (!values.card_exp_month) {
              errors.card_exp_month = "A card number is required";
            }
            if (!values.card_exp_year) {
              errors.card_exp_year = "A card number is required";
            }
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          processSubmit(values, setSubmitting);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          isValid,
          submitForm,
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              bgGradient={useColorModeValue(
                "linear(to-l, gray.50 50%, white 50%)",
                "linear(to-l, gray.700 50%, gray.800 50%)"
              )}
            >
              <Flex
                maxW="8xl"
                mx="auto"
                direction={{ base: "column", md: "row" }}
                // pr={{ base: "4", md: "8", lg: "12", xl: "20" }}
              >
                <Box
                  flex="1"
                  bg={useColorModeValue("white", "gray.800")}
                  pr="2"
                >
                  <Heading size={"sm"} mb={8}>
                    Add Member
                  </Heading>
                  <FormControl mb={8}>
                    <FormLabel>Select a plan for the member</FormLabel>
                    <Select
                      isRequired
                      onChange={(e: any) => {
                        const stripe_plan_id = e.target.value;
                        const plan = plans.find(
                          (p) => p?.stripe_plan_id == stripe_plan_id
                        );

                        handleChange("stripe_plan_id")(stripe_plan_id);
                        setPlan(plan);
                      }}
                      value={values.stripe_plan_id}
                    >
                      {plans.map((p) => {
                        return (
                          <option
                            key={p?.stripe_plan_id}
                            value={p?.stripe_plan_id}
                          >
                            {p.name} (${p.amount / 100}/{p.interval})
                          </option>
                        );
                      })}
                    </Select>
                    <FormHelperText>
                      {errors.stripe_plan_id &&
                        touched.stripe_plan_id &&
                        errors.stripe_plan_id}
                    </FormHelperText>
                  </FormControl>
                  <SimpleGrid columns={2} spacing={8}>
                    <FormControl
                      variant="floating"
                      id="name"
                      isRequired
                      isInvalid={!!errors.name}
                    >
                      <Input
                        placeholder=" "
                        value={values.name}
                        errorBorderColor="red.500"
                        onBlur={handleBlur("name")}
                        autoFocus
                        onChange={(e) => handleChange("name")(e.target.value)}
                      />
                      {/* It is important that the Label comes after the Control due to css selectors */}
                      <FormLabel>First Name</FormLabel>
                      <FormHelperText>
                        Enter the members first name.
                      </FormHelperText>
                      {!!errors.name && (
                        <FormErrorMessage>
                          {errors.name && touched.name && errors.name}
                        </FormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl
                      variant="floating"
                      id="last_name"
                      isRequired
                      isInvalid={!!errors.last_name}
                    >
                      <Input
                        placeholder=" "
                        value={values.last_name}
                        errorBorderColor="red.500"
                        onBlur={handleBlur("last_name")}
                        onChange={(e) =>
                          handleChange("last_name")(e.target.value)
                        }
                      />
                      {/* It is important that the Label comes after the Control due to css selectors */}
                      <FormLabel>Last Name</FormLabel>
                      <FormHelperText>
                        Enter the members last name.
                      </FormHelperText>
                      {!!errors.last_name && (
                        <FormErrorMessage>
                          {errors.last_name &&
                            touched.last_name &&
                            errors.last_name}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      variant="floating"
                      id="email"
                      isRequired
                      isInvalid={!!errors.email}
                      mb={8}
                    >
                      <Input
                        placeholder=" "
                        value={values.email}
                        errorBorderColor="red.500"
                        onBlur={handleBlur("email")}
                        type="email"
                        onChange={(e) => handleChange("email")(e.target.value)}
                      />
                      {/* It is important that the Label comes after the Control due to css selectors */}
                      <FormLabel>Email</FormLabel>
                      <FormHelperText>
                        Enter the members email address.
                      </FormHelperText>
                      {!!errors.email && (
                        <FormErrorMessage>
                          {errors.email && touched.email && errors.email}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      variant="floating"
                      id="phone"
                      isRequired
                      isInvalid={!!errors.phone}
                      mb={8}
                    >
                      <Input
                        placeholder=" "
                        value={values.phone}
                        errorBorderColor="red.500"
                        onBlur={handleBlur("phone")}
                        onChange={(e) => handleChange("phone")(e.target.value)}
                        type="tel"
                      />
                      {/* It is important that the Label comes after the Control due to css selectors */}
                      <FormLabel>Phone</FormLabel>
                      <FormHelperText>Enter the members phone.</FormHelperText>
                      {!!errors.phone && (
                        <FormErrorMessage>
                          {errors.phone && touched.phone && errors.phone}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </SimpleGrid>

                  <Accordion allowToggle mb={8}>
                    <AccordionItem>
                      <h2>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            Expand for more options
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel py={8}>
                        <SimpleGrid columns={2} spacing={8}>
                          <FormControl mb={4}>
                            <FormLabel>Select a Tax Rate</FormLabel>
                            <Select
                              isRequired
                              onChange={(e: any) => {
                                const stripe_tax_rate_id = e.target.value;
                                const tax_rate = taxRates.find(
                                  (tr) =>
                                    tr.stripe_metadata.id == stripe_tax_rate_id
                                );

                                handleChange("stripe_tax_rate_id")(
                                  stripe_tax_rate_id
                                );
                                setTaxRate(tax_rate);
                              }}
                              value={values.stripe_tax_rate_id}
                            >
                              {taxRates.map((tr) => (
                                <option
                                  key={tr.stripe_metadata.id}
                                  value={tr.stripe_metadata.id}
                                >
                                  {tr.display_name} ({tr.percentage}%)(
                                  {tr.inclusive ? "Inc" : "Exc"})
                                </option>
                              ))}
                            </Select>
                            <FormHelperText>
                              {errors.stripe_tax_rate_id &&
                                touched.stripe_tax_rate_id &&
                                errors.stripe_tax_rate_id}
                            </FormHelperText>
                          </FormControl>
                          <FormControl mb={4}>
                            <FormLabel>Select a Coupon</FormLabel>
                            <Select
                              onChange={(e: any) => {
                                const stripe_coupon_id = e.target.value;
                                const coupon = coupons.find(
                                  (c) =>
                                    c.stripe_metadata.id == stripe_coupon_id
                                );
                                handleChange("stripe_coupon_id")(
                                  stripe_coupon_id
                                );
                                if (coupon) {
                                  setCoupon(coupon);
                                } else {
                                  setCoupon({});
                                }
                              }}
                              value={values.stripe_coupon_id}
                            >
                              <option>None</option>
                              {coupons.map((c) => (
                                <option
                                  key={c.stripe_metadata.id}
                                  value={c.stripe_metadata.id}
                                >
                                  {c.name} (
                                  {c.percent_off
                                    ? `${c.percent_off}%`
                                    : `$${c.amount_off / 100}`}{" "}
                                  off )
                                </option>
                              ))}
                            </Select>
                            <FormHelperText>
                              {errors.stripe_coupon_id &&
                                touched.stripe_coupon_id &&
                                errors.stripe_coupon_id}
                            </FormHelperText>
                          </FormControl>
                          <FormControl
                            variant="floating"
                            id="trial_end"
                            isInvalid={!!errors.trial_end}
                            mb={8}
                          >
                            <Input
                              placeholder=" "
                              value={values.trial_end}
                              errorBorderColor="red.500"
                              onBlur={handleBlur("trial_end")}
                              type="date"
                              onChange={(e) =>
                                handleChange("trial_end")(e.target.value)
                              }
                            />
                            {/* It is important that the Label comes after the Control due to css selectors */}
                            <FormLabel>Trial End</FormLabel>
                            <FormHelperText>
                              This is the time the trial period should end.
                            </FormHelperText>
                            {!!errors.trial_end && (
                              <FormErrorMessage>
                                {errors.trial_end &&
                                  touched.trial_end &&
                                  errors.trial_end}
                              </FormErrorMessage>
                            )}
                          </FormControl>

                          <FormControl
                            variant="floating"
                            id="cancel_at"
                            isInvalid={!!errors.cancel_at}
                            mb={8}
                          >
                            <Input
                              placeholder=" "
                              value={values.cancel_at}
                              errorBorderColor="red.500"
                              onBlur={handleBlur("cancel_at")}
                              type="date"
                              onChange={(e) =>
                                handleChange("cancel_at")(e.target.value)
                              }
                            />
                            {/* It is important that the Label comes after the Control due to css selectors */}
                            <FormLabel>Auto Cancel Date</FormLabel>
                            <FormHelperText>
                              This is the time the subscription should end.
                            </FormHelperText>
                            {!!errors.cancel_at && (
                              <FormErrorMessage>
                                {errors.cancel_at &&
                                  touched.cancel_at &&
                                  errors.cancel_at}
                              </FormErrorMessage>
                            )}
                          </FormControl>
                        </SimpleGrid>
                        <FormControl
                          variant="floating"
                          id="notes"
                          isInvalid={!!errors.notes}
                          mb={8}
                        >
                          <Textarea
                            placeholder=" "
                            value={values.notes}
                            errorBorderColor="red.500"
                            onBlur={handleBlur("notes")}
                            onChange={(e) =>
                              handleChange("notes")(e.target.value)
                            }
                          />
                          {/* It is important that the Label comes after the Control due to css selectors */}
                          <FormLabel>Notes</FormLabel>
                          <FormHelperText>
                            Enter a notes for the response.
                          </FormHelperText>
                          {!!errors.notes && (
                            <FormErrorMessage>
                              {errors.notes && touched.notes && errors.notes}
                            </FormErrorMessage>
                          )}
                        </FormControl>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                  <Text
                    fontSize="lg"
                    fontWeight="semibold"
                    color={useColorModeValue("gray.700", "gray.200")}
                    mt={8}
                  >
                    Additional Members
                  </Text>
                  <TableContainer>
                    <Table variant="striped">
                      <Thead>
                        <Tr>
                          <Th>Name</Th>
                          <Th>Email</Th>
                          <Th>Phone</Th>
                          <Th>Notes</Th>
                          <Th></Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {!!additionalMembers.length &&
                          additionalMembers.map((am) => (
                            <Tr key={am.email}>
                              <Td>{am.name}</Td>
                              <Td>{am.email}</Td>
                              <Td>{am.phone}</Td>
                              <Td>{am.notes}</Td>
                              <Td>
                                <Button
                                  onClick={() =>
                                    removeAdditionalMembers(am.name)
                                  }
                                >
                                  Remove
                                </Button>
                              </Td>
                            </Tr>
                          ))}
                        {!additionalMembers.length && (
                          <Tr>
                            <Td colSpan="5">No Additional Members</Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </TableContainer>
                  <Button
                    onClick={() => setShowAdditionalMembers(true)}
                    colorScheme="purple"
                    my={8}
                  >
                    Add Members
                  </Button>
                  <Divider />
                  <Text
                    fontSize="lg"
                    fontWeight="semibold"
                    color={useColorModeValue("gray.700", "gray.200")}
                    mt={8}
                  >
                    Payment Information
                  </Text>
                  <Box as="section" bg="bg-surface" py={{ base: "4", md: "8" }}>
                    <RadioCardGroup
                      defaultValue="manual"
                      spacing="4"
                      direction="row"
                    >
                      <RadioCard
                        key={"manual"}
                        value={"manual"}
                        onClick={() => {
                          handleChange("skip_payment")("false");
                          setShowReaders(false);
                          setManualForm(!manualForm);
                        }}
                      >
                        <Text
                          color="emphasized"
                          fontWeight="medium"
                          fontSize="sm"
                        >
                          Enter card manually
                        </Text>
                        <Text color="muted" fontSize="sm">
                          Type in the card information manually.
                        </Text>
                      </RadioCard>
                      <RadioCard
                        key={"reader"}
                        value={"reader"}
                        onClick={() => {
                          handleChange("skip_payment")("false");
                          discorverReaders();
                        }}
                      >
                        <Text
                          color="emphasized"
                          fontWeight="medium"
                          fontSize="sm"
                        >
                          Use a card reader
                        </Text>
                        <Text color="muted" fontSize="sm">
                          Use a card reader to swipe the card.
                        </Text>
                      </RadioCard>
                      <RadioCard
                        key={"skip_payment"}
                        value="true"
                        onClick={() => {
                          handleChange("skip_payment")("true");
                          setManualForm(false);
                          setShowReaders(false);
                        }}
                      >
                        <Text
                          color="emphasized"
                          fontWeight="medium"
                          fontSize="sm"
                        >
                          Skip Payment
                        </Text>
                        <Text color="muted" fontSize="sm">
                          Skip adding payment information. (Requires balance to
                          be zero.)
                        </Text>
                      </RadioCard>
                    </RadioCardGroup>
                  </Box>

                  {manualForm && (
                    <ManualCardForm
                      values={values}
                      errors={errors}
                      touched={touched}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                    />
                  )}
                  {showReaders && (
                    <AvailableReaders
                      availableReaders={availableReaders}
                      selectReader={selectReader}
                      showReaderInstructions={showReaderInstructions}
                      cancelReusableCard={cancelReusableCard}
                      loadingText={loadingText}
                    />
                  )}
                  {showPaymentMethod && (
                    <Box
                      borderWidth={{ base: "0", md: "1px" }}
                      p={{ base: "0", md: "4" }}
                      borderRadius="lg"
                    >
                      <Stack
                        justify="space-between"
                        direction={{ base: "column", md: "row" }}
                        spacing="5"
                      >
                        <HStack spacing="3">
                          <Square size="10" bg="bg-subtle" borderRadius="lg">
                            <Icon as={BsCreditCard2Front} boxSize="5" />
                          </Square>
                          <Box fontSize="sm">
                            <Text color="empahsized" fontWeight="medium">
                              {
                                paymentMethod.card?.generated_from
                                  ?.payment_method_details?.card_present
                                  ?.cardholder_name
                              }
                              {paymentMethod.card.brand} &bull;{" "}
                              {paymentMethod.card.last4}
                            </Text>
                            <Text color="muted">
                              {paymentMethod.card.exp_month}/
                              {paymentMethod.card.exp_year}
                            </Text>
                          </Box>
                        </HStack>
                        <Stack
                          spacing="3"
                          direction={{ base: "column-reverse", md: "row" }}
                        >
                          <Button variant="secondary" onClick={clearPayment}>
                            Remove
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>
                  )}
                </Box>

                <Box
                  flex="1"
                  maxW={{ lg: "md", xl: "40rem" }}
                  bg={useBreakpointValue({
                    base: useColorModeValue("white", "gray.800"),
                    md: "inherit",
                  })}
                  px={{ base: "4", md: "8", lg: "12", xl: "20" }}
                  py={{ base: "6", md: "8", lg: "12", xl: "20" }}
                >
                  <OrderSummary
                    plan={plan}
                    quantity={quantity}
                    values={values}
                    coupon={coupon}
                    taxRate={taxRate}
                    signature={signature}
                    isSubmitting={isSubmitting}
                    isValid={isValid}
                    paymentMethodId={paymentMethodId}
                    manualForm={manualForm}
                    setShowSignpad={setShowSignpad}
                    submitForm={submitForm}
                  />
                </Box>
              </Flex>
            </Box>

            <SignpadDialog
              open={showSignpad}
              confirmDetails={{
                name: values.name,
                email: values.email,
                phone: values.phone,
                notes: values.notes,
                additionalMembers: additionalMembers
                  .map((am) => am.name)
                  .join(", "),
                total: calcTotal(values),
                recurring: calcTotal(values),
                interval: plan?.interval,
              }}
              close={() => setShowSignpad(false)}
              onSave={handleSignature}
            />
            <AddAdditionalMember
              open={showAdditionalMembers}
              onSave={handleAdditionalMembers}
              additionalMembers={additionalMembers}
              close={() => setShowAdditionalMembers(false)}
            />
          </form>
        )}
      </Formik>
    </>
  );
}
