import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { connect } from 'react-redux';
import { countries } from './Countries';

function CountrySelect({ value , select , identify , importance }) {

  return (
    <Autocomplete
      id={`${identify}-country-select`}
      options={countries}
      sx={{
        minWidth: 150,
      }}
      autoHighlight
      value={value}
      clearOnEscape
      onChange={(e, option) => select(option === null ? '' : option)}
      isOptionEqualToValue={(option , value) => value !== null ? option.label : ""}
      renderOption={(props, option) => (
        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
          <img
            loading="lazy"
            width="20"
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            alt=""
          />
          {option.label} ({option.code}) +{option.phone}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          required={importance}
          label="Select a country!"
          sx={{
            height: "100%"
          }}
          id={`${identify}-country-select-label`}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-country', // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}


export default connect()(CountrySelect)