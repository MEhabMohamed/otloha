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
import Copyright from '../Copyright/Copyright';
import { Link } from 'react-router-dom';
import BasicAlerts from '../Alert/Alert';

export default function ForgotPassword() {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState(''); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = React.useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }
    setStatus('loading');
    setMessage('');

    fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || 'Failed to send reset link');
          });
        }
        return res.json();
      })
      .then(() => {
        setStatus('success');
        setMessage('A password reset link has been sent to your email.');
      })
      .catch((err) => {
        console.error(err);
        setStatus('error');
        setMessage(err.message || 'Something went wrong. Please try again.');
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
          Forgot Password
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2, mb: 3 }}>
          Enter your registered email address below, and we will send you a link to reset your password.
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
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
            disabled={status === 'loading'}
            sx={{ mt: 3, mb: 2 }}
          >
            {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
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
