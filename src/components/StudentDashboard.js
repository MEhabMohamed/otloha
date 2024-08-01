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
import FilterSelector from "../Component Libraries/Student/FilterSelector";
import DatePick from "../Component Libraries/Date/DatePicker";

function StudentDashboard () {

    let [search, setSearch] = useState('');
    let [check, setCheck] = useState(false);
    let [userCheck, setUserCheck] = useState(false);
    let [currentPage, setCurrentPage] = useState(1);
    let [studentFilter, setStudentFilter] = useState(null);
    let [studentFilterSelector, setStudentFilterSelector] = useState("");
    let [fromDate, setFromDate] = useState(null);
    let [toDate, setToDate] = useState(null);
    let [joinedFrom, setJoinedFrom] = useState(null);
    let [joinedTo, setJoinedTo] = useState(null);
    let lastIndex = currentPage * 10;
    let firstIndex = lastIndex - 10;

    let users = JSON.parse(localStorage.getItem("users"));
    let authedUser = JSON.parse(localStorage.getItem("authedUser")) !== null ? 
    JSON.parse(localStorage.getItem("authedUser"))[0] : null;
    let userStudents = Object.values(users);
    let students = userStudents.length > 0 ? userStudents.filter(({description}) =>
    description === 'student')
    .sort((a, b) => b.joiningDate - a.joiningDate) : [];

    let dispatch = useDispatch();

    const handleCheck = () => {
        if (check === false) {
            setCheck(true)
            setUserCheck(true)
            filteredStudent().student
            .filter(({id}) => id !== authedUser)
            .map(({id}) => $(`#choose-student-${id}`).prop("checked", true))
        } else {
            setCheck(false)
            setUserCheck(false)
            filteredStudent().student
            .filter(({id}) => id !== authedUser)
            .map(({id}) => $(`#choose-student-${id}`).prop("checked", false))
        }
    }

    function rating( student , stars ) {
        let ratingSum = 0;
        student.raters.map(({rating}) => ratingSum += rating);
        let rating = ratingSum/student.raters.raters.length;

        return {
            rating: student.raters.length > 0
            ? (rating === stars) && student : !student
        }
    }

    function filteredStudent() {
        return {
            student: students.filter((student) =>
            !users[authedUser].blockList.includes(student.id))
            .filter((student) => search !== "" ? 
            (student.email.includes(search)
            || student.name.toLowerCase().includes(search))
            : student)
            .filter((student) => fromDate !== null
            ? student.bDate >= Date.parse(fromDate)
            : student)
            .filter((student) => toDate !== null
            ? student.bDate <= Date.parse(toDate)
            : student)
            .filter((student) => joinedFrom !== null
            ? student.joiningDate >= Date.parse(joinedFrom)
            : student)
            .filter((student) => joinedTo !== null
            ? student.joiningDate <= Date.parse(joinedTo)
            : student)
            .filter((student) => {
                switch(studentFilter) {
                    case "Active":
                        return student.active
                    case "Blocked":
                        return !student.active
                    default:
                        return student
                }
            })
            .filter((student) => {
                switch(studentFilterSelector) {
                    case "Verified":
                        return student.verified
                    case "Not Verified":
                        return !student.verified
                    case "Beginner":
                        return student.level === "Beginner"
                    case "Intermediate":
                        return student.level === "Intermediate"
                    case "Advanced":
                        return student.level === "Advanced"
                    case "Male":
                        return student.gender === "male"
                    case "Female":
                        return student.gender === "female"
                    case "Rated 5 stars":
                        return rating(student , 5).rating
                    case "Rated 4 stars":
                        return rating(student , 4).rating
                    case "Rated 3 stars":
                        return rating(student , 3).rating
                    case "Rated 2 stars":
                        return rating(student , 2).rating
                    case "Rated 1 star":
                        return rating(student , 1).rating
                    default:
                        return student
                }
            }),
            checked: students.filter((student) =>
            !users[authedUser].blockList.includes(student.id))
            .filter((student) => search !== "" ?
            (student.email.includes(search)
            || student.name.toLowerCase().includes(search))
            : student)
            .slice(firstIndex, lastIndex)
            .filter(({id}) => document.querySelector(`#choose-student-${id}`) !== null
            ? document.querySelector(`#choose-student-${id}`).checked === true
            : !id)
        }
    }

    return (
        <Grid
            container
            sx={{
                pt: 12,
                px: 1
            }}
            spacing={1}
        >
            <Grid
                item
                container
                spacing={1}
                md={12}
            >
                <DataBlock
                    size={4}
                    pic={contacts}
                    text="All students"
                    counter={students.length}
                    handleClick={() => {
                        setStudentFilter(null);
                        setStudentFilterSelector('');
                    }}
                />
                <DataBlock
                    size={4}
                    pic={accept}
                    text="Active"
                    counter={students.filter(({active}) => active).length}
                    handleClick={() => setStudentFilter("Active")}
                />
                <DataBlock
                    size={4}
                    pic={reject}
                    text="Blocked"
                    counter={students.filter(({active}) => !active).length}
                    handleClick={() => setStudentFilter("Blocked")}
                />
            </Grid>
            <Grid
                item
                container
                spacing={1}
                xs={12}
                sm={12}
                direction="column"
            >
                <Paper
                    sx={{
                        minHeight: 60,
                        pt: 1,
                        px: 1,
                        mt: 1,
                        ml: 1,
                    }}
                >
                    <Grid
                        item
                        container
                        gap={1}
                        justifyContent="right"
                    >
                        <Grid
                            item
                            xs={0.25}
                            sm={0.25}
                            md={0.25}
                            sx={{
                                textAlign: "center",
                            }}
                        >
                            <Input
                                id="bulk-student-selector"
                                type="checkbox"
                                disableUnderline
                                onChange={handleCheck}
                                value={check}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                            id="student-search"
                            label="search"
                            name="search"
                            fullWidth
                            autoComplete="search-feild"
                            onChange={(e) => setSearch(e.target.value)}
                            />
                        </Grid>
                        <Grid item>
                            <FilterSelector
                                filter={studentFilterSelector}
                                setter={setStudentFilterSelector}
                                identify="student-dashboard"
                            />
                        </Grid>
                        <Grid item>
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
                        </Grid>
                        {((document.querySelector("#bulk-student-selector") !== null)
                            && (filteredStudent().student
                            .filter(({id}) => authedUser !== id).length > 0)
                            && filteredStudent().checked.length > 0)
                            && (((document.querySelector("#bulk-student-selector").checked
                            === true)
                            || userCheck === true) && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {filteredStudent().checked.length} Selected
                            </Typography>))
                        }
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
                <Paper
                    sx={{
                        minHeight: 60,
                        px: 1,
                        pt: 1,
                        mt: 1,
                        ml: 1
                    }}
                >
                    <Grid
                        item
                        container
                        justifyContent="right"
                        gap={1}
                    >
                        <Grid
                            item
                            md={2.9}
                        >
                           <DatePick
                                value={fromDate}
                                choose={setFromDate}
                                label="Birth Date From..."
                                setWidth="auto"
                            />
                        </Grid>
                        <Grid
                            item
                            md={2.9}
                        >
                             <DatePick
                                value={toDate}
                                choose={setToDate}
                                label="Up to..."
                                setWidth="auto"
                            />
                        </Grid>
                        <Grid
                            item
                            md={2.9}
                        >
                           <DatePick
                                value={joinedFrom}
                                choose={setJoinedFrom}
                                label="Date Joined..."
                                setWidth="auto"
                            />
                        </Grid>
                        <Grid
                            item
                            md={2.9}
                        >
                             <DatePick
                                value={joinedTo}
                                choose={setJoinedTo}
                                label="Up to..."
                                setWidth="auto"
                            />
                        </Grid>
                    </Grid>
                </Paper>
                {filteredStudent().student
                    .map(({id}) => (
                        <Grid
                            key={id}
                            id={`${id}-li`}
                            item
                        >
                            <Student
                                id={id}
                                setter={setUserCheck}
                                setValue={userCheck}
                                type="student"
                            />
                        </Grid>
                    )).slice(firstIndex, lastIndex)
                }
                <Grid item>
                <PaginationLink
                        showing={Math.ceil(filteredStudent().student.length/10)}
                        pageSet={setCurrentPage}
                        firstIndex={firstIndex}
                        lastIndex={lastIndex}
                        total={filteredStudent().student.filter((student) =>
                        !users[authedUser].blockList.includes(student.id)).length}
                        />
                </Grid>
            </Grid>
        </Grid>
    )
};

export default connect()(StudentDashboard)