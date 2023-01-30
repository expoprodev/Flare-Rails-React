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
  message?: string;
}

function EditResponse() {
  const [response, setResponse] = useState({
    id: "",
    message: "",
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchResponse = async () => {
    const res = await axios.get(`/responses/${id}.json`);

    setResponse(res.data);
    setLoading(false);
  };

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchResponse();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(true);
  };

  const handleDelete = async () => {
    await axios.delete(`/responses/${response.id}.json`);
    setOpen(false);
    navigate("/responses");
  };

  const processSubmit = async (values, setSubmitting) => {
    try {
      await axios.patch(`/responses/${id}.json`, {
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

  return loading ? (
    <Loading />
  ) : (
    <>
      <Formik
        initialValues={{ ...response }}
        isInitialValid={false}
        validate={(values) => {
          const errors: Errors = {};
          if (!values.message) {
            errors.message = "A message is required";
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
              Edit Response
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

            <Divider my={8} />
            <Heading mb="4" size="md">
              Danger Area
            </Heading>
            <Box mr={2}>
              <Button colorScheme="red" onClick={handleConfirm}>
                Delete
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will archive the response and remove it from your responses.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} colorScheme="red">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditResponse;
