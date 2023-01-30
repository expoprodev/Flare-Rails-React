import {
  Box,
  Button,
  Divider,
  Flex,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { round } from "lodash";
import React from "react";
import { currencyFormat } from "../utils";

export default function OrderSummary({
  plan,
  quantity,
  coupon,
  signature,
  taxRate,
  isSubmitting,
  isValid,
  setShowSignpad,
  submitForm,
}) {
  const calcSubtotal = () => (plan?.amount / 100) * quantity;
  const subTotal = calcSubtotal();

  const calcTax = (total) => {
    console.log("tax total", total);
    let tax = 0;
    if (!taxRate.inclusive) {
      console.log("taxRate.percentage", taxRate.percentage);
      tax = total * (taxRate.percentage / 100);
      console.log("tax", tax);
    }
    if (taxRate.inclusive) {
      tax = 0;
    }

    return tax;
  };
  const calcDiscount = (total) => {
    let discount = 0;
    if (coupon && coupon.percent_off) {
      discount = total * (coupon.percent_off / 100);
    }
    if (coupon && coupon.amount_off) {
      discount = coupon.amount_off / 100;
    }
    return discount;
  };
  const calcTotal = () => {
    return (
      subTotal -
      calcDiscount(subTotal) +
      calcTax(subTotal - calcDiscount(subTotal))
    );
  };

  return (
    <>
      <Stack spacing="6">
        <Stack spacing="3">
          <Text
            fontSize="lg"
            fontWeight="semibold"
            color={useColorModeValue("gray.700", "gray.200")}
          >
            Order Summary
          </Text>
          <Stack direction="row" justify="space-between">
            <Text color={useColorModeValue("gray.600", "gray.300")}>
              Quantity
            </Text>
            <Text color={useColorModeValue("black", "white")}>{quantity}</Text>
          </Stack>
          <Stack direction="row" justify="space-between">
            <Text color={useColorModeValue("gray.600", "gray.300")}>
              Subtotal
            </Text>
            <Text color={useColorModeValue("black", "white")}>
              {currencyFormat(calcSubtotal())}
            </Text>
          </Stack>
          {!!Object.values(coupon).length && (
            <Stack direction="row" justify="space-between">
              {coupon?.percent_off && (
                <>
                  <Text color={useColorModeValue("gray.600", "gray.300")}>
                    <>
                      Discount -{coupon?.percent_off}% ({coupon?.duration}
                      {coupon?.duration === "repeating"
                        ? ` ${coupon?.duration_in_months} mo`
                        : ""}
                      )
                    </>
                  </Text>
                  <Text color={useColorModeValue("purple.500", "purple.200")}>
                    {currencyFormat(
                      (calcSubtotal() * coupon?.percent_off) / 100
                    )}
                  </Text>
                </>
              )}

              {coupon?.amount_off && (
                <>
                  {" "}
                  <Text color={useColorModeValue("gray.600", "gray.300")}>
                    <>
                      Discount -{currencyFormat(coupon?.amount_off / 100)} (
                      {coupon?.duration}
                      {coupon?.duration === "repeating"
                        ? ` ${coupon?.duration_in_months} mo`
                        : ""}
                      )
                    </>
                  </Text>
                  <Text color={useColorModeValue("purple.500", "purple.200")}>
                    -{currencyFormat(coupon?.amount_off / 100)}
                  </Text>
                </>
              )}
            </Stack>
          )}
          <Stack direction="row" justify="space-between">
            <Text color={useColorModeValue("gray.600", "gray.300")}>Tax</Text>
            <Text color={useColorModeValue("black", "white")}>
              {currencyFormat(calcTax(subTotal - calcDiscount(subTotal)))}
            </Text>
          </Stack>
        </Stack>

        <Stack direction="row" justify="space-between">
          <Text
            fontSize="lg"
            fontWeight="semibold"
            color={useColorModeValue("gray.700", "gray.200")}
          >
            Order Total
          </Text>
          <Text
            fontSize="xl"
            fontWeight="semibold"
            color={useColorModeValue("black", "white")}
          >
            {currencyFormat(calcTotal())} / {plan?.interval}
          </Text>
        </Stack>
      </Stack>
      {signature && (
        <>
          <Divider my={4} />

          <Flex
            alignItems={"center"}
            justifyContent="space-between"
            direction="row"
            mb="4"
          >
            <Text
              fontSize="lg"
              fontWeight="semibold"
              color={useColorModeValue("gray.700", "gray.200")}
            >
              Signature
            </Text>
            <Button size="xs" onClick={() => setShowSignpad(true)}>
              Redo Signature
            </Button>
          </Flex>
          <Box backgroundColor={"white"}>
            <img src={signature} width="80%" />
          </Box>
        </>
      )}
      <Stack spacing="4">
        {signature ? (
          <>
            <Divider my={4} />
            <Button
              type="submit"
              onClick={submitForm}
              colorScheme="purple"
              size="lg"
              isLoading={isSubmitting}
              disabled={isSubmitting || !isValid}
            >
              Submit
            </Button>
          </>
        ) : (
          <Button
            colorScheme="purple"
            size="lg"
            mt={8}
            py="7"
            onClick={() => setShowSignpad(true)}
          >
            Collect Consent
          </Button>
        )}
      </Stack>
    </>
  );
}
