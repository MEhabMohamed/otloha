import React from "react";
import { connect } from "react-redux";
import Student from "../Component Libraries/Student/Student";
import { Grid } from "@mui/material";

function StudentDashboard ({ users }) {

    return (
        <Grid container id="former-user-container" sx={{ pt: 12}}>
            <Grid item id="users-container" xs={12} sm={8}>
                {users.map(({id}) => (
                    <Grid key={id} id={`${id}-li`} item xs={12}>
                        <Student id={id}/>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    )
};

function mapStateToProps ({ users }) {
    let userStudents = Object.values(users);
    let students = userStudents.length > 0 ? userStudents.filter(({description}) => description === 'student') : ['']
    return {
        users: students
    }
};

export default connect(mapStateToProps)(StudentDashboard)