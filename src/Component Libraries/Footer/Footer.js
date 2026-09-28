import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import Copyright from '../Copyright/Copyright';

export default function Footer() {
  return (
    <Container
      component="footer"
      maxWidth="lg"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
        textAlign: { sm: 'center', md: 'left' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          pt: 3,
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', sm: 'flex-start' },
          }}
        >
          <Link
            component={RouterLink}
            to="/privacy-policy"
            color="text.secondary"
            sx={{
              fontSize: '0.875rem',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline', color: 'primary.main' },
            }}
          >
            Privacy Policy
          </Link>
          <Typography display="inline" sx={{ opacity: 0.5, fontSize: '0.875rem' }}>
            •
          </Typography>
          <Link
            component={RouterLink}
            to="/user-data-deletion"
            color="text.secondary"
            sx={{
              fontSize: '0.875rem',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline', color: 'primary.main' },
            }}
          >
            User Data Deletion
          </Link>
        </Box>
        <Copyright />
      </Box>
    </Container>
  );
}
