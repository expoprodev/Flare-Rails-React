import React, { useState, ChangeEvent } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Card,
  CardContent,
  CardActions,
  TablePagination,
  makeStyles,
  Button,
  ThemeProvider,
} from "@material-ui/core";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import clsx from "clsx";
import { theme } from "../../theme";
import Hero from "../../ui/hero";
const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  content: {
    padding: 0,
  },
  inner: {
    minWidth: 1050,
  },
  nameContainer: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  actions: {
    justifyContent: "flex-end",
  },
  paper: {
    borderRadius: "4px",
    alignItems: "center",
    padding: theme.spacing(1),
    display: "flex",
    flexBasis: 420,
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  input: {
    flexGrow: 1,
    fontSize: "14px",
    lineHeight: "16px",
    letterSpacing: "-0.05px",
  },
  row: {
    height: "42px",
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(1),
  },
  spacer: {
    flexGrow: 1,
  },
  importButton: {
    marginRight: theme.spacing(1),
  },
  exportButton: {
    marginRight: theme.spacing(1),
  },
  searchInput: {
    marginRight: theme.spacing(1),
  },
}));
function ListGuests({ className, guests }) {
  const classes = useStyles();

  const navigate = (url: string) => {
    window.location.href = url;
  };

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      {!guests.length ? (
        <Hero
          title="No Guests"
          subtitle="No one has reported any requests."
          icon={<EmojiPeopleIcon fontSize="large" color="primary" />}
        />
      ) : (
        <Card className={clsx(classes.root, className)}>
          <CardContent className={classes.content}>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Phone</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right"># Reported</TableCell>
                    <TableCell align="right">Last Reported</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? guests.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : guests
                  ).map((guest) => (
                    <TableRow key={guest.id}>
                      <TableCell component="th" scope="row">
                        {guest.phone}
                      </TableCell>
                      <TableCell>{guest?.name}</TableCell>
                      <TableCell align="right">{guest.count}</TableCell>
                      <TableCell align="right">{guest.last_reported}</TableCell>
                    </TableRow>
                  ))}

                  {guests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3}>No Guests</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardActions className={classes.actions}>
            <TablePagination
              component="div"
              count={guests.length}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </CardActions>
        </Card>
      )}
    </ThemeProvider>
  );
}

export default ListGuests;
