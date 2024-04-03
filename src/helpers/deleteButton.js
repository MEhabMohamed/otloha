import * as React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

export const DeleteButton = React.forwardRef(({ specialProp, ...props }, ref) => {
  // DO SOMETHING WITH SPECIALPROP 
  // HERE, THEN:
  return   <Stack direction="row" spacing={1} {...props} ref={ref}>
                <IconButton aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </Stack> 
});