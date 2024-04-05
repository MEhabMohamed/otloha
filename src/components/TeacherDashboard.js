import React, { useState } from "react";
import { connect } from "react-redux";
import { Grid } from "@mui/material";
import Teacher from "../Component Libraries/Teacher/Teacher"
import PaginationLink from "../Component Libraries/Pagination/Pagination";

function TeacherDashboard ({ users , authedUser , teachers }) {

    let [currentPage, setCurrentPage] = useState(1);
    let lastIndex = currentPage * 10;
    let firstIndex = lastIndex - 10;

    return (
        <Grid container id="former-user-container" sx={{ pt: 12}}>
            <Grid item id="users-container" xs={12} sm={8}>
                {teachers.map(({id}) => (
                    !users[authedUser].blockList.includes(id) &&
                    <Grid key={id} id={`${id}-li`} item>
                        <Teacher id={id}/>
                    </Grid>
                )).slice(firstIndex, lastIndex)}
                <Grid item>
                <PaginationLink
                        showing={Math.ceil(teachers.length/10)}
                        pageSet={setCurrentPage}
                        firstIndex={firstIndex}
                        lastIndex={lastIndex}
                        total={teachers.length}
                        />
                </Grid>
            </Grid>
        </Grid>
    )
};

function mapStateToProps ({ users , authedUser }) {
    let userTeachers = Object.values(users);
    let teachers = userTeachers.length > 0 ? userTeachers.filter(({description}) => description === 'teacher') : ['']
    return {
        teachers,
        users,
        authedUser: authedUser !== null ? authedUser[0] : null,
    }
};

export default connect(mapStateToProps)(TeacherDashboard)