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
import MessageIcon from "@material-ui/icons/Message";
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
function ListMessages({ className, messages }) {
  const classes = useStyles();

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
      {!messages.length ? (
        <Hero
          title="No messages"
          subtitle="You have not recieved any messages."
          icon={<MessageIcon color="primary" fontSize="large" />}
        />
      ) : (
        <Card className={clsx(classes.root, className)}>
          <CardContent className={classes.content}>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell align="right">From</TableCell>
                    <TableCell align="right">Message</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? messages.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : messages
                  ).map((message) => (
                    <TableRow key={message.id} hover>
                      <TableCell component="th" scope="row">
                        {message.created_at}
                      </TableCell>
                      <TableCell align="right">{message.from}</TableCell>
                      <TableCell align="right">{message.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardActions className={classes.actions}>
            <TablePagination
              component="div"
              count={messages.length}
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

export default ListMessages;
