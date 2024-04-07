import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Evaluate({ evaluate , setter }) {

  const handleChange = (event) => {
    setter(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl
          fullWidth
          required
        >
        <InputLabel id="evaluation-select-label">Evaluation</InputLabel>
        <Select
          labelId="evaluation-select-label"
          id="evaluation-select"
          value={evaluate}
          label="Evaluate"
          onChange={handleChange}
        >
          <MenuItem value="Accepted">Accept</MenuItem>
          <MenuItem value="Rejected">Reject</MenuItem>
          <MenuItem value="Reported">Report</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}