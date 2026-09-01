import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Copyright from '../Copyright/Copyright';
import { Link, useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import validateUser from './userValidation';
import { setAuthedUser } from '../../actions/authedUsers';
import BasicAlerts from '../Alert/Alert';
import google from '../../Resources/google.png';
import fb from '../../Resources/facebook.png';
import twitter from '../../Resources/twitter.png';
import SocialButton from '../SocialButton/SocialButton';
import showPass from '../../helpers/showpass';
import eye from '../../Resources/eye.png';
import $ from 'jquery';
import Hero from './Hero';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';

function SignInSide({ users }) {

  const savedEmail = localStorage.getItem('rememberedEmail') || '';
  const savedPassword = localStorage.getItem('rememberedPassword') || '';

  const [email, setEmail] = React.useState(savedEmail);
  const [password, setPassword] = React.useState(savedPassword);
  const [remember, setRemember] = React.useState(!!savedEmail);

  const [otpOpen, setOtpOpen] = React.useState(false);
  const [otpCode, setOtpCode] = React.useState('');
  const [otpStatus, setOtpStatus] = React.useState(''); // 'sending', 'sent', 'error', 'success', 'verifying'
  const [otpError, setOtpError] = React.useState('');

  let [emailValidateAlert, setEmailValidateAlert] = React.useState('');
  let [passValidateAlert, setPassValidateAlert] = React.useState('');

  let usermails = users !== (undefined || null)
  ? Object.values(users).map(({email}) => email) : [];
  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (savedPassword) {
      $('#signin-show-pass').show();
    }
  }, [savedPassword]);

  const handleRememberChange = (e) => {
    const checked = e.target.checked;
    setRemember(checked);
    if (!checked) {
      setEmail('');
      setPassword('');
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
      $('#signin-show-pass').hide();
    }
  };

  const handleShowPasswordClick = () => {
    const passwordInput = document.querySelector('#signin-password');
    if (passwordInput && passwordInput.type === 'password') {
      if (remember) {
        setOtpStatus('sending');
        setOtpError('');
        setOtpCode('');
        setOtpOpen(true);
        
        fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        })
        .then(res => {
          if (!res.ok) throw new Error('Failed to send code');
          return res.json();
        })
        .then(() => {
          setOtpStatus('sent');
        })
        .catch(err => {
          console.error(err);
          setOtpStatus('error');
          setOtpError('Failed to send verification code. Please try again.');
        });
      } else {
        showPass('signin-password');
      }
    } else {
      showPass('signin-password');
    }
  };

  const handleVerifyOtp = () => {
    if (!otpCode) {
      setOtpError('Please enter the verification code');
      return;
    }
    setOtpStatus('verifying');
    
    fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, code: otpCode })
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(data => {
          throw new Error(data.error || 'Verification failed');
        });
      }
      return res.json();
    })
    .then(() => {
      setOtpStatus('success');
      setOtpOpen(false);
      const passwordInput = document.querySelector('#signin-password');
      if (passwordInput) {
        passwordInput.type = 'text';
      }
    })
    .catch(err => {
      console.error(err);
      setOtpStatus('error');
      setOtpError(err.message || 'Invalid or expired verification code');
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    validateUser(
      usermails,
      users,
      email,
      password,
      dispatch,
      setAuthedUser,
      navigate,
      setEmailValidateAlert,
      setPassValidateAlert,
      remember)
  };

  const handleSocialLogin = async (provider) => {
    if (provider === 'google') {
      const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
      const options = {
        redirect_uri: window.location.origin,
        client_id: '185798045507-mabt0pd37023l4vt0qupra8frgvsgmgm.apps.googleusercontent.com',
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        state: 'google',
        scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
      };
      const qs = new URLSearchParams(options);
      window.location.href = `${rootUrl}?${qs.toString()}`;
      return;
    }

    if (provider === 'facebook') {
      const rootUrl = 'https://www.facebook.com/v18.0/dialog/oauth';
      const options = {
        redirect_uri: window.location.origin,
        client_id: '1362513349344023',
        response_type: 'code',
        scope: 'email,public_profile',
        state: 'facebook',
      };
      const qs = new URLSearchParams(options);
      window.location.href = `${rootUrl}?${qs.toString()}`;
      return;
    }

    if (provider === 'twitter') {
      const rootUrl = 'https://twitter.com/i/oauth2/authorize';
      const codeVerifier = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('twitter_code_verifier', codeVerifier);
      const options = {
        response_type: 'code',
        client_id: 'YXBFWk9xdE5MMmt6ZkpiOHV4VFk6MTpjaQ',
        redirect_uri: window.location.origin,
        scope: 'users.read tweet.read offline.access',
        state: 'twitter',
        code_challenge: codeVerifier,
        code_challenge_method: 'plain',
      };
      const qs = new URLSearchParams(options);
      window.location.href = `${rootUrl}?${qs.toString()}`;
      return;
    }

    console.error(`Unsupported social login provider: ${provider}`);
  };

  return (
      <Grid container component="main" sx={{ height: '100%' }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Hero />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{
            py: 10
          }}
        >
          <Box
            sx={{
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              my: 5,
              gap: 2
            }}>
              <SocialButton source={google} alternate="google" text="Google" onClick={() => handleSocialLogin('google')} />
              <SocialButton source={fb} alternate="facebook" text="Facebook" onClick={() => handleSocialLogin('facebook')} />
              <SocialButton source={twitter} alternate="twitter" text="Twitter" onClick={() => handleSocialLogin('twitter')} />
            </Box>
            <Typography component="span" sx={{ fontSize: 12}}>
              or using Email
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{
                mt: 1
              }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus={!savedEmail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Grid item xs={12} sx={{ display: "none"}} id="email-validate-alert">
                  <BasicAlerts text={emailValidateAlert} />
              </Grid>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="signin-password"
                autoComplete="current-password"
                autoFocus={!!savedEmail}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: password && (
                    <InputAdornment position="end">
                      <img
                        src={eye}
                        alt="show-password"
                        style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                        onClick={handleShowPasswordClick}
                      />
                    </InputAdornment>
                  )
                }}
              />
              <Grid item xs={12} sx={{ display: "none"}} id="pass-validate-alert">
                  <BasicAlerts text={passValidateAlert} />
              </Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={remember}
                    onChange={handleRememberChange}
                    color="primary"
                  />
                }
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link to="/forgot-password">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/createuser">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />

              <Dialog open={otpOpen} onClose={() => setOtpOpen(false)}>
                <DialogTitle>Show Password Verification</DialogTitle>
                <DialogContent>
                  <DialogContentText sx={{ mb: 2 }}>
                    To show the password, we have sent a verification code to your email: <strong>{email}</strong>.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Verification Code"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    error={!!otpError}
                    helperText={otpError}
                    disabled={otpStatus === 'verifying'}
                  />
                  {otpStatus === 'sending' && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Sending verification code...
                    </Typography>
                  )}
                  {otpStatus === 'sent' && (
                    <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                      Verification code sent successfully.
                    </Typography>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOtpOpen(false)} disabled={otpStatus === 'verifying'}>
                    Cancel
                  </Button>
                  <Button onClick={handleVerifyOtp} variant="contained" disabled={otpStatus === 'verifying'}>
                    {otpStatus === 'verifying' ? 'Verifying...' : 'Verify'}
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Box>
        </Grid>
      </Grid>
  );
}

function mapStateToProps ({ users }) {
  let usermails = Object.values(users).map(({email}) => email)
  return {
      usermails,
      users
  }
}

export default connect(mapStateToProps)(SignInSide)