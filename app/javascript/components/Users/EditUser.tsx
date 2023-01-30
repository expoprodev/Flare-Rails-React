import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  useToast,
  FormErrorMessage,
  Heading,
  Divider,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { Loading } from "../../ui/Loading";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { CapSelect } from "../../ui/form";

interface Errors {
  name?: string;
}

function EditUser() {
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    pin: "",
    timezone: "",
    email_notifications: false,
    push_notifications: false,
  });
  const [me, setMe] = useState({ id: "" });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchUser = async () => {
    const res = await axios.get(`/users/${id}.json`);
    const meRes = await axios.get(`/me.json`);

    setMe(meRes.data);
    setUser(res.data);

    console.log(res.data);
    setLoading(false);
  };

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchUser();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(true);
  };

  const handleDelete = async () => {
    await axios.delete(`/users/${user.id}.json`);
    setOpen(false);
    navigate("/users");
  };

  const processSubmit = async (values, setSubmitting) => {
    try {
      await axios.patch(`/users/${id}.json`, {
        user: {
          ...values,
        },
      });
      navigate("/users");
    } catch (err) {
      console.log(err);

      toast({
        title: "An error occurred.",
        description: err.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setSubmitting(false);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <>
      <Formik
        initialValues={{ ...user }}
        isInitialValid={false}
        validate={(values) => {
          const errors: Errors = {};
          if (!values.name) {
            errors.name = "A name required";
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          processSubmit(values, setSubmitting);
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
            <Heading size="md" mb={8}>
              Edit User
            </Heading>

            <FormControl
              variant="floating"
              id="name"
              isRequired
              isInvalid={!!errors.name}
              mb={8}
            >
              <Input
                placeholder=" "
                value={values.name}
                errorBorderColor="red.500"
                onBlur={handleBlur("name")}
                onChange={(e) => handleChange("name")(e.target.value)}
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel>Name</FormLabel>
              <FormHelperText>Enter a name for the user.</FormHelperText>
              {!!errors.name && (
                <FormErrorMessage>
                  {errors.name && touched.name && errors.name}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl
              variant="floating"
              id="email"
              isRequired
              isInvalid={!!errors.email}
              mb={8}
            >
              <Input
                placeholder=" "
                value={values.email}
                errorBorderColor="red.500"
                onBlur={handleBlur("email")}
                onChange={(e) => handleChange("email")(e.target.value)}
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel>Email</FormLabel>
              <FormHelperText>Enter a email for the user.</FormHelperText>
              {!!errors.email && (
                <FormErrorMessage>
                  {errors.email && touched.email && errors.email}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl
              variant="floating"
              id="pin"
              isRequired
              isInvalid={!!errors.pin}
              mb={8}
            >
              <Input
                placeholder=" "
                value={values.pin}
                errorBorderColor="red.500"
                onBlur={handleBlur("pin")}
                onChange={(e) => handleChange("pin")(e.target.value)}
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel>Pin</FormLabel>
              <FormHelperText>
                Enter a pin for the user. This is the pin the user will enter to
                switch to their account.
              </FormHelperText>
              {!!errors.pin && (
                <FormErrorMessage>
                  {errors.pin && touched.pin && errors.pin}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl mb={8}>
              <FormLabel>Timezone preference</FormLabel>
              <CapSelect
                isRequired
                onChange={handleChange("timezone")}
                value={values.timezone}
              >
                <option value="America/New_York">America/new york</option>
                <option value="America/Detroit">America/detroit</option>
                <option value="America/Kentucky/Louisville">
                  America/kentucky/louisville
                </option>
                <option value="America/Kentucky/Monticello">
                  America/kentucky/monticello
                </option>
                <option value="America/Indiana/Indianapolis">
                  America/indiana/indianapolis
                </option>
                <option value="America/Indiana/Vincennes">
                  America/indiana/vincennes
                </option>
                <option value="America/Indiana/Winamac">
                  America/indiana/winamac
                </option>
                <option value="America/Indiana/Marengo">
                  America/indiana/marengo
                </option>
                <option value="America/Indiana/Petersburg">
                  America/indiana/petersburg
                </option>
                <option value="America/Indiana/Vevay">
                  America/indiana/vevay
                </option>
                <option selected value="America/Chicago">
                  America/chicago
                </option>
                <option value="America/Indiana/Tell_City">
                  America/indiana/tell city
                </option>
                <option value="America/Indiana/Knox">
                  America/indiana/knox
                </option>
                <option value="America/Menominee">America/menominee</option>
                <option value="America/North_Dakota/Center">
                  America/north dakota/center
                </option>
                <option value="America/North_Dakota/New_Salem">
                  America/north dakota/new salem
                </option>
                <option value="America/North_Dakota/Beulah">
                  America/north dakota/beulah
                </option>
                <option value="America/Denver">America/denver</option>
                <option value="America/Boise">America/boise</option>
                <option value="America/Phoenix">America/phoenix</option>
                <option value="America/Los_Angeles">America/los angeles</option>
                <option value="America/Anchorage">America/anchorage</option>
                <option value="America/Juneau">America/juneau</option>
                <option value="America/Sitka">America/sitka</option>
                <option value="America/Metlakatla">America/metlakatla</option>
                <option value="America/Yakutat">America/yakutat</option>
                <option value="America/Nome">America/nome</option>
                <option value="America/Adak">America/adak</option>
                <option value="Pacific/Honolulu">Pacific/honolulu</option>
              </CapSelect>
              <FormHelperText>
                Times will be displayed relative to this timezone.
              </FormHelperText>
            </FormControl>

            <FormControl mb={8}>
              <FormLabel>Enable email notifications.</FormLabel>
              <Checkbox
                isChecked={values.email_notifications}
                onChange={handleChange("email_notifications")}
                onBlur={handleBlur("email_notifications")}
                value={`${values.email_notifications}`}
              >
                Enable
              </Checkbox>
              <FormHelperText></FormHelperText>
            </FormControl>

            <FormControl mb={8}>
              <FormLabel>Enable push notifications.</FormLabel>
              <Checkbox
                isChecked={values.push_notifications}
                onChange={handleChange("push_notifications")}
                onBlur={handleBlur("push_notifications")}
                value={`${values.push_notifications}`}
              >
                Enable
              </Checkbox>
              <FormHelperText></FormHelperText>
            </FormControl>

            <Box mt={8}>
              <Button onClick={() => navigate("/users")} mr={4}>
                Back
              </Button>

              <Button
                type="submit"
                colorScheme="purple"
                isLoading={isSubmitting}
                disabled={isSubmitting || !isValid}
              >
                Submit
              </Button>
            </Box>
            {user.id !== me.id && (
              <>
                <Divider my={8} />
                <Heading mb="4" size="md">
                  Danger Area
                </Heading>
                <Box mr={2}>
                  <Button colorScheme="red" onClick={handleConfirm}>
                    Delete
                  </Button>
                </Box>
              </>
            )}
          </form>
        )}
      </Formik>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will archive the user and remove it from your users.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} colorScheme="red">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditUser;
