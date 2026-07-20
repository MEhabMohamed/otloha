import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';
import Copyright from '../Copyright/Copyright';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import BasicAlerts from '../Alert/Alert';
import eye from '../../Resources/eye.png';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [status, setStatus] = React.useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = React.useState('');

  const [showPass, setShowPass] = React.useState(false);
  const [showConfirmPass, setShowConfirmPass] = React.useState(false);

  React.useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing reset token.');
    }
  }, [token]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!password || !confirmPassword) {
      setStatus('error');
      setMessage('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      setStatus('error');
      setMessage('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    setStatus('loading');
    setMessage('');

    fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || 'Failed to reset password');
          });
        }
        return res.json();
      })
      .then(() => {
        setStatus('success');
        setMessage('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      })
      .catch((err) => {
        console.error(err);
        setStatus('error');
        setMessage(err.message || 'Failed to reset password. The link may have expired.');
      });
  };

  return (
    <Container component={Paper} maxWidth="xs" sx={{ mt: 15, borderRadius: 3 }}>
      <Box
        sx={{
          py: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="New Password"
            type={showPass ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={status === 'loading' || !token}
            InputProps={{
              endAdornment: password && (
                <InputAdornment position="end">
                  <img
                    src={eye}
                    alt="show-password"
                    style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                    onClick={() => setShowPass(!showPass)}
                  />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm New Password"
            type={showConfirmPass ? 'text' : 'password'}
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={status === 'loading' || !token}
            InputProps={{
              endAdornment: confirmPassword && (
                <InputAdornment position="end">
                  <img
                    src={eye}
                    alt="show-password"
                    style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                  />
                </InputAdornment>
              ),
            }}
          />

          {message && (
            <Grid item xs={12} sx={{ mt: 2 }}>
              <BasicAlerts text={message} severity={status === 'success' ? 'success' : 'error'} />
            </Grid>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={status === 'loading' || !token}
            sx={{ mt: 3, mb: 2 }}
          >
            {status === 'loading' ? 'Resetting...' : 'Reset Password'}
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Link to="/">Back to Sign In</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ pb: 4 }} />
    </Container>
  );
}
