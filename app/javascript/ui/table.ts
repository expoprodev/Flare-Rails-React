import { theme, Tr } from "@chakra-ui/react";
import styled from "styled-components";

export const ClickableTr = styled(Tr)`
  cursor: pointer;

  :hover {
    background-color: ${theme.colors.gray[50]};
  }
`;
