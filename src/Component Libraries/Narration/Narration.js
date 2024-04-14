import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function NarrationSelect({ narrate , setter , identify }) {

  const handleChange = (event) => {
    setter(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl
          fullWidth
          required
        >
        <InputLabel id={`${identify}-narration-select-label`}>Narration</InputLabel>
        <Select
          labelId={`${identify}-narration-select-label`}
          id={`${identify}-narration-select`}
          value={narrate}
          label="Narration"
          onChange={handleChange}
        >
          <MenuItem value="Hafs حفص عن عاصم">Hafs حفص عن عاصم</MenuItem>
          <MenuItem value="Warsh ورش عن نافع">Warsh ورش عن نافع</MenuItem>
          <MenuItem value="Kalon قالون عن نافع">Kalon قالون عن نافع</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}