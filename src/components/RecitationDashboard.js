import React, { useState } from "react";
import { connect } from "react-redux";
import { Grid } from "@mui/material";
import Recitation from "../Component Libraries/Recitation/Recitation"
import PaginationLink from "../Component Libraries/Pagination/Pagination";

function RecitationDashboard ({ recitations }) {

    let [currentPage, setCurrentPage] = useState(1);
    let lastIndex = currentPage * 10;
    let firstIndex = lastIndex - 10;

    return (
        <Grid container id="recites-container" sx={{ pt: 12}}>
            <Grid item id="users-container" xs={12} sm={8}>
                {recitations.map((id, index) => (
                    <Grid key={id} id={id} item mb={1}>
                        <Recitation id={id} index={recitations.length - index} />
                    </Grid>
                )).slice(firstIndex, lastIndex)}
                <Grid item>
                    <PaginationLink
                        showing={Math.ceil(recitations.length/10)}
                        pageSet={setCurrentPage}
                        firstIndex={firstIndex}
                        lastIndex={lastIndex}
                        total={recitations.length}
                        />
                </Grid>
            </Grid>
        </Grid>
    )
}

function mapStateToProps ({ users , authedUser , recitations }) {
    let recites = Object.keys(recitations)
    .sort((a, b,) => recitations[b].createdAt - recitations[a].createdAt)
    return {
        users,
        authedUser: authedUser !== null ? authedUser[0] : null,
        recitations: recites
    }
}

export default connect(mapStateToProps)(RecitationDashboard)