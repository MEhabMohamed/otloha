import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';

export default function Locales({ select }) {
  const [locale, setLocale] = React.useState('arEG');

  const theme = useTheme();

  const themeWithLocale = React.useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <ThemeProvider theme={themeWithLocale}>
        <Autocomplete
          options={Object.keys(locales)}
          getOptionLabel={(key) => `${key.substring(0, 2)}-${key.substring(2, 4)}`}
          style={{ width: "100%" }}
          value={locale}
          disableClearable
          onChange={(event, newValue) => {
            setLocale(newValue);
            select(newValue.slice(0, 2));
          }}
          renderInput={(params) => (
            <TextField {...params} label="Language" fullWidth />
          )}
        />
      </ThemeProvider>
    </Box>
  );
}