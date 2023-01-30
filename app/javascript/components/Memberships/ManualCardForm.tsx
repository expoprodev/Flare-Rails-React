import {
  FormControl,
  Input,
  FormLabel,
  FormHelperText,
  SimpleGrid,
  FormErrorMessage,
} from "@chakra-ui/react";
import InputMask from "react-input-mask";

import React from "react";

export default function ManualCardForm({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
}) {
  return (
    <SimpleGrid columns={2} spacing={8}>
      <FormControl
        variant="floating"
        id="card_number"
        isRequired
        isInvalid={!!errors.card_number}
      >
        <Input
          placeholder=" "
          as={InputMask}
          mask="9999 9999 9999 9999"
          maskChar={null}
          value={values.card_number}
          errorBorderColor="red.500"
          onBlur={handleBlur("card_number")}
          type="text"
          onChange={(e) => handleChange("card_number")(e.target.value)}
        />
        {/* It is important that the Label comes after the Control due to css selectors */}
        <FormLabel>Card Number</FormLabel>
        <FormHelperText>Please enter the card number</FormHelperText>
        {!!errors.card_number && (
          <FormErrorMessage>
            {errors.card_number && touched.card_number && errors.card_number}
          </FormErrorMessage>
        )}
      </FormControl>
      <FormControl
        variant="floating"
        id="card_cvc"
        isRequired
        isInvalid={!!errors.card_cvc}
      >
        <Input
          placeholder=" "
          value={values.card_cvc}
          errorBorderColor="red.500"
          onBlur={handleBlur("card_cvc")}
          type="text"
          onChange={(e) => handleChange("card_cvc")(e.target.value)}
          maxLength={4}
        />
        {/* It is important that the Label comes after the Control due to css selectors */}
        <FormLabel>CVC</FormLabel>
        <FormHelperText>Please enter the cvc</FormHelperText>
        {!!errors.card_cvc && (
          <FormErrorMessage>
            {errors.card_cvc && touched.card_cvc && errors.card_cvc}
          </FormErrorMessage>
        )}
      </FormControl>
      <FormControl
        variant="floating"
        id="card_exp_month"
        isRequired
        isInvalid={!!errors.card_exp_month}
        mb={8}
      >
        <Input
          placeholder="mm"
          value={values.card_exp_month}
          errorBorderColor="red.500"
          onBlur={handleBlur("card_exp_month")}
          type="text"
          onChange={(e) => handleChange("card_exp_month")(e.target.value)}
          maxLength={2}
        />
        {/* It is important that the Label comes after the Control due to css selectors */}
        <FormLabel>Expiration Month</FormLabel>
        <FormHelperText>Please enter the month of expiration</FormHelperText>
        {!!errors.card_exp_month && (
          <FormErrorMessage>
            {errors.card_exp_month &&
              touched.card_exp_month &&
              errors.card_exp_month}
          </FormErrorMessage>
        )}
      </FormControl>
      <FormControl
        variant="floating"
        id="card_exp_year"
        isRequired
        isInvalid={!!errors.card_exp_year}
        mb={8}
      >
        <Input
          placeholder="yyyy"
          value={values.card_exp_year}
          errorBorderColor="red.500"
          onBlur={handleBlur("card_exp_year")}
          type="text"
          onChange={(e) => handleChange("card_exp_year")(e.target.value)}
          maxLength={4}
        />
        {/* It is important that the Label comes after the Control due to css selectors */}
        <FormLabel>Expiration Year</FormLabel>
        <FormHelperText>Please enter the year of expiration</FormHelperText>
        {!!errors.card_exp_year && (
          <FormErrorMessage>
            {errors.card_exp_year &&
              touched.card_exp_year &&
              errors.card_exp_year}
          </FormErrorMessage>
        )}
      </FormControl>
    </SimpleGrid>
  );
}
