import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Switch,
} from "@material-ui/core";
import React, { useState } from "react";
import { Formik } from "formik";
import { Plan, Coupon } from "../../types";

interface Errors {
  stripe_plan_id?: string;
  quantity?: string;
  payment_method_id?;
  skip_payment?: boolean;
  trial_end?: string;
  cancel_at?: string;
}
export default function AddSubscription({
  open = true,
  onClose,
  onSave,
  plans,
  tax_rates,
  coupons,
  payment_methods,
}) {
  const [plan, setPlan] = useState<Plan>(plans[0]);
  const [taxRate, setTaxRate] = useState(tax_rates[0]);
  const [paymentMethod, setPaymentMethod] = useState(payment_methods.data[0]);
  const [coupon, setCoupon] = useState<Coupon>({});

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Formik
        initialValues={{
          quantity: 1,
          stripe_coupon_id: "",
          stripe_tax_rate_id: taxRate.stripe_metadata.id,
          stripe_plan_id: plan.stripe_plan_id,
          payment_method_id: paymentMethod?.id,
          skip_payment: false,
          trial_end: "",
          cancel_at: "",
        }}
        isInitialValid={true}
        validate={(values) => {
          const errors: Errors = {};

          if (!values.stripe_plan_id) {
            errors.stripe_plan_id = "A plan is required";
          }
          if (!values.skip_payment) {
            if (!values.payment_method_id) {
              errors.stripe_plan_id = "A payment is required";
            }
          }
          if (!values.quantity) {
            errors.quantity = "A quantity is required";
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
            <DialogTitle id="alert-dialog-title">Add Subscription</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel id="demo-simple-select-label">Plan</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={values.stripe_plan_id}
                      name="membership[stripe_plan_id]"
                      onChange={(e: any) => {
                        const stripe_plan_id = e.target.value;
                        const plan = plans.find(
                          (p) => p.stripe_plan_id == stripe_plan_id
                        );

                        handleChange("stripe_plan_id")(stripe_plan_id);
                        setPlan(plan);
                      }}
                      onBlur={handleBlur("stripe_plan_id")}
                      error={!!errors.stripe_plan_id}
                      label="Plan"
                    >
                      {plans.map((p) => (
                        <MenuItem
                          key={p.stripe_plan_id}
                          value={p.stripe_plan_id}
                        >
                          {p.name} (${p.amount / 100}/{p.interval})
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors.stripe_plan_id &&
                        touched.stripe_plan_id &&
                        errors.stripe_plan_id}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Switch onChange={handleChange("skip_payment")} /> Skip
                  Payment
                  {!values.skip_payment && (
                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel id="demo-simple-select-label">
                        Payment Method
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={values.payment_method_id}
                        name="membership[payment_method_id]"
                        onChange={(e: any) => {
                          const payment_method_id = e.target.value;
                          const payment_method = payment_methods.data.find(
                            (p) => p.payment_method_id == payment_method_id
                          );

                          handleChange("payment_method_id")(payment_method_id);
                          setPaymentMethod(payment_method);
                        }}
                        onBlur={handleBlur("payment_method_id")}
                        error={!!errors.payment_method_id}
                        label="Payment Method"
                      >
                        {payment_methods.data.map((p) => (
                          <MenuItem key={p.id} value={p.id}>
                            {p.card.brand} ****{p.card.last4}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {errors.payment_method_id &&
                          touched.payment_method_id &&
                          errors.payment_method_id}
                      </FormHelperText>
                    </FormControl>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="quantity"
                    name="membership[quantity]"
                    label="Quantity"
                    required
                    fullWidth
                    variant="outlined"
                    value={values.quantity}
                    type="number"
                    onChange={(e: any) =>
                      handleChange("quantity")(e.target.value)
                    }
                    onBlur={handleBlur("quantity")}
                    error={!!errors.quantity}
                    helperText={
                      errors.quantity && touched.quantity && errors.quantity
                    }
                    inputProps={{ inputMode: "numeric" }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel id="demo-simple-select-label">
                      Tax Rate
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={values.stripe_tax_rate_id}
                      name="membership[stripe_tax_rate_id]"
                      onChange={(e: any) => {
                        const stripe_tax_rate_id = e.target.value;
                        const tax_rate = tax_rates.find(
                          (tr) => tr.stripe_metadata.id == stripe_tax_rate_id
                        );
                        console.log(tax_rate);
                        handleChange("stripe_tax_rate_id")(stripe_tax_rate_id);
                        setTaxRate(tax_rate);
                      }}
                      onBlur={handleBlur("stripe_tax_rate_id")}
                      error={!!errors.stripe_tax_rate_id}
                      label="Tax Rate"
                    >
                      {tax_rates.map((tr) => (
                        <MenuItem
                          key={tr.stripe_metadata.id}
                          value={tr.stripe_metadata.id}
                        >
                          {tr.display_name} ({tr.percentage}%)(
                          {tr.inclusive ? "Inc" : "Exc"})
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors.stripe_tax_rate_id &&
                        touched.stripe_tax_rate_id &&
                        errors.stripe_tax_rate_id}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="demo-simple-select-label">
                      Coupon
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={values.stripe_coupon_id}
                      name="membership[stripe_coupon_id]"
                      onChange={(e: any) => {
                        const stripe_coupon_id = e.target.value;
                        const coupon = coupons.find(
                          (c) => c.stripe_metadata.id == stripe_coupon_id
                        );
                        handleChange("stripe_coupon_id")(stripe_coupon_id);
                        if (coupon) {
                          setCoupon(coupon);
                        } else {
                          setCoupon({});
                        }
                      }}
                      onBlur={handleBlur("stripe_coupon_id")}
                      error={!!errors.stripe_coupon_id}
                      label="Coupon"
                    >
                      <MenuItem value={""}>
                        <em>None</em>
                      </MenuItem>
                      {coupons.map((c) => (
                        <MenuItem
                          key={c.stripe_metadata.id}
                          value={c.stripe_metadata.id}
                        >
                          {c.name} (
                          {c.percent_off
                            ? `${c.percent_off}%`
                            : `$${c.amount_off / 100}`}{" "}
                          off )
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors.stripe_tax_rate_id &&
                        touched.stripe_tax_rate_id &&
                        errors.stripe_tax_rate_id}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="date"
                    label="Trial End Date"
                    type="date"
                    defaultValue=""
                    onChange={handleChange("trial_end")}
                    onBlur={handleBlur("trial_end")}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="date"
                    label="Auto Cancel At"
                    type="date"
                    defaultValue=""
                    onChange={handleChange("cancel_at")}
                    onBlur={handleBlur("cancel_at")}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
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
