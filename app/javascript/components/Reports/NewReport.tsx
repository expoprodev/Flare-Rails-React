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
  start_date?: string;
  end_date?: string;
}

function NewReport() {
  const report = {
    id: "",
    name: "",
    start_date: "",
    end_date: "",
  };

  const navigate = useNavigate();
  const toast = useToast();

  const processSubmit = async (values, setSubmitting) => {
    try {
      await axios.post(`/reports`, {
        report: {
          ...values,
        },
      });
      navigate("/reports");
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
      initialValues={{ ...report }}
      isInitialValid={false}
      validate={(values) => {
        const errors: Errors = {};
        if (!values.name) {
          errors.name = "A name is required";
        }
        if (!values.start_date) {
          errors.start_date = "A start date is required";
        }
        if (!values.end_date) {
          errors.end_date = "An end date is required";
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
            New Report
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
            <FormHelperText>Enter a name for the report.</FormHelperText>
            {!!errors.name && (
              <FormErrorMessage>
                {errors.name && touched.name && errors.name}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            variant="floating"
            id="start_date"
            isRequired
            isInvalid={!!errors.start_date}
            mb={8}
          >
            <Input
              placeholder=" "
              value={values.start_date}
              errorBorderColor="red.500"
              onBlur={handleBlur("start_date")}
              type="date"
              onChange={(e) => handleChange("start_date")(e.target.value)}
            />
            {/* It is important that the Label comes after the Control due to css selectors */}
            <FormLabel>Select a start time frame</FormLabel>
            <FormHelperText>
              This is the time the report should start from.
            </FormHelperText>
            {!!errors.start_date && (
              <FormErrorMessage>
                {errors.start_date && touched.start_date && errors.start_date}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            variant="floating"
            id="end_date"
            isRequired
            isInvalid={!!errors.end_date}
            mb={8}
          >
            <Input
              placeholder=" "
              value={values.end_date}
              errorBorderColor="red.500"
              onBlur={handleBlur("end_date")}
              type="date"
              onChange={(e) => handleChange("end_date")(e.target.value)}
            />
            {/* It is important that the Label comes after the Control due to css selectors */}
            <FormLabel>Select an end time frame</FormLabel>
            <FormHelperText>
              This is the time the report should end.
            </FormHelperText>
            {!!errors.end_date && (
              <FormErrorMessage>
                {errors.end_date && touched.end_date && errors.end_date}
              </FormErrorMessage>
            )}
          </FormControl>

          <Box mt={8}>
            <Button onClick={() => navigate("/reports")} mr={4}>
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

export default NewReport;
