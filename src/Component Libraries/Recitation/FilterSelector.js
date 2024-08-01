import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export default function FilterSelector({ filter , setter , identify }) {

  const handleChange = (event) => {
    setter(event.target.value);
  };

  return (
    <Box>
      <FormControl
          fullWidth
        >
        <InputLabel
            id={`${identify}-filter-select-label`}
            sx={{
                mt: -0.75
            }}
        >
            <FilterAltIcon />
            filter
        </InputLabel>
        <Select
          labelId={`${identify}-filter-select-label`}
          id={`${identify}-filter-select`}
          value={filter}
          label="Filter"
          onChange={handleChange}
          sx={{
            maxHeight: 40,
          }}
        >
          <MenuItem value="Not Remarkable">Not Remarkable</MenuItem>
          <MenuItem value="Teacher recitation">Teacher recitation</MenuItem>
          <MenuItem value="Not Teacher recitation">Not Teacher recitation</MenuItem>
          <MenuItem value="Evaluated">Evaluated</MenuItem>
          <MenuItem value="Not Evaluated">Not Evaluated</MenuItem>
          <MenuItem value="Teacher Rated 5 stars">Teacher Rated 5 stars</MenuItem>
          <MenuItem value="Teacher Rated 4 stars">Teacher Rated 4 stars</MenuItem>
          <MenuItem value="Teacher Rated 3 stars">Teacher Rated 3 stars</MenuItem>
          <MenuItem value="Teacher Rated 2 stars">Teacher Rated 2 stars</MenuItem>
          <MenuItem value="Teacher Rated 1 star">Teacher Rated 1 star</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}