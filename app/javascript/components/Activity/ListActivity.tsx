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
  CardHeader,
} from "@material-ui/core";
import NotesIcon from "@material-ui/icons/Notes";
import clsx from "clsx";
import { theme } from "../../theme";
import Hero from "../../ui/hero";
import dayjs from "dayjs";
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
function ListActivity({ className, incidents }) {
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
      {!incidents.length ? (
        <Hero
          title="No Activity"
          subtitle="No activity to show, check back later."
          icon={<NotesIcon fontSize="large" color="primary" />}
        />
      ) : (
        <Card className={clsx(classes.root, className)}>
          <CardHeader title="Requests" />
          <CardContent className={classes.content}>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? incidents.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : incidents
                  ).map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell component="th" scope="row">
                        {dayjs(incident.created_at).format("M/D/YY h:mm a")}
                      </TableCell>
                      <TableCell>{incident.message}</TableCell>
                      <TableCell>{incident.notes}</TableCell>
                    </TableRow>
                  ))}

                  {incidents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3}>No Activity</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardActions className={classes.actions}>
            <TablePagination
              component="div"
              count={incidents.length}
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

export default ListActivity;
