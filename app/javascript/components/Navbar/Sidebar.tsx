import React, { useState } from "react";
import {
  Drawer,
  Toolbar,
  AppBar,
  IconButton,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Hidden,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { theme } from "../../theme";

const navigation = [
  // {
  //   name: "Activity",
  //   href: "/dashboard",
  // },
  // {
  //   name: "Analytics",
  //   href: "/analytics",
  // },
  // {
  //   name: "Codes",
  //   href: "/codes",
  // },
  // {
  //   name: "Guests",
  //   href: "/customers",
  // },
  {
    name: "Memberships",
    href: "/memberships",
  },
  // {
  //   name: "Plans",
  //   href: "/plans",
  // },
  {
    name: "Readers",
    href: "/readers",
  },
  // {
  //   name: "Requests",
  //   href: "/requests",
  // },
];

export default function Sidebar() {
  const [drawerState, setDrawerState] = useState(false);

  const navigate = (url: string) => {
    window.location.href = url;
  };

  return (
    <Hidden smUp>
      <ThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawerState(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="left"
          open={drawerState}
          onClose={() => setDrawerState(false)}
        >
          <List>
            {navigation.map((item) => (
              <ListItem
                button
                key={item.name}
                onClick={() => navigate(item.href)}
              >
                <ListItemText primary={item.name} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </ThemeProvider>
    </Hidden>
  );
}
