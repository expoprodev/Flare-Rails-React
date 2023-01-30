import {
  Heading,
  useToast,
  Box,
  Button,
  FormErrorMessage,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  Textarea,
} from "@chakra-ui/react";

import axios from "axios";
import { Formik } from "formik";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Errors {
  display_name?: string;
  percent?: string;
  inclusive?: string;
}

export default function NewTaxRate() {
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();
  const taxRate = {
    id: "",
    display_name: "",
    description: "",
    default: "",
  };

  const processSubmit = async (values, setSubmitting) => {
    try {
      await axios.post(`/tax_rates`, {
        tax_rate: {
          ...values,
        },
      });
      navigate("/tax_rates");
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
      initialValues={{
        display_name: "",
        default: false,
        inclusive: false,
        percentage: 0,
        description: "",
      }}
      isInitialValid={false}
      validate={(values) => {
        console.log(values);
        const errors: Errors = {};
        if (!values.display_name) {
          errors.display_name = "A name required";
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
            New Tax Rate
          </Heading>

          <FormControl
            variant="floating"
            id="display_name"
            isRequired
            isInvalid={!!errors.display_name}
            mb={8}
          >
            <Input
              placeholder=" "
              value={values.display_name}
              errorBorderColor="red.500"
              onBlur={handleBlur("display_name")}
              onChange={(e) => handleChange("display_name")(e.target.value)}
            />
            {/* It is important that the Label comes after the Control due to css selectors */}
            <FormLabel>Name</FormLabel>
            <FormHelperText>Enter a name for the tax rate.</FormHelperText>
            {!!errors.display_name && (
              <FormErrorMessage>
                {errors.display_name &&
                  touched.display_name &&
                  errors.display_name}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl variant="floating" id="description" mb={8}>
            <Textarea
              placeholder=" "
              value={values.description}
              errorBorderColor="red.500"
              onBlur={handleBlur("description")}
              onChange={(e) => handleChange("description")(e.target.value)}
            />
            {/* It is important that the Label comes after the Control due to css selectors */}
            <FormLabel>Description</FormLabel>
            <FormHelperText>
              Enter a description for the tax rate.
            </FormHelperText>
            {!!errors.description && (
              <FormErrorMessage>
                {errors.description &&
                  touched.description &&
                  errors.description}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            variant="floating"
            id="percentage"
            isRequired
            isInvalid={!!errors.percentage}
            mb={8}
          >
            <Input
              placeholder=" "
              value={values.percentage}
              errorBorderColor="red.500"
              onBlur={handleBlur("percentage")}
              onChange={(e) => handleChange("percentage")(e.target.value)}
            />
            {/* It is important that the Label comes after the Control due to css selectors */}
            <FormLabel>Percentage</FormLabel>
            <FormHelperText>
              Enter a percentage for the tax rate. Ex: 8.25 would be 8.25%
            </FormHelperText>
            {!!errors.percentage && (
              <FormErrorMessage>
                {errors.percentage && touched.percentage && errors.percentage}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl mb={8}>
            <FormLabel>Is this an inclusive tax?</FormLabel>
            <Checkbox
              onChange={handleChange("inclusive")}
              onBlur={handleBlur("inclusive")}
              value={`${values.inclusive}`}
            >
              Make Inclusive
            </Checkbox>
            <FormHelperText>Leave unchecked for exclusive tax.</FormHelperText>
          </FormControl>

          <FormControl mb={8}>
            <FormLabel>
              Will this be the default tax rate when creating new members?
            </FormLabel>
            <Checkbox
              onChange={handleChange("default")}
              onBlur={handleBlur("default")}
              value={`${values.default}`}
            >
              Make Default
            </Checkbox>
            <FormHelperText>
              This will remove the default setting for all other tax rates.
            </FormHelperText>
          </FormControl>

          <Box mt={8}>
            <Button onClick={() => navigate("/tax_rates")} mr={4}>
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
