import { Grid, Paper, Typography, ButtonBase } from "@mui/material";
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

function DataBlock({ counter , text , size , pic , handleClick }) {
    return (
        <Grid item container md={size}>
          <ButtonBase
            sx={{
              width: "100%",
            }}
            onClick={handleClick}
          >
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
                      <Img sx={{ width: 70, height: 70 }} alt="complex" src={pic} />
                </Grid>
                <Grid item xs={12} textAlign="left">
                  <Typography variant="body2" fontWeight="bolder" fontSize={24}>
                    {counter}
                  </Typography>
                </Grid>
                <Grid item xs={12} textAlign="left">
                  <Typography variant="body2" fontWeight="bolder" fontSize={18}>
                    {text}
                  </Typography>
                </Grid>
            </Paper>
          </ButtonBase>
        </Grid>
    )
}

export default connect()(DataBlock)