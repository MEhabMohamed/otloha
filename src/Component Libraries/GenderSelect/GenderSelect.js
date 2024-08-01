import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function GenderSelect({ gender , setter }) {

  const handleChange = (event) => {
    setter(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl
          fullWidth
          sx={{
            justifyContent: "center"
          }}
        >
        <InputLabel
          id="gender-select-label"
          sx={{
            mt: -0.75
          }}
        >
          Gender
        </InputLabel>
        <Select
          labelId="gender-select-label"
          id="gender-select"
          value={gender}
          label="Gender"
          onChange={handleChange}
          sx={{
            maxHeight: 42
          }}
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}