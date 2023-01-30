import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  ThemeProvider,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  CardActions,
  makeStyles,
  Chip,
} from "@material-ui/core";
import { theme } from "../../theme";
import clsx from "clsx";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-prevent-tabpanel-${index}`}
      aria-labelledby={`scrollable-prevent-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const navigate = (url: string) => {
  window.location.href = url;
};

function a11yProps(index: any) {
  return {
    id: `scrollable-prevent-tab-${index}`,
    "aria-controls": `scrollable-prevent-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  content: {
    padding: 0,
  },
  inner: {},
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

export default function ListRequests({
  incidents_open,
  incidents_progress,
  incidents_closed,
  className,
}) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  return (
    <ThemeProvider theme={theme}>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Open" />
        <Tab label="In Progress" />
        <Tab label="Closed" {...a11yProps(2)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Card className={clsx(classes.root, className)}>
          <CardContent className={classes.content}>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Label</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell align="right">Reported</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? incidents_open.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : incidents_open
                  ).map((incident) => (
                    <TableRow
                      key={incident.id}
                      onClick={() =>
                        navigate(
                          `/codes/${incident.code_id}/incidents/${incident.id}/edit`
                        )
                      }
                    >
                      <TableCell component="th" scope="row">
                        {incident.code_label}
                      </TableCell>
                      <TableCell>{incident.notes}</TableCell>
                      <TableCell>{incident.display_status}</TableCell>
                      <TableCell>
                        {incident.tags.map((t) => (
                          <Chip label={t} />
                        ))}
                      </TableCell>
                      <TableCell>{incident.reported_at}</TableCell>
                    </TableRow>
                  ))}

                  {incidents_open.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>No Open Requests</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardActions className={classes.actions}>
            <TablePagination
              component="div"
              count={incidents_open.length}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </CardActions>
        </Card>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Card className={clsx(classes.root, className)}>
          <CardContent className={classes.content}>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Label</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell align="right">Reported</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? incidents_progress.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : incidents_progress
                  ).map((incident) => (
                    <TableRow
                      key={incident.id}
                      onClick={() =>
                        navigate(
                          `/codes/${incident.code_id}/incidents/${incident.id}/edit`
                        )
                      }
                    >
                      <TableCell component="th" scope="row">
                        {incident.code_label}
                      </TableCell>
                      <TableCell>{incident.notes}</TableCell>
                      <TableCell>{incident.display_status}</TableCell>
                      <TableCell>
                        {incident.tags.map((t) => (
                          <Chip label={t} />
                        ))}
                      </TableCell>
                      <TableCell>{incident.reported_at}</TableCell>
                    </TableRow>
                  ))}

                  {incidents_progress.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>No Open Requests</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardActions className={classes.actions}>
            <TablePagination
              component="div"
              count={incidents_progress.length}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </CardActions>
        </Card>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Card className={clsx(classes.root, className)}>
          <CardContent className={classes.content}>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Label</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell align="right">Reported</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? incidents_closed.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : incidents_closed
                  ).map((incident) => (
                    <TableRow
                      key={incident.id}
                      onClick={() =>
                        navigate(
                          `/codes/${incident.code_id}/incidents/${incident.id}/edit`
                        )
                      }
                    >
                      <TableCell component="th" scope="row">
                        {incident.code_label}
                      </TableCell>
                      <TableCell>{incident.notes}</TableCell>
                      <TableCell>{incident.display_status}</TableCell>
                      <TableCell>
                        {incident.tags.map((t) => (
                          <Chip label={t} />
                        ))}
                      </TableCell>
                      <TableCell>{incident.reported_at}</TableCell>
                    </TableRow>
                  ))}

                  {incidents_closed.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>No Open Requests</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardActions className={classes.actions}>
            <TablePagination
              component="div"
              count={incidents_closed.length}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </CardActions>
        </Card>
      </TabPanel>
    </ThemeProvider>
  );
}
