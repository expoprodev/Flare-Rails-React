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
  Checkbox,
} from "@chakra-ui/react";
import axios from "axios";
import { Formik } from "formik";
import React from "react";
import NumberFormat from "react-number-format";
import { useNavigate } from "react-router-dom";
import { CapSelect } from "../../ui/form";
interface Errors {
  name?: string;
  interval?: string;
  amount?: string;
  default?: boolean;
}

function NewPlan() {
  const plan = { name: "", amount: "", interval: "day", default: false };
  const navigate = useNavigate();

  const toast = useToast();

  const processSubmit = async (values, setSubmitting) => {
    try {
      await axios.post(`/plans`, {
        plan: {
          ...values,
        },
      });
      navigate("/plans");
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
      initialValues={{ ...plan }}
      isInitialValid={false}
      validate={(values) => {
        console.log(values);
        const errors: Errors = {};
        if (!values.name) {
          errors.name = "A name required";
        }
        if (!values.amount) {
          errors.amount = "An amount is required";
        }
        if (!values.interval) {
          errors.interval = "An interval is required";
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
            New Plan
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
            <FormHelperText>Enter a name for the plan.</FormHelperText>
            {!!errors.name && (
              <FormErrorMessage>
                {errors.name && touched.name && errors.name}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            variant="floating"
            id="amount"
            isRequired
            isInvalid={!!errors.amount}
            mb={8}
          >
            <Input
              placeholder=" "
              value={values.amount}
              errorBorderColor="red.500"
              onBlur={handleBlur("amount")}
              onChange={(e) => handleChange("amount")(e.target.value)}
            />
            {/* It is important that the Label comes after the Control due to css selectors */}
            <FormLabel>Amount</FormLabel>
            <FormHelperText>
              Enter an amount for the plan in cents. Ex: 500 is $5.00 dollars.
            </FormHelperText>
            {!!errors.amount && (
              <FormErrorMessage>
                {errors.amount && touched.amount && errors.amount}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl mb={8}>
            <FormLabel>The customer will be billed every:</FormLabel>
            <CapSelect
              isRequired
              onChange={handleChange("interval")}
              onBlur={handleBlur("interval")}
              value={values.interval}
            >
              {["day", "week", "month", "year"].map((p) => (
                <option value={p} key={p}>
                  {p}
                </option>
              ))}
            </CapSelect>
            <FormHelperText>Choose from day, week, month, year.</FormHelperText>
            {!!errors.interval && (
              <FormErrorMessage>
                {errors.interval && touched.interval && errors.interval}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl my={4}>
            <FormLabel>
              Will this be the default select plan when creating new members?
            </FormLabel>
            <Checkbox
              onChange={handleChange("default")}
              onBlur={handleBlur("default")}
              value={`${values.default}`}
            >
              Make Default
            </Checkbox>
            <FormHelperText>
              This will remove the default setting for all other plans.
            </FormHelperText>
          </FormControl>

          <Box mt={8}>
            <Button onClick={() => navigate("/plans")} mr={4}>
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

export default NewPlan;
