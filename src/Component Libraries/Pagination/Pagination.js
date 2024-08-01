import * as React from 'react';
import { Link , useLocation } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export default function PaginationLink({
    showing,
    pageSet,
    firstIndex,
    lastIndex,
    total
  }) {

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', showing);
  
  return (
    <Stack
      spacing={0}
      sx={{
        background: '#0d88c242',
        alignItems: "center",
        borderRadius: "25px",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: "bolder",
        }}
      >
        Showing {total !== 0 ? firstIndex + 1 : 0}-{lastIndex} of total {total}
      </Typography>
      <Pagination
        color="primary"
        page={isNaN(page) ? 1 : page}
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