import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function AyahSelect({
    surah,
    ayah,
    setter,
    label,
    numberSetter,
    ayahsList
  }) {

  const ayahs = ayahsList || [];

  const handleChange = (event) => {
    setter(event.target.value);
    const selectedAyah = ayahs.find(({text}) => text === event.target.value);
    numberSetter(selectedAyah ? selectedAyah.numberInSurah : 0);
  };

  return (
    <Box>
      <FormControl
        fullWidth
        required
      >
        <InputLabel id="ayah-select-label">{label}</InputLabel>
        <Select
          labelId="ayah-select-label"
          id="ayah-select"
          value={ayah}
          label="Ayah"
          onChange={handleChange}
        >
        {surah !== "" && ayahs.map(({text , number}) =>
        <MenuItem
          key={number}
          value={text}
        >
          {`...${text.substring(0, 40)}`}
        </MenuItem>)}
        </Select>
      </FormControl>
    </Box>
  );
}