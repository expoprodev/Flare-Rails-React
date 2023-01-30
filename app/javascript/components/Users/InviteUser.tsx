import { InfoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { Formik } from "formik";
import React from "react";
import { GiRoundStar } from "react-icons/gi";
import { useNavigate, useParams } from "react-router-dom";
import { CapSelect } from "../../ui/form";

interface Errors {
  name?: string;
  email?: string;
  pin?: string;
}

function InviteUser() {
  const user = {
    id: "",
    name: "",
    email: "",
    pin: "",
    role: "admin",
  };
  const { id } = useParams();

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const processSubmit = async (values, setSubmitting) => {
    try {
      await axios.post(`/invite`, {
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

  return (
    <>
      <Formik
        initialValues={{ ...user }}
        isInitialValid={false}
        validate={(values) => {
          const errors: Errors = {};
          if (!values.name) {
            errors.name = "A name required";
          }
          if (!values.email) {
            errors.email = "A email required";
          }
          if (!values.pin) {
            errors.pin = "A pin required";
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
              <FormLabel>
                What permissions should this user have?
                <InfoIcon onClick={onOpen} />
              </FormLabel>
              <CapSelect
                isRequired
                onChange={handleChange("role")}
                value={values.role}
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
                <option value="cashier">Cashier</option>
              </CapSelect>
              <FormHelperText>
                Please refer to the roles and permissions matrix.
              </FormHelperText>
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
          </form>
        )}
      </Formik>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="fl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Roles and Permissions Matrix</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RolesMatrix />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function RolesMatrix() {
  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>Roles and Permissions Matrix</TableCaption>
        <Thead>
          <Tr>
            <Th>Permission</Th>
            <Th>Admin</Th>
            <Th>Editor</Th>
            <Th>Viewer</Th>
            <Th>Cashier</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Manage Company Settings</Td>
            <Td>
              <GiRoundStar />
            </Td>

            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
          </Tr>
          <Tr>
            <Td>Manage Billing</Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
          </Tr>
          <Tr>
            <Td>Manage Reports</Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
          </Tr>
          <Tr>
            <Td>Manage Responses</Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
          </Tr>
          <Tr>
            <Td>Manage Codes</Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
          </Tr>
          <Tr>
            <Td>Manage Users</Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
          </Tr>
          <Tr>
            <Td>Manage Members</Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
          </Tr>
          <Tr>
            <Td>Manage Coupons</Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
          </Tr>
          <Tr>
            <Td>Manage Plans</Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
          </Tr>
          <Tr>
            <Td>Manage Readers</Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
          </Tr>
          <Tr>
            <Td>Manage Tax Rates</Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
          </Tr>
          <Tr>
            <Td>Manage Locations</Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
          </Tr>
          <Tr>
            <Td>View Analytics</Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
          </Tr>
          <Tr>
            <Td>View Codes</Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
          </Tr>
          <Tr>
            <Td>View Users</Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
          </Tr>
          <Tr>
            <Td>View Members</Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
          </Tr>
          <Tr>
            <Td>View Coupons</Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
          </Tr>
          <Tr>
            <Td>View Plans</Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
          </Tr>
          <Tr>
            <Td>View Readers</Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
          </Tr>
          <Tr>
            <Td>View Tax Rates</Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
          </Tr>
          <Tr>
            <Td>View Activity</Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
          </Tr>
          <Tr>
            <Td>Log Incidents</Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
            <Td>
              <GiRoundStar />
            </Td>
          </Tr>
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>Permission</Th>
            <Th>Admin</Th>
            <Th>Editor</Th>
            <Th>Viewer</Th>
            <Th>Cashier</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
}

export default InviteUser;
