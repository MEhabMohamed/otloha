import React from "react";
import { connect } from "react-redux";
import PieActiveArc from "../PieChart/PieChart";
import Typography from '@mui/material/Typography';
import { Grid } from "@mui/material";

function HomeData({ count , data , label , size }) {
    return (
        <Grid item md={size} sm={12}>
            <Grid item md={12} px={2}>
                <Typography variant="subtitle1" sx={{
                fontWeight:"bold"
                }}>
                    {count} {label}
                </Typography>
            </Grid>
            <Grid item container md={12} sm={6} justifyContent="center">
                <PieActiveArc data={data} />
            </Grid>
        </Grid>
    )
}

export default connect()(HomeData)