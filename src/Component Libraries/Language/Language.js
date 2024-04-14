import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';

export default function Locales({ value , select }) {

  const theme = useTheme();

  const themeWithLocale = React.useMemo(
    () => createTheme(theme, locales[value]),
    [value, theme],
  );

  return (
    <Box sx={{
      minWidth: 100,
    }}>
      <ThemeProvider theme={themeWithLocale}>
        <Autocomplete
          options={Object.keys(locales)}
          getOptionLabel={(key) => `${key.substring(0, 2)}-${key.substring(2, 4)}`}
          value={value}
          disableClearable
          sx={{
            height: "100%"
          }}
          onChange={(event, newValue) => {
            select(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Language"
              fullWidth
              sx={{
                height: "100%"
              }}/>
          )}
        />
      </ThemeProvider>
    </Box>
  );
}