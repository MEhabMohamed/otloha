import * as React from 'react';
import { Link , useLocation } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

export default function PaginationLink({ showing, pageSet }) {

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', showing);
  
  return (
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
  );
}