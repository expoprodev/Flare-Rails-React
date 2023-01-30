import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";

import axios from "axios";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";

import { CapSelect } from "../../ui/form";

interface Errors {
  name?: string;
  address?: string;
  address_ext?: string;
  city?: string;
  state?: string;
  zip?: string;
}

function NewLocation() {
  const location = {
    id: "",
    name: "",
    address: "",
    address_ext: "",
    city: "",
    state: "AL",
    zip: "",
  };

  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const navigate = useNavigate();
  const toast = useToast();

  const processSubmit = async (values, setSubmitting) => {
    try {
      await axios.post(`/locations`, {
        location: {
          ...values,
        },
      });
      navigate("/locations");
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
      initialValues={{ ...location }}
      isInitialValid={false}
      validate={(values) => {
        const errors: Errors = {};
        if (!values.name) {
          errors.name = "A name required";
        }
        if (!values.address) {
          errors.address = "An address required";
        }

        if (!values.city) {
          errors.city = "A city required";
        }
        if (!values.state) {
          errors.state = "A state required";
        }
        if (!values.zip) {
          errors.zip = "A zip required";
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
            New Location
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
            <FormHelperText>Enter a name for the location.</FormHelperText>
            {!!errors.name && (
              <FormErrorMessage>
                {errors.name && touched.name && errors.name}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            variant="floating"
            id="address"
            isRequired
            isInvalid={!!errors.address}
            mb={8}
          >
            <Input
              placeholder=" "
              value={values.address}
              errorBorderColor="red.500"
              onBlur={handleBlur("address")}
              onChange={(e) => handleChange("address")(e.target.value)}
            />
            {/* It is important that the Label comes after the Control due to css selectors */}
            <FormLabel>Address</FormLabel>
            <FormHelperText>Enter an address for the location.</FormHelperText>
            {!!errors.address && (
              <FormErrorMessage>
                {errors.address && touched.address && errors.address}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            variant="floating"
            id="address_ext"
            isRequired
            isInvalid={!!errors.address_ext}
            mb={8}
          >
            <Input
              placeholder=" "
              value={values.address_ext}
              errorBorderColor="red.500"
              onBlur={handleBlur("address_ext")}
              onChange={(e) => handleChange("address_ext")(e.target.value)}
            />
            {/* It is important that the Label comes after the Control due to css selectors */}
            <FormLabel>Address Line 2</FormLabel>
            <FormHelperText>Suite 200</FormHelperText>
            {!!errors.address_ext && (
              <FormErrorMessage>
                {errors.address_ext &&
                  touched.address_ext &&
                  errors.address_ext}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            variant="floating"
            id="city"
            isRequired
            isInvalid={!!errors.city}
            mb={8}
          >
            <Input
              placeholder=" "
              value={values.city}
              errorBorderColor="red.500"
              onBlur={handleBlur("city")}
              onChange={(e) => handleChange("city")(e.target.value)}
            />
            {/* It is important that the Label comes after the Control due to css selectors */}
            <FormLabel>City</FormLabel>
            <FormHelperText></FormHelperText>
            {!!errors.city && (
              <FormErrorMessage>
                {errors.city && touched.city && errors.city}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl mb={8}>
            <FormLabel>State</FormLabel>
            <CapSelect
              isRequired
              onChange={handleChange("state")}
              value={values.state}
            >
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </CapSelect>
            <FormHelperText>
              Times will be displayed relative to this timezone.
            </FormHelperText>
          </FormControl>

          <FormControl
            variant="floating"
            id="zip"
            isRequired
            isInvalid={!!errors.zip}
            mb={8}
          >
            <Input
              placeholder=" "
              value={values.zip}
              errorBorderColor="red.500"
              onBlur={handleBlur("zip")}
              onChange={(e) => handleChange("zip")(e.target.value)}
            />
            {/* It is important that the Label comes after the Control due to css selectors */}
            <FormLabel>Zip</FormLabel>
            <FormHelperText></FormHelperText>
            {!!errors.zip && (
              <FormErrorMessage>
                {errors.zip && touched.zip && errors.zip}
              </FormErrorMessage>
            )}
          </FormControl>

          <Box mt={8}>
            <Button onClick={() => navigate("/locations")} mr={4}>
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

export default NewLocation;
