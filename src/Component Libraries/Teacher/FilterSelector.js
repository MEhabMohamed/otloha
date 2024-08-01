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
          <MenuItem value="Verified">Verified</MenuItem>
          <MenuItem value="Not Verified">Not Verified</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Not Active">Not Active</MenuItem>
          <MenuItem value="Beginner">Beginner</MenuItem>
          <MenuItem value="Intermediate">Intermediate</MenuItem>
          <MenuItem value="Advanced">Advanced</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Profile Active">Profile Active</MenuItem>
          <MenuItem value="Profile Not Active">Profile Not Active</MenuItem>
          <MenuItem value="Rated 5 stars">Rated 5 stars</MenuItem>
          <MenuItem value="Rated 4 stars">Rated 4 stars</MenuItem>
          <MenuItem value="Rated 3 stars">Rated 3 stars</MenuItem>
          <MenuItem value="Rated 2 stars">Rated 2 stars</MenuItem>
          <MenuItem value="Rated 1 star">Rated 1 star</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}