import { createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ff9900",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f0623b",
      contrastText: "#ffffff",
    },
  },
});
