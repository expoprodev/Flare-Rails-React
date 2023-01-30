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
import { useNavigate, useParams } from "react-router-dom";
import {
  Heading,
  FormErrorMessage,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Box,
  Button,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { Loading } from "../../ui/Loading";

interface Errors {
  name?: string;
  percent?: string;
  inclusive?: string;
}

export default function EditCoupon() {
  const [open, setOpen] = useState(false);
  const [coupon, setCoupon] = useState({ id: "", name: "" });
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const fetchCoupon = async () => {
    const res = await axios.get(`/coupons/${id}.json`);
    setCoupon(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupon();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(true);
  };

  const processSubmit = async (values, setSubmitting) => {
    try {
      await axios.patch(`/coupons/${id}.json`, {
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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`/coupons/${coupon.id}`);

      navigate("/coupons");
    } catch (err) {
      toast({
        title: "An error occurred.",
        description: err.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setIsDeleting(false);
      setOpen(false);
    }
  };
  return loading ? (
    <Loading />
  ) : (
    <>
      <Formik
        initialValues={{ ...coupon }}
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
              Edit Coupon
            </Heading>

            <FormControl
              variant="floating"
              id="first-name"
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
              <FormHelperText>Enter a name for your coupon.</FormHelperText>
              {!!errors.name && (
                <FormErrorMessage>
                  {errors.name && touched.name && errors.name}
                </FormErrorMessage>
              )}
            </FormControl>

            <Box mt={8}>
              <Button onClick={() => navigate("/coupons")} mr={4}>
                Back
              </Button>
              <Button
                mr={4}
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
                Delete Coupon
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>This will remove the coupon.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleDelete}
            colorScheme="red"
            isLoading={isDeleting}
          >
            Delete Coupon
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
