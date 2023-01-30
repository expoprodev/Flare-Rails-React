import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Select,
  Box,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { Formik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CapSelect } from "../../ui/form";

interface Errors {
  name?: string;
  duration?: string;
  duration_in_months?: string;
  percent_off?: string;
  amount_off?: string;
}

export function NewCoupon() {
  const coupon = {
    id: "",
    name: "",
    duration: "once",
    percent_off: "",
    amount_off: "",
    duration_in_months: "",
  };

  const navigate = useNavigate();

  const toast = useToast();

  const processSubmit = async (values, setSubmitting) => {
    try {
      await axios.post(`/coupons`, {
        coupon: {
          ...values,
        },
      });
      navigate("/coupons");
    } catch (err) {
      console.log(err);

      toast({
        title: "An error occurred.",
        description: err.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ ...coupon, coupon_type: "percent_off" }}
      isInitialValid={false}
      validate={(values) => {
        const errors: Errors = {};
        if (!values.name) {
          errors.name = "A name is required.";
        }

        if (values.coupon_type === "percent_off") {
          if (!values.percent_off) {
            errors.percent_off = "A percentage is required.";
          }
        }

        if (values.coupon_type === "amount_off") {
          if (!values.amount_off) {
            errors.amount_off = "An amount is required.";
          }
        }

        if (values.duration === "repeating") {
          if (!values.duration_in_months) {
            errors.duration_in_months = "A duration is required.";
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
        /* and other goodies */
      }) => (
        <form onSubmit={handleSubmit}>
          <Heading size="md" mb={8}>
            New Coupon
          </Heading>

          <FormControl
            variant="floating"
            id="name"
            isRequired
            isInvalid={!!errors.name}
            mb={8}
          >
            <Input
              placeholder=" "
              value={values.name}
              errorBorderColor="red.500"
              onBlur={handleBlur("name")}
              onChange={(e) => handleChange("name")(e.target.value)}
            />
            {/* It is important that the Label comes after the Control due to css selectors */}
            <FormLabel>Name</FormLabel>
            <FormHelperText>Enter a name for the coupon.</FormHelperText>
            {!!errors.name && (
              <FormErrorMessage>
                {errors.name && touched.name && errors.name}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl my={4}>
            <FormLabel>What type of discount will be applied?</FormLabel>
            <CapSelect
              isRequired
              onChange={handleChange("coupon_type")}
              value={values.coupon_type}
            >
              <option value="percent_off">Percentage</option>
              <option value="amount_off">Fixed Amount</option>
            </CapSelect>
            <FormHelperText>
              Select between a percentage or fixed amount.
            </FormHelperText>
          </FormControl>

          {values.coupon_type === "percent_off" ? (
            <FormControl
              variant="floating"
              id="percent-off"
              isRequired
              isInvalid={!!errors.percent_off}
              mb={4}
            >
              <Input
                placeholder="25"
                value={values.percent_off}
                errorBorderColor="red.500"
                onBlur={handleBlur("percent_off")}
                onChange={handleChange("percent_off")}
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel>Percentage off</FormLabel>
              <FormHelperText>
                Discount to be applied in percentage. Ex. Enter 25 for 25%
              </FormHelperText>
              {!!errors.percent_off && (
                <FormErrorMessage>
                  {errors.percent_off &&
                    touched.percent_off &&
                    errors.percent_off}
                </FormErrorMessage>
              )}
            </FormControl>
          ) : (
            <FormControl
              variant="floating"
              id="amount-off"
              isRequired
              isInvalid={!!errors.amount_off}
              mb={4}
            >
              <Input
                placeholder="500"
                value={values.amount_off}
                errorBorderColor="red.500"
                onBlur={handleBlur("amount_off")}
                onChange={handleChange("amount_off")}
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel>Amount off</FormLabel>
              <FormHelperText>
                Discount to be applied in cents. Ex. Enter 500 for $5.00
              </FormHelperText>
              {!!errors.amount_off && (
                <FormErrorMessage>
                  {errors.amount_off && touched.amount_off && errors.amount_off}
                </FormErrorMessage>
              )}
            </FormControl>
          )}

          <FormControl mt={8} mb={4}>
            <FormLabel>How often this discount will be applied?</FormLabel>
            <CapSelect
              isRequired
              isInvalid={!!errors.duration}
              onChange={handleChange("duration")}
              value={values.duration}
            >
              {["once", "repeating", "forever"].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </CapSelect>
            <FormHelperText>
              Select between a once, repeating or forever.
            </FormHelperText>
          </FormControl>

          {values.duration === "repeating" && (
            <FormControl
              variant="floating"
              id="duration-in-monts"
              isRequired
              isInvalid={!!errors.duration_in_months}
              mb={4}
            >
              <Input
                placeholder="6"
                value={values.duration_in_months}
                errorBorderColor="red.500"
                onBlur={handleBlur("duration_in_months")}
                onChange={handleChange("duration_in_months")}
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel>Duration In Months</FormLabel>
              <FormHelperText>
                How long this coupon will be applied to a subscription. Ex: 1
                would apply the coupon for all payments in the month.
              </FormHelperText>
              {!!errors.duration_in_months && (
                <FormErrorMessage>
                  {errors.duration_in_months &&
                    touched.duration_in_months &&
                    errors.duration_in_months}
                </FormErrorMessage>
              )}
            </FormControl>
          )}
          <Box mt={8}>
            <Button onClick={() => navigate("/coupons")} mr={4}>
              Back
            </Button>

            <Button
              type="submit"
              colorScheme="purple"
              isLoading={isSubmitting}
              disabled={isSubmitting || !isValid}
            >
              Submit
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
}
