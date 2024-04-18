import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { connect } from 'react-redux';

function AdminRemove({ admins , value , select , authedUser }) {
  return (
    <Autocomplete
      id={`admin-remove`}
      options={Object.values(Object.values(admins))
      .filter(({ id }) => id !== authedUser)
      .map(({ email }) => email)}
      sx={{
        minWidth: 140,
      }}
      autoHighlight
      value={value}
      clearOnEscape
      onChange={(e, option) => select(option === null ? '' : option)}
      isOptionEqualToValue={(option , value) => value !== null ? option : ""}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          {option}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select an admin!"
          sx={{
            height: "100%"
          }}
          id={`admin-remove-label`}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'delete-admin', // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}

function mapStateToProps({ authedUser , admins }) {
    return {
        authedUser: authedUser !== null ? authedUser[0] : null,
        admins
    }
}


export default connect(mapStateToProps)(AdminRemove)