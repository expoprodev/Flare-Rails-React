import * as React from "react";
import { ChakraProvider, extendTheme, Flex, Text } from "@chakra-ui/react";
import styled from "styled-components";
import { Header } from "./layout/Header";
import { Navbar } from "./layout/Navbar";
import { BrowserRouter } from "react-router-dom";
import UnauthNavigation from "./layout/UnauthNavigation";
import { SkipNavLink, SkipNavContent } from "@chakra-ui/skip-nav";
import Login from "./Login/Login";
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

function Authentication() {
  return (
    <BrowserRouter>
      <ChakraProvider theme={PStheme}>
        <SkipNavLink>Skip to content</SkipNavLink>
        <UnauthNavigation />
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default (props) => <Authentication {...props} />;
