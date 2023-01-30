import * as React from "react";
import { Box, ChakraProvider, extendTheme, Flex, Text } from "@chakra-ui/react";
import styled from "styled-components";
import { Header } from "./layout/Header";
import { Navbar } from "./layout/Navbar";
import { BrowserRouter } from "react-router-dom";
import Navigation from "./layout/Navigation";
import { SkipNavLink, SkipNavContent } from "@chakra-ui/skip-nav";
import { theme } from "@chakra-ui/pro-theme";

const activeLabelStyles = {
  transform: "scale(0.85) translateY(-24px)",
};
export const PStheme = extendTheme(
  {
    colors: { ...theme.colors, brand: theme.colors.purple },
    components: {
      Form: {
        variants: {
          floating: {
            container: {
              _focusWithin: {
                label: {
                  ...activeLabelStyles,
                },
              },
              "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
                {
                  ...activeLabelStyles,
                },
              label: {
                top: 0,
                left: 0,
                zIndex: 2,
                position: "absolute",
                backgroundColor: "white",
                pointerEvents: "none",
                mx: 3,
                px: 1,
                my: 2,
                transformOrigin: "left top",
              },
            },
          },
        },
      },
    },
  },
  theme
);

function App({ current_user, current_location, locations }) {
  return (
    <BrowserRouter>
      <ChakraProvider theme={PStheme}>
        <SkipNavLink>Skip to content</SkipNavLink>
        <Header
          currentUser={current_user}
          locations={locations}
          currentLocation={current_location}
        />
        <Flex>
          <Navbar />
          <Box py={20} px="40px" backgroundColor={"white"} w="full">
            <SkipNavContent />
            <Navigation />

            <Text fontSize="xs" align="center" mt={10}>
              Copyright Crowdflare INC 2022&copy;. All Rights Reserved.{" "}
              <a href="https://www.crowdflare.app/privacy" target="_blank">
                Privacy Policy
              </a>
            </Text>
          </Box>
        </Flex>
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default (props) => <App {...props} />;
