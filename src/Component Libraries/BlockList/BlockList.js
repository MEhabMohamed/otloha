import React, { useState } from "react";
import { connect } from "react-redux";
import { Grid } from "@mui/material";
import Teacher from "../Teacher/Teacher";
import Student from "../Student/Student";
import PaginationLink from "../Pagination/Pagination";

function BlockList ({ users , blocked }) {

    let [currentPage, setCurrentPage] = useState(1);
    let lastIndex = currentPage * 10;
    let firstIndex = lastIndex - 10;

    return (
        <Grid container id="former-blocked-container" sx={{ pt: 12}}>
            <Grid item id="blocked-container" xs={12} sm={8}>
                {blocked.map((id) => (users[id].description === "student" ?
                    <Grid key={id} id={`${id}-li`} item mb={1}>
                        <Student id={id}/>
                    </Grid> : 
                    <Grid key={id} id={`${id}-li`} item mb={1}>
                        <Teacher id={id}/>
                    </Grid>
                )).slice(firstIndex, lastIndex)}
                <Grid item>
                <PaginationLink
                        showing={Math.ceil(blocked.length/10)}
                        pageSet={setCurrentPage}
                        firstIndex={firstIndex}
                        lastIndex={lastIndex}
                        total={blocked.length}
                        />
                </Grid>
            </Grid>
        </Grid>
    )
};

function mapStateToProps ({ users , authedUser }) {
    let blocked = users[authedUser[0]].blockList;
    return {
        blocked,
        users
    }
};

export default connect(mapStateToProps)(BlockList)