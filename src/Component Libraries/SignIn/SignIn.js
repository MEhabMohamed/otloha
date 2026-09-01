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

const showPassStyle = {
  width: '15px',
  height: '15px',
  cursor: 'pointer',
  position: 'absolute',
  marginTop: '5.9rem',
  marginLeft: '0.5rem',
  display: 'none'
}

function SignInSide({ users }) {

  let [emailValidateAlert, setEmailValidateAlert] = React.useState('');
  let [passValidateAlert, setPassValidateAlert] = React.useState('');

  let usermails = users !== (undefined || null)
  ? Object.values(users).map(({email}) => email) : [];
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSocialLogin = (provider) => {
    if (provider === 'google') {
      const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '185798045507-mabt0pd37023l4vt0qupra8frgvsgmgm.apps.googleusercontent.com';
      const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
      const nonce = Math.random().toString(36).substring(2, 15);
      const options = {
        redirect_uri: window.location.origin,
        client_id: clientId,
        response_type: 'token id_token',
        scope: 'openid email profile',
        prompt: 'select_account',
        nonce: nonce,
        state: 'google',
      };
      const qs = new URLSearchParams(options);
      window.location.href = `${rootUrl}?${qs.toString()}`;
      return;
    }

    if (provider === 'facebook') {
      const appId = process.env.REACT_APP_FACEBOOK_APP_ID || '1362513349344023';
      const rootUrl = 'https://www.facebook.com/v18.0/dialog/oauth';
      const options = {
        redirect_uri: window.location.origin,
        client_id: appId,
        response_type: 'token',
        scope: 'email,public_profile',
        state: 'facebook',
      };
      const qs = new URLSearchParams(options);
      window.location.href = `${rootUrl}?${qs.toString()}`;
      return;
    }

    if (provider === 'twitter') {
      const clientId = process.env.REACT_APP_TWITTER_CLIENT_ID || 'YXBFWk9xdE5MMmt6ZkpiOHV4VFk6MTpjaQ';
      const rootUrl = 'https://twitter.com/i/oauth2/authorize';
      const codeVerifier = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('twitter_code_verifier', codeVerifier);
      const options = {
        response_type: 'code',
        client_id: clientId,
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
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    validateUser(
      usermails,
      users,
      data.get('email'),
      data.get('password'),
      dispatch,
      setAuthedUser,
      navigate,
      setEmailValidateAlert,
      setPassValidateAlert)
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
                autoFocus
              />
              <Grid item xs={12} sx={{ display: "none"}} id="email-validate-alert">
                  <BasicAlerts text={emailValidateAlert} />
              </Grid>
              <img 
                src={eye} 
                style={showPassStyle} 
                alt="show-password"
                id='signin-show-pass'
                onClick={() => showPass('signin-password')}
                />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="signin-password"
                autoComplete="current-password"
                onChange={(e) => {
                    $('#signin-show-pass').show()
                    e.target.value === '' && $('#signin-show-pass').hide()
                    }}
              />
              <Grid item xs={12} sx={{ display: "none"}} id="pass-validate-alert">
                  <BasicAlerts text={passValidateAlert} />
              </Grid>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
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
                  <Link to="/createuser">
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