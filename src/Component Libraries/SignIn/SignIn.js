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

function SignInSide() {

  let [emailValidateAlert, setEmailValidateAlert] = React.useState('');
  let [passValidateAlert, setPassValidateAlert] = React.useState('');

  let users = JSON.parse(localStorage.getItem("users"));
  let usermails = users !== (undefined || null)
  ? Object.values(users).map(({email}) => email) : [];
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
              <SocialButton source={google} alternate="google" text="Google" />
              <SocialButton source={fb} alternate="facebook" text="Facebook" />
              <SocialButton source={twitter} alternate="twitter" text="Twitter" />
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