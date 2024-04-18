import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { connect, useDispatch } from 'react-redux';
import { handleAddUserRating } from '../../actions/user';

function BasicRating({ level , rating , rated , ratedId , authedUser}) {

    const dispatch = useDispatch();

    return (
        <Box
        sx={{
            '& > legend': { font: 'bold 10px Helvetica, serif' },
            display: "flex",
            direction: "row",
            ml: 0.25
        }}
        >
        <Typography component="legend">{level}</Typography>
        <Rating
            name="simple-controlled"
            value={rating}
            onChange={(event, newValue) => {
                dispatch(handleAddUserRating(authedUser, ratedId, newValue));
            }}
            size='small'
            sx={{
                mt: -0.5
            }}
            readOnly={rated}
        />
        </Box>
    );
}

function mapStateToProps ({users , authedUser}) {
    return {
        users,
        authedUser: authedUser !== null ? authedUser[0] : null,
    }
  };

export default connect(mapStateToProps)(BasicRating)