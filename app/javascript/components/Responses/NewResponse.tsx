import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  useToast,
  FormErrorMessage,
  Heading,
  Divider,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { Loading } from "../../ui/Loading";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { CapSelect } from "../../ui/form";

interface Errors {
  name?: string;
  address?: string;
  address_ext?: string;
  city?: string;
  state?: string;
  zip?: string;
}

function NewResponse() {
  const response = {
    id: "",
    message: "",
    default: "",
  };

  const navigate = useNavigate();
  const toast = useToast();

  const processSubmit = async (values, setSubmitting) => {
    try {
      await axios.post(`/responses`, {
        response: {
          ...values,
        },
      });
      navigate("/responses");
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
      initialValues={{ ...response }}
      isInitialValid={false}
      validate={(values) => {
        const errors: Errors = {};
        if (!values.message) {
          errors.name = "A message is required";
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
            New Response
          </Heading>

          <FormControl
            variant="floating"
            id="message"
            isRequired
            isInvalid={!!errors.message}
            mb={8}
          >
            <Textarea
              placeholder=" "
              value={values.message}
              errorBorderColor="red.500"
              onBlur={handleBlur("message")}
              onChange={(e) => handleChange("message")(e.target.value)}
            />
            {/* It is important that the Label comes after the Control due to css selectors */}
            <FormLabel>Message</FormLabel>
            <FormHelperText>Enter a message for the response.</FormHelperText>
            {!!errors.message && (
              <FormErrorMessage>
                {errors.message && touched.message && errors.message}
              </FormErrorMessage>
            )}
          </FormControl>

          <Box mt={8}>
            <Button onClick={() => navigate("/responses")} mr={4}>
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

export default NewResponse;
