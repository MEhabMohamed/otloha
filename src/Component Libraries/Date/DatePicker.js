import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DatePick({ choose , label }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker onChange={(e) => choose(e.$d)} label={label ? label : ""}/>
    </LocalizationProvider>
  );
}