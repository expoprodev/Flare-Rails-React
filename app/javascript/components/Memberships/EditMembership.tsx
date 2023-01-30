import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import React from "react";
import { Formik } from "formik";

interface Errors {
  name?: string;
  phone?: string;
  email?: string;
  notes?: string;
  quantity?: string;
  location_id?: string;
}
export default function EditMembership({
  open = true,
  onClose,
  onSave,
  member,
  locations,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Formik
        initialValues={{
          name: member.name,
          last_name: member.last_name,
          phone: member.phone,
          email: member.email,
          notes: member.notes,
          location_id: member.location_id,
        }}
        isInitialValid={true}
        validate={(values) => {
          const errors: Errors = {};

          if (!values.location_id) {
            errors.location_id = "A location is required";
          }
          if (!values.name) {
            errors.name = "A name is required";
          }
          if (!values.last_name) {
            errors.name = "A name is required";
          }
          if (!values.phone) {
            errors.phone = "A phone is required";
          }
          if (!values.email) {
            errors.email = "A email is required";
          }
          return errors;
        }}
        onSubmit={(values) => {
          onSave(values);
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
            <DialogTitle id="alert-dialog-title">
              Edit Member Information
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel id="demo-simple-select-label">
                      Location
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={Number(values.location_id)}
                      name="membership[location_id]"
                      onChange={handleChange("location_id")}
                      onBlur={handleBlur("location_id")}
                      error={!!errors.location_id}
                      label="Location"
                    >
                      {locations.map((l) => (
                        <MenuItem key={l.id} value={l.id}>
                          {l.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors.location_id &&
                        touched.location_id &&
                        errors.location_id}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="name"
                    name="membership[name]"
                    label="First Name"
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
                    id="last_name"
                    name="membership[last_name]"
                    label="Last Name"
                    variant="outlined"
                    required
                    fullWidth
                    value={values.last_name}
                    onChange={handleChange("last_name")}
                    onBlur={handleBlur("last_name")}
                    error={!!errors.last_name}
                    helperText={
                      errors.last_name && touched.last_name && errors.last_name
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="email"
                    name="membership[email]"
                    label="Email"
                    variant="outlined"
                    required
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
                    required
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
              <Button onClick={onClose} color="default" size="large">
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
