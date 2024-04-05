import * as React from 'react';
import { Link , useLocation } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export default function PaginationLink({ showing, pageSet, firstIndex, lastIndex, total }) {

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', showing);
  
  return (
    <Stack spacing={2}>
      <Typography>Showing {total !== 0 ? firstIndex + 1 : 0}-{lastIndex} of total {total}</Typography>
      <Pagination
        page={page}
        count={showing}
        onChange={(e, value) => pageSet(value)}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={`${item.page === 1 ? '' : `?page=${item.page}`}`}
            {...item}
          />
        )}
      />
    </Stack>
  );
}