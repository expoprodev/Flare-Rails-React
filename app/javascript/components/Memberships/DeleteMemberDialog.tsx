import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
} from "@material-ui/core";

export default function DeleteMemberDialog({
  open = false,
  close,
  cancelMembership,
}) {
  return (
    <Dialog
      open={open}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete Member</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Deleting a Member will cancel the subscription for this member and
          hide them from the member list. This will not prorate subscriptions.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary" size="large">
          Close
        </Button>
        <Button
          onClick={cancelMembership}
          color="secondary"
          autoFocus
          size="large"
        >
          Delete Membership
        </Button>
      </DialogActions>
    </Dialog>
  );
}
