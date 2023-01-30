import {
  Avatar,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Select,
  Stack,
  theme,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import FocusLock from "react-focus-lock";
import {
  GiBossKey,
  GiExitDoor,
  GiMeepleGroup,
  GiScrollQuill,
  GiScrollUnfurled,
  GiShop,
  GiVintageRobot,
} from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { Autocomplete, Item } from "./Autocomplete";

import { useAsyncList } from "react-stately";
import { formatPhoneNumber } from "../utils";
const Logo = require("../../../../public/logo.svg").default;

const TopBar = styled.div`
  display: flex;
  padding: 10px;
  background-color: ${theme.colors.purple[900]};
  color: ${theme.colors.white};
  align-items: center;
`;
const SecondBar = styled.div`
  display: flex;
  padding: 10px;
  background-color: ${theme.colors.purple[700]};
  color: ${theme.colors.white};
  align-items: center;
`;
const ChangeLink = styled.a`
  text-decoration: underline;
  color: ${theme.colors.white};
  margin-left: 4px;
  :hover {
    color: ${theme.colors.gray[200]};
  }
`;

const LogoContainer = styled.div`
  flex: 0 1 150px;
  margin-left: 8px;
  background-color: ${theme.colors.purple[900]};
  color: ${theme.colors.white};
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
`;

const Logos = styled(Logo)`
  fill: white;
  stroke: none;
  width: 150px;
  color: white;
  margin-right: 24px;
  cursor: pointer;

  text {
    fill: white;
  }
`;

const Space = styled.div`
  flex: 1 1 auto;
`;

const UserMenuButton = styled(MenuButton)`
  margin: 0 15px 0 16px;
`;
const SignoutButton = styled(MenuItem)`
  && {
    color: ${theme.colors.purple[900]};
  }
`;
const Icon = styled.span`
  margin-right: 8px;
`;

interface User {
  email?: string;
}

export const Header = ({ currentUser, currentLocation, locations }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const firstFieldRef = React.useRef(null);
  const navigate = useNavigate();

  const signOut = async () => {
    try {
      window.location.href = "/users/sign_out";
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };

  let list = useAsyncList<{ name: string }>({
    async load({ signal, cursor, filterText }) {
      if (cursor) {
        cursor = cursor.replace(/^http:\/\//i, "https://");
      }

      // If no cursor is available, then we're loading the first page,
      // filtering the results returned via a query string that
      // mirrors the input text.
      // Otherwise, the cursor is the next URL to load,
      // as returned from the previous page.
      let res = await fetch(cursor || `/search/?query=${filterText}`, {
        signal,
      });
      let json = await res.json();
      console.log(json);
      return {
        items: json.hits,
        cursor: json.next,
      };
    },
  });

  return (
    <>
      <TopBar>
        <LogoContainer onClick={() => navigate("/")}>
          <Logos />
        </LogoContainer>

        <Autocomplete
          items={list.items}
          inputValue={list.filterText}
          onInputChange={list.setFilterText}
          loadingState={list.loadingState}
          onLoadMore={list.loadMore}
          onSelectionChange={(item) =>
            (window.location.href = `/memberships/${item}`)
          }
        >
          {(item: {
            objectID: string;
            name: string;
            last_name: string;
            full_name: string;
            email: string;
            phone: string;
            additional_members: any;
            brand: string;
            last4: string;
            notes: string;
          }) => (
            <Item key={item.objectID}>
              <div>
                {item.name} {item.last_name}
                <div>
                  {item.email} &middot; {formatPhoneNumber(item.phone)}
                </div>
                {item.additional_members.length > 0 && (
                  <div>
                    Additional Members:{" "}
                    {item.additional_members
                      .map(
                        (e) =>
                          `${e.name} ${
                            e.email || e.phone
                              ? `(${[e.email, e.phone].join(" - ")})`
                              : ""
                          }`
                      )
                      .join(", ")}
                  </div>
                )}
                {(item.brand || item.last4) && (
                  <div>
                    Payment: {item.brand} **** {item.last4}
                  </div>
                )}
                {item.notes && <div>Notes: {item.notes}</div>}
              </div>
            </Item>
          )}
        </Autocomplete>

        <Space />
        <Menu>
          <UserMenuButton>
            <Avatar name={currentUser.name} src="" />
          </UserMenuButton>
          <MenuList>
            <SignoutButton
              onClick={() => navigate(`/users/${currentUser.id}/edit`)}
            >
              <Icon>
                <GiVintageRobot />
              </Icon>
              My Account
            </SignoutButton>
            <SignoutButton onClick={() => navigate("/users")}>
              <Icon>
                <GiMeepleGroup />
              </Icon>
              Users
            </SignoutButton>
            <SignoutButton onClick={() => navigate("/locations")}>
              <Icon>
                <GiShop />
              </Icon>
              Locations
            </SignoutButton>
            <SignoutButton onClick={() => navigate("/responses")}>
              <Icon>
                <GiScrollQuill />
              </Icon>
              SMS Responses
            </SignoutButton>
            <SignoutButton onClick={() => navigate("/reports")}>
              <Icon>
                <GiScrollUnfurled />
              </Icon>
              Reports
            </SignoutButton>
            <SignoutButton onClick={() => navigate("/settings")}>
              <Icon>
                <GiBossKey />
              </Icon>
              Business Settings
            </SignoutButton>
            <MenuDivider />
            <SignoutButton onClick={signOut}>
              <Icon>
                <GiExitDoor />{" "}
              </Icon>{" "}
              Sign out
            </SignoutButton>
          </MenuList>
        </Menu>
      </TopBar>
      <SecondBar>
        Viewing Location: {currentLocation.name} -
        <Popover
          isOpen={isOpen}
          initialFocusRef={firstFieldRef}
          onOpen={onOpen}
          onClose={onClose}
          placement="right"
          closeOnBlur={true}
        >
          <PopoverTrigger>
            <ChangeLink>Change</ChangeLink>
          </PopoverTrigger>
          <PopoverContent p={5}>
            <FocusLock returnFocus persistentFocus={false}>
              <PopoverArrow />
              <PopoverCloseButton />
              <Form
                firstFieldRef={firstFieldRef}
                onCancel={onClose}
                locations={locations}
              />
            </FocusLock>
          </PopoverContent>
        </Popover>
      </SecondBar>
    </>
  );
};

// 2. Create the form
const Form = ({ firstFieldRef, onCancel, locations }) => {
  const navigate = (location) => {
    window.location.href = location;
  };
  return (
    <Stack>
      <Select
        color="black"
        ref={firstFieldRef}
        placeholder="Select Location"
        onChange={(e) => navigate(`/update-location/${e.target.value}`)}
      >
        {locations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </Select>
    </Stack>
  );
};
