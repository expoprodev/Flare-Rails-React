import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import styled from "styled-components";

const SignaturePadContainer = styled.div`
  border: 2px solid #ccc;
`;
const Details = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;
const Bold = styled.span`
  font-weight: 700;
`;
const CloseButton = styled(IconButton)``;
const DialogTitleStyled = styled(DialogTitle)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Header2 = styled.div`
text-align:center;
font-weight:700;
font-size: 24px;
`;

export default function ReceiptDialog({ open = false, close, subscription }) {
  const handleSave = () => {
    close();
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullScreen
    >
      <DialogTitleStyled id="alert-dialog-title" disableTypography>
        <div></div>
        <Header2>Everything accurate? <br />If so, sign the membership contract below!</Header2>
        <CloseButton onClick={close}>
          <CloseIcon />
        </CloseButton>
      </DialogTitleStyled>
      <DialogContent>
        <Details>
          <div>
            <div>
              <Bold>Name:</Bold> {subscription.name} {subscription.last_name}
            </div>
            <div>
              <Bold>Email:</Bold> {subscription.email}
            </div>
            <div>
              <Bold>Phone:</Bold> {subscription.phone}
            </div>
          </div>
          <div>
            <div>
              <Bold>Additional Members:</Bold> {subscription.additionalMembers}
            </div>

            <div>
              <Bold>Recurring:</Bold> ${subscription.recurring} every{" "}
              {subscription.interval}
            </div>
          </div>
          <div></div>
        </Details>
        <SignaturePadContainer>
          <img src={subscription.signature} />
        </SignaturePadContainer>
        <DialogContentText id="alert-dialog-description">
          By signing above, I agree to the recurring charge listed above to my
          credit card provided. I agree that I will pay in accordance with the
          issuing bank cardholder agreement. This contract and the recurring
          memberships can be cancelled by email (Cidercade@bishopcider.com)
          or by text (214-364-7728). Upon cancellation, the memberships and
          corresponding benefits will expire 30 days after the last renewal,
          but no additional charges will be made.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} color="primary" autoFocus size="large">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
