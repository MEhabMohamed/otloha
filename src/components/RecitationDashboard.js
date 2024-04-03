import React from "react";
import { connect } from "react-redux";
import { Grid } from "@mui/material";
import Recitation from "../Component Libraries/Recitation/Recitation"

function RecitationDashboard ({ recitations }) {

    return (
        <Grid container id="recites-container" sx={{ pt: 12}}>
            <Grid item id="users-container" xs={12}>
                {recitations.map((id) => (
                    <Grid key={id} id={id} item xs={12}>
                        <Recitation id={id}/>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    )
}

function mapStateToProps ({ users , authedUser , recitations }) {
    let recites = Object.keys(recitations)
    return {
        users,
        authedUser: authedUser !== null ? authedUser[0] : null,
        recitations: recites
    }
}

export default connect(mapStateToProps)(RecitationDashboard)