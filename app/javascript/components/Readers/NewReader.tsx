import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { Formik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";

interface Errors {
  label?: string;
  registration_code?: string;
}

function NewReader() {
  const reader = { label: "", registration_code: "" };
  const navigate = useNavigate();
  const toast = useToast();

  const processSubmit = async (values, setSubmitting) => {
    try {
      await axios.post(`/readers`, {
        reader: {
          ...values,
        },
      });
      navigate("/readers");
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
      initialValues={{ ...reader }}
      isInitialValid={false}
      validate={(values) => {
        const errors: Errors = {};
        if (!values.label) {
          errors.label = "A label is required";
        }
        if (!values.registration_code) {
          errors.registration_code = "A registration code is required";
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
            Add a Reader
          </Heading>
          <Text mb={8} size="xs">
            On your reader, enter the key sequence 0-7-1-3-9 to display a unique
            registration code. Enter the code when prompted.
          </Text>

          <FormControl
            variant="floating"
            id="label"
            isRequired
            isInvalid={!!errors.label}
            mb={8}
          >
            <Input
              placeholder=" "
              value={values.label}
              errorBorderColor="red.500"
              onBlur={handleBlur("label")}
              onChange={(e) => handleChange("label")(e.target.value)}
            />
            {/* It is important that the Label comes after the Control due to css selectors */}
            <FormLabel>Name</FormLabel>
            <FormHelperText>Enter a name for the reader.</FormHelperText>
            {!!errors.label && (
              <FormErrorMessage>
                {errors.label && touched.label && errors.label}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            variant="floating"
            id="registration_code"
            isRequired
            isInvalid={!!errors.registration_code}
            mb={8}
          >
            <Input
              placeholder=" "
              value={values.registration_code}
              errorBorderColor="red.500"
              onBlur={handleBlur("registration_code")}
              onChange={(e) =>
                handleChange("registration_code")(e.target.value)
              }
            />
            {/* It is important that the Label comes after the Control due to css selectors */}
            <FormLabel>Registraion Code</FormLabel>
            <FormHelperText>
              Enter the registration code displayed on the reader.
            </FormHelperText>
            {!!errors.registration_code && (
              <FormErrorMessage>
                {errors.registration_code &&
                  touched.registration_code &&
                  errors.registration_code}
              </FormErrorMessage>
            )}
          </FormControl>

          <Box mt={8}>
            <Button onClick={() => navigate("/readers")} mr={4}>
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

export default NewReader;
