import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router-dom';

export default function Copyright(props) {
  return (
    <Box sx={{ textAlign: 'center', ...props.sx }}>
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © '}
        <Link component={RouterLink} color="inherit" to="/" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
          Otloha
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
        <Link
          component={RouterLink}
          to="/privacy-policy"
          variant="caption"
          color="text.secondary"
          sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline', color: 'primary.main' } }}
        >
          Privacy Policy
        </Link>
        <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6 }}>
          •
        </Typography>
        <Link
          component={RouterLink}
          to="/user-data-deletion"
          variant="caption"
          color="text.secondary"
          sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline', color: 'primary.main' } }}
        >
          User Data Deletion
        </Link>
      </Box>
    </Box>
  );
}