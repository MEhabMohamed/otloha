import React from "react";
import { connect } from "react-redux"
import Recitation from "./Recitation";
import { Grid } from "@mui/material";

function FilteredRecitation({
    recitations,
    firstIndex,
    lastIndex,
    }) {

        let recites = Object.keys(recitations)
        .sort((a, b,) => recitations[b].createdAt - recitations[a].createdAt)

        return recitations
        .map((id, index) => (
            <Grid
                key={id}
                id={id}
                item
            >
                <Recitation
                    id={id}
                    index={recites.length - index}
                />
            </Grid>
        )).slice(firstIndex, lastIndex)
}

export default connect()(FilteredRecitation)