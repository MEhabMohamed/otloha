import React, { useState } from "react";
import { connect } from "react-redux";
import Student from "../Component Libraries/Student/Student";
import { Grid } from "@mui/material";
import PaginationLink from "../Component Libraries/Pagination/Pagination";

function StudentDashboard ({ users , authedUser , students }) {

    let [currentPage, setCurrentPage] = useState(1);
    let lastIndex = currentPage * 10;
    let firstIndex = lastIndex - 10;

    return (
        <Grid container id="former-user-container" sx={{ pt: 12}}>
            <Grid item id="users-container" xs={12} sm={8}>
                {students.map(({id}) => (
                    !users[authedUser].blockList.includes(id) &&
                    <Grid key={id} id={`${id}-li`} item>
                        <Student id={id}/>
                    </Grid>
                )).slice(firstIndex, lastIndex)}
                <Grid item>
                <PaginationLink
                        showing={Math.ceil(students.length/10)}
                        pageSet={setCurrentPage}
                        firstIndex={firstIndex}
                        lastIndex={lastIndex}
                        total={students.length}
                        />
                </Grid>
            </Grid>
        </Grid>
    )
};

function mapStateToProps ({ users , authedUser }) {
    let userStudents = Object.values(users);
    let students = userStudents.length > 0 ? userStudents.filter(({description}) => description === 'student') : ['']
    return {
        students,
        authedUser: authedUser !== null ? authedUser[0] : null,
        users
    }
};

export default connect(mapStateToProps)(StudentDashboard)