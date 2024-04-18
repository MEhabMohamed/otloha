import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { connect } from 'react-redux';

function AdminSelect({ users , authedUser , admins , value , select }) {

  return (
    <Autocomplete
      id={`admin-select`}
      options={Object.values(users)
      .filter(({id}) => id !== authedUser && !Object.keys(admins).includes(id))
      .filter(({description}) => description === "teacher")
      .map(({email}) => email)}
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
          label="Select a user!"
          sx={{
            height: "100%"
          }}
          id={`admin-select-label`}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-admin', // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}

function mapStateToProps({ users , authedUser , admins }) {
    return {
        users,
        authedUser: authedUser !== null ? authedUser[0] : null,
        admins
    }
}


export default connect(mapStateToProps)(AdminSelect)