import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DatePick({ value , choose , label , setWidth}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={value}
        onChange={(e) =>
          e !== null ? choose(e.$d) : choose(null)
        }
        label={label ? label : ""}
        sx={{
          width: setWidth,
          maxHeight: 30
        }}
      />
    </LocalizationProvider>
  );
}