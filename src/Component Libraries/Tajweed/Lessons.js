import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Stack } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { handleDeleteLesson } from '../../actions/tajweed';

function TajweedLessons({ lessons }) {

    let [searchLesson, setSearchLesson] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    const [confirm, setConfirm] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const dispatch = useDispatch();

    const handleClickOpen = () => {
        setConfirm(true);
    };

    const handleConfirm = () => {
        setConfirm(false);
        setAnchorEl(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const navigate = useNavigate();

    const columnsLesson = [
        { id: 'ID', label: 'ID', minWidth: 100 },
        { id: 'title', label: 'Title', minWidth: 170 },
        {
          id: 'level',
          label: 'Level',
          minWidth: 170,
          align: 'right',
        },
        {
          id: 'actions',
          label: 'Actions',
          minWidth: 170,
          align: 'right',
        },
    ];

    function createData(ID, title, level, actions) {
        return { ID, title, level, actions };
    }

    const rowsLesson = Object.values(lessons).filter((lesson) => 
        lesson.title.includes(searchLesson))
      .map((lesson, ind) => createData(
        ind + 1 , lesson.title, 
        lesson.level,
        <Stack
              id={`lessons-action-container-${lesson.id}`}
              sx={{ width: 120 }}
          >
          <Button
              id={`lessons-action-button-${lesson.id}`}
              aria-controls={open ? 'lessons-positioned-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              color="primary"
              variant="contained"
              size="small"
              fullWidth
          >
              Actions
          </Button>
          <Menu
                  id="lessons-positioned-menu"
                  aria-labelledby="lessons-positioned-button"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                  }}
                  transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                  }}
                  sx={{
                      px: 2
                  }}
              >
                <MenuItem>
                    <Typography
                        color="text.primary"
                        fontWeight="bolder"
                        onClick={() => {
                            navigate(`../tajweed/edit-lesson/${lesson.id}`)
                            handleClickOpen()
                        }}
                        id={`${lesson.id}-edit-button`}>
                        Edit Lesson
                    </Typography>
                </MenuItem>
                  <MenuItem>
                  <React.Fragment>
                      <Typography
                          color="text.primary"
                          fontWeight="bolder"
                          sx={{
                              color: 'red'
                          }}
                          onClick={handleClickOpen}
                          id={`${lesson.id}-delete-button`}>
                          Delete
                      </Typography>
                      <Dialog
                          open={confirm}
                          TransitionComponent={Transition}
                          keepMounted
                          onClose={handleConfirm}
                          aria-describedby="alert-dialog-slide-description"
                      >
                          <DialogTitle>{"Delete"}</DialogTitle>
                          <DialogContent>
                          <DialogContentText id={`alert-dialog-${lesson.id}`}>
                              Are you sure?
                          </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                          <Button onClick={() => {
                              dispatch(handleDeleteLesson(lesson.id))
                              handleConfirm()
                          }}>Yes</Button>
                          <Button onClick={handleConfirm}>No</Button>
                          </DialogActions>
                      </Dialog>
                      </React.Fragment>
                  </MenuItem>
              </Menu>
        </Stack>
      ))

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Container
            sx={{
                pt: 12,
                px: 1,
            }}>
            <Grid
                item
                sx={{
                    mb: 1,
                    mt: 1
                }}
            >
                <TextField
                    id="lesson-search"
                    label="search"
                    name="search"
                    autoComplete="search-feild"
                    onChange={(e) => setSearchLesson(e.target.value)}
                    sx={{
                        mr: 1
                    }}
                />
                <Button
                    variant='contained'
                    onClick={() => navigate('../tajweed/lesson')}
                >
                    Add Lesson
                </Button>
            </Grid>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                        {columnsLesson.map((column) => (
                            <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                            >
                            {column.label}
                            </TableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rowsLesson
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                            return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.ID}>
                                {columnsLesson.map((column) => {
                                const value = row[column.id];
                                return (
                                    <TableCell key={column.id} align={column.align}>
                                    {column.format && typeof value === 'number'
                                        ? column.format(value)
                                        : value}
                                    </TableCell>
                                );
                                })}
                            </TableRow>
                            );
                        })}
                    </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rowsLesson.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Container>
    )
}

function mapStateToProps({ tajweed }) {
    return {
        lessons: tajweed !== null ? tajweed.lessons : {}
    }
}

export default connect(mapStateToProps)(TajweedLessons)