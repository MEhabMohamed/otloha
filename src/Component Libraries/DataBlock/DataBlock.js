import { ButtonBase, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { styled } from '@mui/material/styles';

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '8rem',
    maxHeight: '8rem',
    borderRadius: '50%',
  });

function DataBlock({ counter , text , size , pic }) {
    return (
        <Grid item container md={size}>
            <Paper
                sx={{
                    height:200,
                    pt: 7,
                    px: 3,
                    width: "100%"
                }}
                >
                <Grid
                item
                xs={12}
                sx={{
                textAlign: "center"
                }}
            >
                    <ButtonBase sx={{ width: 70, height: 70, cursor: "default" }}>
                    <Img sx={{ width: 70, height: 70 }} alt="complex" src={pic} />
                    </ButtonBase>
                </Grid>
                <Grid item xs={12}>
                <Typography variant="body2" fontWeight="bolder" fontSize={24}>
                  {counter}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" fontWeight="bolder" fontSize={24}>
                  {text}
                </Typography>
              </Grid>
            </Paper>
        </Grid>
    )
}

export default connect()(DataBlock)