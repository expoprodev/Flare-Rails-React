import React from "react";
import {
  Typography,
  Grid,
  Chip,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Paper,
  Box,
  ThemeProvider,
} from "@material-ui/core";
import { theme } from "../../theme";

function ShowPlan({ stripe_plan, plan }) {
  const navigate = (url: string) => {
    window.location.href = url;
  };
  return (
    <ThemeProvider theme={theme}>
      <Card>
        <CardHeader title={stripe_plan.nickname} />
        <Divider />
        <CardContent>
          <Paper variant="outlined">
            <Box padding={4}>
              <Grid
                container
                xs={12}
                alignItems="center"
                justify="space-between"
              >
                <Box>
                  <Typography variant="h4" gutterBottom display="inline">
                    ${stripe_plan.amount / 100}
                  </Typography>
                  <Typography variant="h6" gutterBottom display="inline">
                    /{stripe_plan.interval}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    <Chip
                      label={stripe_plan.active ? "Active" : "Not Active"}
                    />
                  </Typography>
                </Box>
              </Grid>
            </Box>
          </Paper>
        </CardContent>
        <CardActions>
          <Button variant="contained" onClick={() => navigate("/plans")}>
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/plans/${plan.id}/edit`)}
          >
            Edit
          </Button>
        </CardActions>
      </Card>
    </ThemeProvider>
  );
}

export default ShowPlan;
