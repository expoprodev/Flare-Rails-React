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
  Textarea,
  Divider,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "../../ui/Loading";
import {
  TextField,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";

interface Errors {
  display_name?: string;
  percent?: string;
  inclusive?: string;
}

export default function EditTaskRate() {
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();

  const [taxRate, setTaxRate] = useState({
    id: "",
    display_name: "",
    description: "",
    default: "",
  });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchTaxRate = async () => {
    const res = await axios.get(`/tax_rates/${id}.json`);
    setTaxRate(res.data);
    setLoading(false);
  };
  useEffect(() => {
    fetchTaxRate();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(true);
  };

  const handleDelete = async () => {
    await axios.delete(`/tax_rates/${taxRate.id}`);
    setOpen(false);
    navigate("/tax_rates");
  };

  const processSubmit = async (values, setSubmitting) => {
    try {
      await axios.patch(`/tax_rates/${id}.json`, {
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

  return loading ? (
    <Loading />
  ) : (
    <>
      <Formik
        initialValues={{ ...taxRate }}
        validate={(values) => {
          const errors: Errors = {};
          if (!values.display_name) {
            errors.display_name = "A display name required";
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
              Edit Tax Rate
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

            <FormControl my={4}>
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
            This will archive the Tax Rate and remove it from your tax rates.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} colorScheme="red" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
