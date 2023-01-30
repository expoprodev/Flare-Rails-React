import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
} from "@material-ui/core";

export default function SimpleDialog({
  open = false,
  close,
  title = "",
  onSubmit,
  actionButtonText = "",
  children,
}) {
  return (
    <Dialog
      open={open}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary" size="large">
          Close
        </Button>
        <Button onClick={onSubmit} color="secondary" autoFocus size="large">
          {actionButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
