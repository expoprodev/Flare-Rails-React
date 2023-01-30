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

interface Errors {
  name?: string;
}

function EditPlan() {
  const [plan, setPlan] = useState({ id: "", name: "", default: false });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const fetchPlan = async () => {
    const res = await axios.get(`/plans/${id}.json`);
    setPlan(res.data);
    setLoading(false);
  };

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchPlan();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(true);
  };

  const handleDelete = async () => {
    await axios.delete(`/plans/${plan.id}`);
    setOpen(false);
    navigate("/plans");
  };

  const processSubmit = async (values, setSubmitting) => {
    try {
      await axios.patch(`/plans/${id}.json`, {
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

  return loading ? (
    <Loading />
  ) : (
    <>
      <Formik
        initialValues={{ ...plan }}
        isInitialValid={false}
        validate={(values) => {
          const errors: Errors = {};
          if (!values.name) {
            errors.name = "A name required";
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
              Edit Plan
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

            <FormControl my={4}>
              <FormLabel>
                Will this be the default plan when creating new members?
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
            This will archive the Plan and remove it from your plans.
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

export default EditPlan;
