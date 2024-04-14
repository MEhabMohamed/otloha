import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import Student from "../Component Libraries/Student/Student";
import { Button, Grid, Input, Paper, TextField, Typography } from "@mui/material";
import PaginationLink from "../Component Libraries/Pagination/Pagination";
import DataBlock from "../Component Libraries/DataBlock/DataBlock";
import contacts from '../Resources/contacts.png';
import accept from '../Resources/accept.png';
import reject from '../Resources/reject.png';
import $ from "jquery";
import { handleAddBlock } from "../actions/user";

function StudentDashboard ({ users , authedUser , students }) {

    let [search, setSearch] = useState('');
    let [check, setCheck] = useState(false);
    let [userCheck, setUserCheck] = useState(false);
    let [currentPage, setCurrentPage] = useState(1);
    let lastIndex = currentPage * 10;
    let firstIndex = lastIndex - 10;

    let dispatch = useDispatch();

    const handleCheck = () => {
        if (check === false) {
            setCheck(true)
            setUserCheck(true)
            students
            .filter((student) => !users[authedUser].blockList.includes(student.id))
            .filter(({id}) => id !== authedUser)
            .map(({id}) => $(`#choose-student-${id}`).prop("checked", true))
        } else {
            setCheck(false)
            setUserCheck(false)
            students
            .filter((student) => !users[authedUser].blockList.includes(student.id))
            .filter(({id}) => id !== authedUser)
            .map(({id}) => $(`#choose-student-${id}`).prop("checked", false))
        }
    }

    function filteredStudent() {
        return {
            student: students.filter((student) => !users[authedUser].blockList.includes(student.id))
            .filter((student) => search !== "" ? 
            (student.email.includes(search) || student.name.toLowerCase().includes(search))
            : student),
            checked: students.filter((student) => !users[authedUser].blockList.includes(student.id))
            .filter((student) => search !== "" ? 
            (student.email.includes(search) || student.name.toLowerCase().includes(search))
            : student)
            .slice(firstIndex, lastIndex)
            .filter(({id}) => document.querySelector(`#choose-student-${id}`) !== null ? document.querySelector(`#choose-student-${id}`).checked === true : !id)
        }
    }

    return (
        <Grid container id="former-user-container" sx={{ pt: 12, px: 1}} spacing={1}>
            <Grid item container spacing={1} md={12}>
                <DataBlock size={4} pic={contacts} text="All students" counter={students.length}/>
                <DataBlock size={4} pic={accept} text="Active" counter={students.filter(({active}) => active).length}/>
                <DataBlock size={4} pic={reject} text="Blocked" counter={students.filter(({active}) => !active).length}/>
            </Grid>
            <Grid item container spacing={1} id="users-container" xs={12} sm={9} direction="column">
                <Paper
                    sx={{
                        height:60,
                        pt: 1,
                        px: 1,
                        width: "100%",
                        mt: 1,
                        ml: 1,
                    }}>
                    <Grid item container gap={1}>
                        <Grid item xs={0.25} sm={0.25} md={0.25} sx={{
                        textAlign: "center",
                        }}>
                            <Input
                                id="bulk-student-selector"
                                type="checkbox"
                                disableUnderline
                                onChange={handleCheck}
                                value={check}
                                />
                        </Grid>
                        <Grid item sm={5.6}>
                            <TextField
                            id="student-search"
                            label="search"
                            name="search"
                            fullWidth
                            autoComplete="search-feild"
                            onChange={(e) => setSearch(e.target.value)}
                            />
                        </Grid>
                        <Button
                        variant="contained"
                        type="submit"
                        size="medium"
                        onClick={() => {
                            setSearch('');
                            $("#student-search").val('')
                        }}
                            >
                            Reset
                        </Button>
                        {((document.querySelector("#bulk-student-selector") !== null) && (filteredStudent().student.filter(({id}) => authedUser !== id).length > 0)) && (((document.querySelector("#bulk-student-selector").checked === true) || userCheck === true) && (
                            <Typography variant="body2" color="text.secondary">
                            {filteredStudent().checked.length} Selected
                        </Typography>))}
                        <Button
                            variant="contained"
                            type="submit"
                            size="medium"
                            onClick={() => {
                                filteredStudent().checked
                                .map(({id}) => dispatch(handleAddBlock(id, authedUser)));
                                $("#bulk-student-selector").prop("checked", false);
                                setCheck(false);
                                setUserCheck(false);
                            }}
                        >
                            Block Selected
                        </Button>
                    </Grid>
                </Paper>
                {filteredStudent().student
                .map(({id}) => (
                    <Grid key={id} id={`${id}-li`} item mb={1}>
                        <Student id={id} setter={setUserCheck} setValue={userCheck} type="student"/>
                    </Grid>
                )).slice(firstIndex, lastIndex)}
                <Grid item>
                <PaginationLink
                        showing={Math.ceil(filteredStudent().student.length/10)}
                        pageSet={setCurrentPage}
                        firstIndex={firstIndex}
                        lastIndex={lastIndex}
                        total={filteredStudent().student.filter((student) => !users[authedUser].blockList.includes(student.id)).length}
                        />
                </Grid>
            </Grid>
        </Grid>
    )
};

function mapStateToProps ({ users , authedUser }) {
    let userStudents = Object.values(users);
    let students = userStudents.length > 1 ? userStudents.filter(({description}) => description === 'student')
    .sort((a, b) => b.joiningDate - a.joiningDate) : ['']
    return {
        students,
        authedUser: authedUser !== null ? authedUser[0] : null,
        users
    }
};

export default connect(mapStateToProps)(StudentDashboard)