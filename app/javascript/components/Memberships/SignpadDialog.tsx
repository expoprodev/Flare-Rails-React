import React, { useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import SignatureCanvas from "react-signature-canvas";

import styled from "styled-components";
import { Button } from "@chakra-ui/react";

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
  text-align: center;
  font-weight: 700;
  font-size: 24px;
`;

export default function SignpadDialog({
  open = false,
  close,
  onSave,
  confirmDetails,
}) {
  const pad = useRef(null);

  const handleClear = () => {
    // `current` points to the mounted text input element
    pad.current.clear();
  };

  const handleSave = () => {
    // `current` points to the mounted text input element
    onSave(pad.current.toDataURL("image/jpg"));
    console.log(pad.current.toDataURL("image/jpg"));
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
        <Header2>
          Everything accurate? <br />
          If so, sign the membership contract below!
        </Header2>
        <CloseButton onClick={close}>
          <CloseIcon />
        </CloseButton>
      </DialogTitleStyled>
      <DialogContent>
        <Details>
          <div>
            <div>
              <Bold>Name:</Bold> {confirmDetails.name}
            </div>
            <div>
              <Bold>Email:</Bold> {confirmDetails.email}
            </div>
            <div>
              <Bold>Phone:</Bold> {confirmDetails.phone}
            </div>
          </div>
          <div>
            <div>
              <Bold>Additional Members:</Bold>{" "}
              {confirmDetails.additionalMembers}
            </div>

            <div>
              <Bold>Charged today:</Bold> ${confirmDetails.total}
            </div>
            <div>
              <Bold>Recurring:</Bold> ${confirmDetails.recurring} every{" "}
              {confirmDetails.interval}
            </div>
          </div>
          <div></div>
        </Details>
        <SignaturePadContainer>
          <SignatureCanvas
            ref={pad}
            penColor="black"
            canvasProps={{
              width: 940,
              height: 400,
              className: "sigCanvas",
            }}
          />
        </SignaturePadContainer>
        <DialogContentText id="alert-dialog-description">
          By signing above, I agree to the recurring charge listed above to my
          credit card provided. I agree that I will pay in accordance with the
          issuing bank cardholder agreement. This contract and the recurring
          memberships can be cancelled by email (Cidercade@bishopcider.com) or
          by text (214-364-7728). Upon cancellation, the memberships and
          corresponding benefits will expire 30 days after the last renewal, but
          no additional charges will be made.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} colorScheme="purple" size="lg">
          Join!
        </Button>
      </DialogActions>
    </Dialog>
  );
}
