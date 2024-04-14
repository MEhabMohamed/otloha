import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Button, Grid, Input, Paper, TextField, Typography } from "@mui/material";
import Teacher from "../Component Libraries/Teacher/Teacher"
import PaginationLink from "../Component Libraries/Pagination/Pagination";
import DataBlock from "../Component Libraries/DataBlock/DataBlock";
import contacts from '../Resources/contacts.png';
import accept from '../Resources/accept.png';
import reject from '../Resources/reject.png';
import waiting from '../Resources/waiting.png';
import heart from '../Resources/heart.png';
import earning from '../Resources/earning.png';
import $ from "jquery";
import { handleAddBlock } from "../actions/user";

function TeacherDashboard ({ users , authedUser , teachers }) {

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
            teachers
            .filter((teacher) => !users[authedUser].blockList.includes(teacher.id))
            .filter(({id}) => id !== authedUser)
            .map(({id}) => $(`#choose-teacher-${id}`).prop("checked", true))
        } else {
            setCheck(false)
            setUserCheck(false)
            teachers
            .filter((teacher) => !users[authedUser].blockList.includes(teacher.id))
            .filter(({id}) => id !== authedUser)
            .map(({id}) => $(`#choose-teacher-${id}`).prop("checked", false))
        }
    }

    function filteredTeacher() {
        return {
            teacher: teachers.filter((teacher) => !users[authedUser].blockList.includes(teacher.id))
            .filter((teacher) => search !== "" ? 
            (teacher.email.includes(search) || teacher.name.toLowerCase().includes(search))
            : teacher),
            checked: teachers.filter((teacher) => !users[authedUser].blockList.includes(teacher.id))
            .filter((teacher) => search !== "" ? 
            (teacher.email.includes(search) || teacher.name.toLowerCase().includes(search))
            : teacher)
            .slice(firstIndex, lastIndex)
            .filter(({id}) => document.querySelector(`#choose-teacher-${id}`) !== null ? document.querySelector(`#choose-teacher-${id}`).checked === true : !id)
        }
    }

    return (
        <Grid container id="former-teacher-container" sx={{ pt: 12}} spacing={1}>
            <Grid item container spacing={1} md={12}>
                <DataBlock size={2} pic={contacts} text="All teachers" counter={teachers.length}/>
                <DataBlock size={2} pic={waiting} text="Pending" counter={teachers.filter(({status}) => status === "Pending").length}/>
                <DataBlock size={2} pic={accept} text="Approved" counter={teachers.filter(({status}) => status === "Approved").length}/>
                <DataBlock size={2} pic={reject} text="Rejected" counter={teachers.filter(({status}) => status === "Rejected").length}/>
                <DataBlock size={2} pic={earning} text="Paid" counter={teachers.filter(({due}) => due === "paid").length}/>
                <DataBlock size={2} pic={heart} text="Volunteer" counter={teachers.filter(({due}) => due === "volunteer").length}/>
            </Grid>
            <Grid item container direction="column" spacing={1} id="users-container" xs={12} sm={8} ml={1}>
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
                                id="bulk-teacher-selector"
                                type="checkbox"
                                disableUnderline
                                onChange={handleCheck}
                                value={check}
                                />
                        </Grid>
                        <Grid item sm={5.6}>
                            <TextField
                            id="teacher-search"
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
                            $("#teacher-search").val('')
                        }}
                            >
                            Reset
                        </Button>
                        {((document.querySelector("#bulk-teacher-selector") !== null) && (filteredTeacher().teacher.filter(({id}) => authedUser !== id).length > 0)) && (((document.querySelector("#bulk-teacher-selector").checked === true) || userCheck === true) && (
                            <Typography variant="body2" color="text.secondary">
                            {filteredTeacher().checked.length} Selected
                        </Typography>))}
                        <Button
                            variant="contained"
                            type="submit"
                            size="medium"
                            onClick={() => {
                                filteredTeacher().checked
                                .map(({id}) => dispatch(handleAddBlock(id, authedUser)));
                                $("#bulk-teacher-selector").prop("checked", false);
                                setCheck(false);
                                setUserCheck(false);
                            }}
                        >
                            Block Selected
                        </Button>
                    </Grid>
                </Paper>
                {filteredTeacher().teacher.filter((teacher) => !users[authedUser].blockList.includes(teacher.id)).map(({id}) => (
                    <Grid key={id} id={`${id}-li`} item>
                        <Teacher id={id} type="teacher" setter={setUserCheck} setValue={userCheck}/>
                    </Grid>
                )).slice(firstIndex, lastIndex)}
                <Grid item>
                <PaginationLink
                        showing={Math.ceil(filteredTeacher().teacher.length/10)}
                        pageSet={setCurrentPage}
                        firstIndex={firstIndex}
                        lastIndex={lastIndex}
                        total={filteredTeacher().teacher.filter((teacher) => !users[authedUser].blockList.includes(teacher.id)).length}
                        />
                </Grid>
            </Grid>
        </Grid>
    )
};

function mapStateToProps ({ users , authedUser }) {
    let userTeachers = Object.values(users);
    let teachers = userTeachers.length > 0 ? userTeachers.filter(({description}) => description === 'teacher')
    .sort((a, b) => b.joiningDate - a.joiningDate) : ['']
    return {
        teachers,
        users,
        authedUser: authedUser !== null ? authedUser[0] : null,
    }
};

export default connect(mapStateToProps)(TeacherDashboard)