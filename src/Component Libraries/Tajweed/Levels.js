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
import { handleDeleteLevel } from '../../actions/tajweed';

function TajweedLevels({ levels }) {

    let [searchLevel, setSerachLevel] = useState('');
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

    const columnsLevel = [
        { id: 'ID', label: 'ID', minWidth: 100 },
        { id: 'name', label: 'Name', minWidth: 170 },
        {
          id: 'level',
          label: 'Level color',
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

    function createData(ID, name, level, actions) {
        return { ID, name, level, actions };
    }

    const rowsLevel = Object.values(levels).filter((level) => 
      level.name.includes(searchLevel))
    .map((level, ind) => createData(
      ind + 1 , level.name, 
      <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
        <circle r="20" cx="40" cy="40" fill={level.color} />
      </svg>,
      <Stack
            id={`levels-action-container-${level.id}`}
            sx={{ width: 120 }}
        >
        <Button
            id={`levels-action-button-${level.id}`}
            aria-controls={open ? 'edited-positioned-menu' : undefined}
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
                id="levels-positioned-menu"
                aria-labelledby="levels-positioned-button"
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
                            navigate(`../tajweed/edit-level/${level.id}`)
                            handleClickOpen()
                        }}
                        id={`${level.id}-edit-button`}>
                        Edit
                    </Typography>
                </MenuItem>
                <MenuItem>
                <React.Fragment>
                    <Typography
                        sx={{
                            color: 'red'
                        }}
                        color="text.primary"
                        fontWeight="bolder"
                        onClick={handleClickOpen}
                        id={`${level.id}-delete-button`}>
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
                        <DialogContentText id={`alert-dialog-${level.id}`}>
                            Are you sure?
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={() => {
                            dispatch(handleDeleteLevel(level.id))
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
                    mb: 1
                }}
            >
                <TextField
                    id="level-search"
                    label="search"
                    name="search"
                    autoComplete="search-feild"
                    onChange={(e) => setSerachLevel(e.target.value)}
                    sx={{
                        mr: 1
                    }}
                />
                <Button
                    variant='contained'
                    onClick={() => navigate('../tajweed/level')}
                >
                    Add Level
                </Button>
            </Grid>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                        {columnsLevel.map((column) => (
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
                        {rowsLevel
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                            return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.ID}>
                                {columnsLevel.map((column) => {
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
                    count={rowsLevel.length}
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
        levels: tajweed !== null ? tajweed.levels : {},
    }
}

export default connect(mapStateToProps)(TajweedLevels)