import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function TeacherEvaluationSelect({ evaluation , setter , identify }) {

  const handleChange = (event) => {
    setter(event.target.value);
  };

  return (
    <Box
      sx={{
        minWidth: 140
      }}
    >
      <FormControl
          fullWidth
          required
        >
        <InputLabel
          id={`${identify}-teacher-evaluation-select-label`}
          sx={{
            fontSize: "12px",
            mt: -1
          }}
        >
          Teacher Evaluation
        </InputLabel>
        <Select
          labelId={`${identify}-teacher-evaluation-select-label`}
          id={`${identify}-teacher-evaluation-select`}
          value={evaluation}
          label="teacher-evaluation"
          onChange={handleChange}
          sx={{
            height: 30,
          }}
        >
          <MenuItem value="Approved">Approved</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}