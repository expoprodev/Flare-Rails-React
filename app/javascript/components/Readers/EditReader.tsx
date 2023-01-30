import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik } from "formik";
import { Loading } from "../../ui/Loading";
import { useNavigate, useParams } from "react-router-dom";
import {
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
  Box,
  Button,
  Divider,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";

interface Errors {
  label?: string;
}

function EditReader() {
  const [open, setOpen] = useState(false);
  const [reader, setReader] = useState({ id: "", label: "" });
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  const fetchReader = async () => {
    const res = await axios.get(`/readers/${id}.json`);
    setReader(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReader();
  }, []);

  const [loading, setLoading] = useState(true);
  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(true);
  };

  const handleDelete = async () => {
    await axios.delete(`/readers/${reader.id}.json`);
    setOpen(false);
    navigate("/readers");
  };

  const processSubmit = async (values, setSubmitting) => {
    try {
      await axios.patch(`/readers/${id}.json`, {
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
  return loading ? (
    <Loading />
  ) : (
    <>
      <Formik
        initialValues={{ ...reader }}
        isInitialValid={false}
        validate={(values) => {
          const errors: Errors = {};
          if (!values.label) {
            errors.label = "A label is required";
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
              Edit Card Reader
            </Heading>

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
              <FormLabel>Label</FormLabel>
              <FormHelperText>
                Enter a label for the card reader.
              </FormHelperText>
              {!!errors.label && (
                <FormErrorMessage>
                  {errors.label && touched.label && errors.label}
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
            This is remove the reader from your account and you will no longer
            be able to accept credit cards from it. Don't worry, you can always
            add it back.
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

export default EditReader;
