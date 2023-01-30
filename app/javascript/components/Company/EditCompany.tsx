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
  Flex,
  theme,
} from "@chakra-ui/react";
import { Loading } from "../../ui/Loading";
import { GiBossKey } from "react-icons/gi";

interface Errors {
  name?: string;
  percent?: string;
  inclusive?: string;
}

export default function EditCompany() {
  const [company, setCompany] = useState({
    id: "",
    name: "",
    address: "",
    address_ext: "",
    city: "",
    state: "",
    zip: "",
  });
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const fetchCompany = async () => {
    const res = await axios.get(`/companies/${id}.json`);
    setCompany(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const processSubmit = async (values, setSubmitting) => {
    try {
      await axios.patch(`/companies/${id}.json`, {
        coupon: {
          ...values,
        },
      });
      navigate("/companies");
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
        initialValues={{ ...company }}
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
            <Flex alignItems={"center"} mb={8}>
              <Heading size="md" mx={"10px"}>
                Edit Business Settings
              </Heading>
              <GiBossKey size={36} color={theme.colors.purple[500]} />
            </Flex>

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
              <FormHelperText>Enter a name for your company.</FormHelperText>
              {!!errors.name && (
                <FormErrorMessage>
                  {errors.name && touched.name && errors.name}
                </FormErrorMessage>
              )}
            </FormControl>

            <Box mt={8}>
              <Button onClick={() => navigate("/companies")} mr={4}>
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
          </form>
        )}
      </Formik>
    </>
  );
}
