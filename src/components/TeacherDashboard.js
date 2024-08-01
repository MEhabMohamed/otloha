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
import FilterSelector from "../Component Libraries/Teacher/FilterSelector";
import DatePick from "../Component Libraries/Date/DatePicker";

function TeacherDashboard () {

    let [search, setSearch] = useState('');
    let [check, setCheck] = useState(false);
    let [userCheck, setUserCheck] = useState(false);
    let [currentPage, setCurrentPage] = useState(1);
    let [teacherFilter, setTeacherFilter] = useState(null);
    let [teacherFilterSelector, setTeacherFilterSelector] = useState("");
    let [fromDate, setFromDate] = useState(null);
    let [toDate, setToDate] = useState(null);
    let [joinedFrom, setJoinedFrom] = useState(null);
    let [joinedTo, setJoinedTo] = useState(null);
    let lastIndex = currentPage * 10;
    let firstIndex = lastIndex - 10;

    let users = JSON.parse(localStorage.getItem("users"));
    let authedUser = JSON.parse(localStorage.getItem("authedUser")) !== null ?
    JSON.parse(localStorage.getItem("authedUser"))[0] : null;
    let userTeachers = Object.values(users);
    let teachers = userTeachers.length > 0 ? userTeachers.filter(({description}) =>
    description === 'teacher')
    .sort((a, b) => b.joiningDate - a.joiningDate) : [''];

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

    function rating( teacher , stars ) {
        let ratingSum = 0;
        teacher.raters.map(({rating}) => ratingSum += rating);
        let rating = ratingSum/teacher.raters.raters.length;

        return {
            rating: teacher.raters.length > 0
            ? (rating === stars) && teacher : !teacher
        }
    }

    function filteredTeacher() {
        return {
            teacher: teachers.filter((teacher) =>
            !users[authedUser].blockList.includes(teacher.id))
            .filter((teacher) => search !== "" ? 
            (teacher.email.includes(search)
            || teacher.name.toLowerCase().includes(search))
            : teacher)
            .filter((teacher) => fromDate !== null
            ? teacher.bDate >= Date.parse(fromDate)
            : teacher)
            .filter((teacher) => toDate !== null
            ? teacher.bDate <= Date.parse(toDate)
            : teacher)
            .filter((teacher) => joinedFrom !== null
            ? teacher.joiningDate >= Date.parse(joinedFrom)
            : teacher)
            .filter((teacher) => joinedTo !== null
            ? teacher.joiningDate <= Date.parse(joinedTo)
            : teacher)
            .filter((teacher) => {
                switch(teacherFilter) {
                    case "Approved":
                        return teacher.status === "Approved"
                    case "Rejected":
                        return teacher.status === "Rejected"
                    case "Pending":
                        return teacher.status === "Pending"
                    case "paid":
                        return teacher.due === "paid"
                    case "volunteer":
                        return teacher.due === "volunteer"
                    default:
                        return teacher
                }
            })
            .filter((teacher) => {
                switch(teacherFilterSelector) {
                    case "Verified":
                        return teacher.verified
                    case "Not Verified":
                        return !teacher.verified
                    case "Active":
                        return teacher.active
                    case "Not Active":
                        return !teacher.active
                    case "Profile Active":
                        return teacher.active
                    case "Profile Not Active":
                        return !teacher.active
                    case "Beginner":
                        return teacher.level === "Beginner"
                    case "Intermediate":
                        return teacher.level === "Intermediate"
                    case "Advanced":
                        return teacher.level === "Advanced"
                    case "Male":
                        return teacher.gender === "male"
                    case "Female":
                        return teacher.gender === "female"
                    case "Rated 5 stars":
                        return rating(teacher , 5).rating
                    case "Rated 4 stars":
                        return rating(teacher , 4).rating
                    case "Rated 3 stars":
                        return rating(teacher , 3).rating
                    case "Rated 2 stars":
                        return rating(teacher , 2).rating
                    case "Rated 1 star":
                        return rating(teacher , 1).rating
                    default:
                        return teacher
                }
            }),
            checked: teachers.filter((teacher) =>
            !users[authedUser].blockList.includes(teacher.id))
            .filter((teacher) => search !== "" ? 
            (teacher.email.includes(search)
            || teacher.name.toLowerCase().includes(search))
            : teacher)
            .slice(firstIndex, lastIndex)
            .filter(({id}) => document.querySelector(`#choose-teacher-${id}`) !== null
            ? document.querySelector(`#choose-teacher-${id}`).checked === true
            : !id)
        }
    }

    return (
        <Grid
            container
            direction="column"
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
                    size={2}
                    pic={contacts}
                    text="All teachers"
                    counter={teachers.length}
                    handleClick={() => {
                        setTeacherFilter(null);
                        setTeacherFilterSelector('');
                    }}
                />
                <DataBlock
                    size={2}
                    pic={waiting}
                    text="Pending"
                    counter={teachers.filter(({status}) => status === "Pending").length}
                    handleClick={() => setTeacherFilter("Pending")}
                />
                <DataBlock
                    size={2}
                    pic={accept}
                    text="Approved"
                    counter={teachers.filter(({status}) => status === "Approved").length}
                    handleClick={() => setTeacherFilter("Approved")}
                />
                <DataBlock
                    size={2}
                    pic={reject}
                    text="Rejected"
                    counter={teachers.filter(({status}) => status === "Rejected").length}
                    handleClick={() => setTeacherFilter("Rejected")}
                />
                <DataBlock
                    size={2}
                    pic={earning}
                    text="Paid"
                    counter={teachers.filter(({due}) => due === "paid").length}
                    handleClick={() => setTeacherFilter("paid")}
                />
                <DataBlock
                    size={2}
                    pic={heart}
                    text="Volunteer"
                    counter={teachers.filter(({due}) => due === "volunteer").length}
                    handleClick={() => setTeacherFilter("volunteer")}
                />
            </Grid>
            <Grid
                item
                container
                direction="column"
                spacing={1}
                xs={12}
                sm={12}
            >
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
                        xs={0.25}
                        sm={0.25}
                        md={0.25}
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        <Input
                            id="bulk-teacher-selector"
                            type="checkbox"
                            disableUnderline
                            onChange={handleCheck}
                            value={check}
                        />
                    </Grid>
                    <Grid
                        item
                        md={4}
                    >
                        <TextField
                            id="teacher-search"
                            label="search"
                            name="search"
                            fullWidth
                            autoComplete="search-feild"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Grid>
                    <Grid
                        item
                        md={2}
                    >
                        <FilterSelector
                            filter={teacherFilterSelector}
                            setter={setTeacherFilterSelector}
                            identify="teacher-dashboard"
                        />
                    </Grid>
                    <Button
                        variant="contained"
                        type="submit"
                        size="medium"
                        onClick={() => {
                            setSearch('');
                            $("#teacher-search").val('');
                            setTeacherFilter(null);
                            setTeacherFilterSelector('');
                        }}
                    >
                        Reset
                    </Button>
                    {((document.querySelector("#bulk-teacher-selector") !== null)
                    && (filteredTeacher().teacher.filter(({id}) =>
                    authedUser !== id).length > 0)
                    && filteredTeacher().checked.length > 0)
                    && ((
                    (document.querySelector("#bulk-teacher-selector").checked === true)
                    || userCheck === true
                    ) && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {filteredTeacher().checked.length} Selected
                        </Typography>)
                    )}
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
                        spacing={1}
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
                {filteredTeacher().teacher.filter((teacher) =>
                !users[authedUser].blockList.includes(teacher.id))
                .map(({id}) => (
                    <Grid
                        key={id}
                        id={`${id}-li`}
                        item
                    >
                        <Teacher
                            id={id}
                            type="teacher"
                            setter={setUserCheck}
                            setValue={userCheck}
                        />
                    </Grid>
                )).slice(firstIndex, lastIndex)
                }
                <Grid item>
                <PaginationLink
                        showing={Math.ceil(filteredTeacher().teacher.length/10)}
                        pageSet={setCurrentPage}
                        firstIndex={firstIndex}
                        lastIndex={lastIndex}
                        total={filteredTeacher().teacher.filter((teacher) =>
                        !users[authedUser].blockList.includes(teacher.id)).length}
                        />
                </Grid>
            </Grid>
        </Grid>
    )
};

export default connect()(TeacherDashboard)