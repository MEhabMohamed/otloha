import React from "react";
import { connect } from "react-redux";
import { Grid } from "@mui/material";

function HomePage () {

    return (
        <Grid container id="former-user-container" sx={{ pt: 12}}>
        </Grid>
    )
};

function mapStateToProps ({ users }) {
    return {
        users
    }
};

export default connect(mapStateToProps)(HomePage)