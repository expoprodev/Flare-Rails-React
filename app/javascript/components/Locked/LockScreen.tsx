import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  ThemeProvider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Paper,
  Typography,
} from "@material-ui/core";
import LockIcon from "@material-ui/icons/Lock";
import React, { useState } from "react";
import { theme } from "../../theme";
import axios from "axios";
import { Formik } from "formik";
import { useFormik } from "formik";

export default function LockScreen({ reader }) {
  const navigate = (url: string) => {
    window.location.href = url;
  };

  const processSubmit = async (values) => {
    try {
      await axios.post(`/switch`, { pin: values.pin });
      navigate("/");
    } catch {}
  };
  return (
    <ThemeProvider theme={theme}>
      <Dialog open={true} fullScreen>
        <DialogContent>
          <Box
            width="100%"
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Paper elevation={2}>
              <Formik
                initialValues={{ pin: "" }}
                isInitialValid={false}
                validate={(values) => {
                  const errors: { pin?: string } = {};
                  if (!values.pin) {
                    errors.pin = "A pin required";
                  }

                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  processSubmit(values);
                  setSubmitting(false);
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  isValid,
                  /* and other goodies */
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Box
                      p={10}
                      flexDirection="column"
                      display="flex"
                      alignItems="center"
                    >
                      <LockIcon fontSize="large" color="primary" />
                      <Typography variant="h4">Screen Locked</Typography>
                      <DialogContentText>
                        Please enter pin to continue.
                      </DialogContentText>
                      <TextField
                        autoFocus
                        value={values.pin}
                        onChange={(e: any) =>
                          handleChange("pin")(e.target.value)
                        }
                        onBlur={(e: any) => handleBlur("pin")}
                        fullWidth
                        inputProps={{ inputMode: "numeric" }}
                      />
                      <Box height={20} />
                      <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        disabled={isSubmitting || !isValid}
                        type="submit"
                        size="large"
                      >
                        Continue
                      </Button>
                    </Box>
                  </form>
                )}
              </Formik>
            </Paper>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}
