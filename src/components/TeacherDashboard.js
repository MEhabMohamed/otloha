import React from "react";
import { connect } from "react-redux";
import { Grid } from "@mui/material";
import Teacher from "../Component Libraries/Teacher/Teacher"

function TeacherDashboard ({ users }) {

    return (
        <Grid container id="former-user-container" sx={{ pt: 12}}>
            <Grid item id="users-container" xs={12} sm={8}>
                {users.map(({id}) => (
                    <Grid key={id} id={`${id}-li`} item xs={12}>
                        <Teacher id={id}/>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    )
};

function mapStateToProps ({ users }) {
    let userTeachers = Object.values(users);
    let teachers = userTeachers.length > 0 ? userTeachers.filter(({description}) => description === 'teacher') : ['']
    return {
        users: teachers
    }
};

export default connect(mapStateToProps)(TeacherDashboard)