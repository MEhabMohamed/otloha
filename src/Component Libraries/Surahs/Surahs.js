import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CircularIndeterminate from '../Loading/Loading';

export default function SurahSelect({ surah , setter , mushaf}) {

  const handleChange = (event) => {
    setter(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="surah-select-label">Surah</InputLabel>
        <Select
          labelId="surah-select-label"
          id="surah-select"
          value={surah}
          label="Surah"
          onChange={handleChange}
        >
        {mushaf !== ("" && undefined) ? mushaf.data.surahs.map(({name , number}) => <MenuItem key={number} value={name}>{name}</MenuItem>) : <CircularIndeterminate />}
        </Select>
      </FormControl>
    </Box>
  );
}