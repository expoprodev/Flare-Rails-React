import * as React from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  StackProps,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import Logo from "../../../../public/logo.svg";
import styled from "styled-components";
import { GoogleIcon } from "./ProviderIcons";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useToast } from "@chakra-ui/react";
const Logos = styled(Logo)`
  /* width: 350px; */
  margin-bottom: 40px;
`;

export const SignInForm = (props: StackProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const toast = useToast();

  const handleLogin = async (data) => {
    console.log("login", data);

    const { email, password } = data;

    let formData = new FormData();
    formData.append("user[email]", email);
    formData.append("user[password]", password);

    const res = await fetch("/users/sign_in", {
      method: "POST",
      credentials: "same-origin",
      body: formData,
      mode: "no-cors",
      headers: {
        "Content-Type": "form-data",
      },
    });

    const response = await res.json();
    console.log("res", response);

    if (response.success) {
      window.location.href = "/";
    }

    if (response.error) {
      toast({
        title: "Trouble signing you in.",
        description: "Invalid email or password",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Stack spacing="8" {...props}>
      <Stack spacing="6">
        {isMobile && <Logos />}
        <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
          <Heading size={useBreakpointValue({ base: "xs", md: "sm" })}>
            Log in to your account
          </Heading>
          <HStack spacing="1" justify="center">
            <Text color="muted">Don't have an account?</Text>
            <Button variant="link" colorScheme="blue">
              Sign up
            </Button>
          </HStack>
        </Stack>
      </Stack>
      <form onSubmit={handleSubmit(handleLogin)}>
        <Stack spacing="6">
          <Stack spacing="5">
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                {...register("email", { required: true })}
                id="email"
                placeholder="Enter your email"
                type="email"
              />
              {errors.email?.type === "required" && "Email is required"}
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                {...register("password", { required: true })}
                id="password"
                placeholder="********"
                type="password"
              />
              {errors.password?.type === "required" && "Password is required"}
            </FormControl>
          </Stack>
          <HStack justify="space-between">
            <Checkbox defaultChecked>Remember me</Checkbox>
            <Button variant="link" colorScheme="blue" size="sm">
              Forgot password
            </Button>
          </HStack>
          <Stack spacing="4">
            <Button variant="primary" type="submit">
              Sign in
            </Button>
            {/* <Button
              variant="secondary"
              leftIcon={<GoogleIcon boxSize="5" />}
              iconSpacing="3"
            >
              Sign in with Google
            </Button> */}
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};
