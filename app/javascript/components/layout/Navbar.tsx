import { Divider, theme } from "@chakra-ui/react";
import React from "react";
import { BsCreditCard2Front } from "react-icons/bs";
import {
  GiBroadsword,
  GiHealingShield,
  GiHealthPotion,
  GiPayMoney,
  GiTicket,
} from "react-icons/gi";
import { Link } from "react-router-dom";
import styled from "styled-components";

const NavMenu = styled.div`
  background-color: #f7fafc;
  min-height: 100%;
  flex-direction: column;
  display: flex;
  flex: 0 0 200px;
  padding: 20px;
  border-right: 1px solid #edf2f7;
`;

const NavMenuTitle = styled.div`
  font-size: 14px;
  color: ${theme.colors.purple[900]};
  text-transform: uppercase;
  margin-top: 30px;
  margin-bottom: 10px;
  font-weight: 600;
`;

const NavMenuItem = styled(Link)<any>`
  font-size: 16px;
  color: ${theme.colors.purple[900]};
  text-decoration: none;
  padding: 10px 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  && svg {
    margin-right: 8px;
  }
`;
const NavMenuLink = styled.a`
  font-size: 16px;
  color: ${theme.colors.purple[900]};
  text-decoration: none;
  padding: 10px 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  && svg {
    margin-right: 8px;
  }
`;
export const Navbar = () => {
  return (
    <NavMenu>
      {/* <NavMenuItem to="/dashboard">Activity</NavMenuItem> */}
      {/* <NavMenuItem to="/analytics">Analytics</NavMenuItem> */}
      {/* <NavMenuItem to="/codes">Codes</NavMenuItem> */}
      <NavMenuTitle>Manage</NavMenuTitle>
      <Divider />
      <NavMenuItem to="/memberships">
        <GiBroadsword />
        Members
      </NavMenuItem>
      <NavMenuItem to="/disputes">
        <GiHealingShield />
        Disputes
      </NavMenuItem>
      {/* <NavMenuItem to="/memberships">Loyalty</NavMenuItem>
      <NavMenuItem to="/memberships">Feedback</NavMenuItem>
      <NavMenuItem to="/memberships">Menus</NavMenuItem>
      <NavMenuItem to="/memberships">Requests</NavMenuItem> */}

      <NavMenuTitle>Setup</NavMenuTitle>
      <Divider />
      <NavMenuItem to="/readers">
        <BsCreditCard2Front />
        Card Readers
      </NavMenuItem>
      <NavMenuItem to="/coupons">
        <GiTicket />
        Coupons
      </NavMenuItem>
      {/* <NavMenuItem to="/coupons">Codes</NavMenuItem> */}
      {/* <NavMenuItem to="/customers">Guests</NavMenuItem> */}
      <NavMenuItem to="/plans">
        <GiHealthPotion />
        Plans
      </NavMenuItem>
      {/* <NavMenuItem to="/requests">Requests</NavMenuItem> */}
      <NavMenuItem to="/tax_rates">
        <GiPayMoney />
        Tax Rates
      </NavMenuItem>
    </NavMenu>
  );
};
