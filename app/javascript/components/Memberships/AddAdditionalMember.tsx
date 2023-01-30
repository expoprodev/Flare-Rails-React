import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Axios from "axios";
import { Formik } from "formik";
import React, { useState } from "react";
import axios from "axios";

import styled from "styled-components";

const DialogTitleStyled = styled(DialogTitle)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface Errors {
  name?: string;
  phone?: string;
  email?: string;
  notes?: string;
}
const CloseButton = styled(IconButton)``;
export default function AddAdditionalMember({
  open,
  close,
  onSave,
  additionalMembers,
}) {
  const handleSave = async (values: any) => {
    onSave(values);
    close();
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Formik
        initialValues={{
          name: "",
          phone: "",
          email: "",
          notes: "",
        }}
        isInitialValid={true}
        validate={(values) => {
          const errors: Errors = {};

          if (values.name.length === 0) {
            errors.name = "A name is required";
          }

          return errors;
        }}
        onSubmit={(values) => {
          handleSave(values);
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
            <DialogTitleStyled id="alert-dialog-title">
              Add Member
            </DialogTitleStyled>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    id="name"
                    name="membership[name]"
                    label="Name "
                    variant="outlined"
                    required
                    fullWidth
                    value={values.name}
                    onChange={handleChange("name")}
                    onBlur={handleBlur("name")}
                    error={!!errors.name}
                    helperText={errors.name && touched.name && errors.name}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="email"
                    name="membership[email]"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={values.email}
                    onChange={handleChange("email")}
                    onBlur={handleBlur("email")}
                    error={!!errors.email}
                    helperText={errors.email && touched.email && errors.email}
                    inputProps={{ inputMode: "email" }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="phone"
                    name="membership[phone]"
                    label="Phone"
                    variant="outlined"
                    fullWidth
                    value={values.phone}
                    onChange={handleChange("phone")}
                    onBlur={handleBlur("phone")}
                    error={!!errors.phone}
                    helperText={errors.phone && touched.phone && errors.phone}
                    inputProps={{ inputMode: "numeric" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="notes"
                    name="membership[notes]"
                    variant="outlined"
                    label="Notes"
                    fullWidth
                    value={values.notes}
                    onChange={handleChange("notes")}
                    onBlur={handleBlur("notes")}
                    error={!!errors.notes}
                    helperText={errors.notes && touched.notes && errors.notes}
                    multiline
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={close} color="default" size="large">
                Close
              </Button>
              <Button
                type="submit"
                color="primary"
                size="large"
                disabled={isSubmitting || !isValid}
              >
                Save
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
}
