import * as React from "react";
import type { ComboBoxProps } from "@react-types/combobox";
import type { LoadingState } from "@react-types/shared";
import { useComboBoxState } from "react-stately";
import { useComboBox, useFilter } from "react-aria";
import { Search2Icon } from "@chakra-ui/icons";
import {
  Input,
  InputGroup,
  InputRightElement,
  FormLabel,
  Box,
  Spinner,
  InputLeftElement,
  theme,
} from "@chakra-ui/react";

import { ListBox } from "./ListBox";
import { Popover } from "./Popover";
import { GiBinoculars } from "react-icons/gi";
import styled from "styled-components";

const TranslateInput = styled.input`
  && {
    padding: 6px 8px 8px 42px;
    background-color: ${theme.colors.purple[800]};
    color: ${theme.colors.white};
    border: none;
    flex: 1 1 auto;
    border-radius: 8px;
    outline: none;
    margin: 2px 0;
    ::placeholder,
    ::-webkit-input-placeholder {
      color: ${theme.colors.gray[300]};
    }
    :-ms-input-placeholder {
      color: ${theme.colors.gray[300]};
    }
  }
`;
export { Item, Section } from "react-stately";

interface AutocompleteProps<T> extends ComboBoxProps<T> {
  loadingState?: LoadingState;
  onLoadMore?: () => void;
}

export function Autocomplete<T extends object>(props: AutocompleteProps<T>) {
  let { contains } = useFilter({ sensitivity: "base" });
  let state = useComboBoxState({ ...props, defaultFilter: contains });

  let inputRef = React.useRef(null);
  let listBoxRef = React.useRef(null);
  let popoverRef = React.useRef(null);

  let { inputProps, listBoxProps, labelProps } = useComboBox(
    {
      ...props,
      inputRef,
      listBoxRef,
      popoverRef,
    },
    state
  );

  return (
    <Box display="inline-block" position="relative" width="100%">
      <FormLabel {...labelProps}>{props.label}</FormLabel>
      <InputGroup>
        <InputLeftElement>
          <GiBinoculars size="20px" color="gray.300" />
        </InputLeftElement>
        <TranslateInput {...inputProps} ref={inputRef} placeholder="Search" />
        <InputRightElement>
          {props.loadingState === "loading" ||
          props.loadingState === "filtering" ? (
            <Spinner color="purple.400" size="sm" />
          ) : null}
        </InputRightElement>
      </InputGroup>
      {state.isOpen && (
        <Popover
          popoverRef={popoverRef}
          isOpen={state.isOpen}
          onClose={state.close}
        >
          <ListBox
            {...listBoxProps}
            listBoxRef={listBoxRef}
            state={state}
            loadingState={props.loadingState}
            onLoadMore={props.onLoadMore}
          />
        </Popover>
      )}
    </Box>
  );
}
