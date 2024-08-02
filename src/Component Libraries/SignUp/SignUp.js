import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Copyright from '../Copyright/Copyright';
import { connect, useDispatch } from 'react-redux';
import readURL from '../../helpers/getPic';
import cam from '../../Resources/cam.jpg'
import $ from 'jquery';
import { Input, Paper } from '@mui/material';
import CountrySelector from '../CountrySelect/CountrySelector';
import NarrationSelect from '../Narration/Narration';
import { Link, useNavigate } from 'react-router-dom';
import showPass from '../../helpers/showpass';
import eye from '../../Resources/eye.png';
import handleNewUser from './handelNewUser';
import { handleAddStudent, handleAddTeacher } from "../../actions/user";
import BasicAlerts from '../Alert/Alert';
import Locales from '../Language/Language';
import DatePick from '../Date/DatePicker';
import AlertShow from '../Alert/AlertShow';

const userPic = {
  borderRadius: '50%',
  display: 'none'
}

const showPassStyle = {
  width: '15px',
  height: '15px',
  cursor: 'pointer',
  position: 'absolute',
  marginTop: '0.8rem',
  marginLeft: '25.1rem',
  display: 'none'
}

function SignUp() {

    let [newFirstName, setnewFirstName] = React.useState('');
    let [newLastName, setnewLastName] = React.useState('');
    let [newPass, setnewPass] = React.useState('');
    let [newEmail, setnewEmail] = React.useState('');
    let [newPic, setNewPic] = React.useState('');
    let [newCountry, setnewCountry] = React.useState(null);
    let [narration, setNarration] = React.useState('');
    let [lang, setLang] = React.useState('arEG');
    let [bDate, setBDate] = React.useState(null);
    let [emailAlert, setEmailAlert] = React.useState('');
    let [passAlert, setPassAlert] = React.useState('');
    let users = JSON.parse(localStorage.getItem("users"));
    let usermails = users !== (undefined || null)
    ? Object.values(users).map(({email}) => email) : [];
    const dispatch = useDispatch();
    const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = newFirstName.concat(` ${newLastName}`);
    if (usermails.includes(newEmail)) {
        AlertShow($('#email-alert'), setEmailAlert, "Email already registered!")
    } else if (data.get('description') === "teacher") {
      handleNewUser(
        username,
        newPass,
        newCountry,
        data.get('description'),
        newEmail, newPic,
        data.get('gender'),
        dispatch,
        navigate,
        handleAddTeacher,
        data.get('due'),
        setEmailAlert,
        setPassAlert,
        lang,
        Date.parse(bDate
      ))
    } else {
      handleNewUser(
        username,
        newPass,
        newCountry,
        data.get('description'),
        newEmail, newPic,
        data.get('gender'),
        dispatch,
        navigate,
        handleAddStudent,
        narration,
        setEmailAlert,
        setPassAlert,
        lang,
        Date.parse(bDate)
      )
    }
  };

  const handleChange = (e) => {
    readURL(e.target, $('#newPic'), $('#get-pic'), {
      'width': '2rem',
      'height': '2rem',
      'position': 'absolute',
      'margin': '4rem 0 2rem -1.5rem'
  }, setNewPic)
  }

  return (
      <Container
        component={Paper}
        maxWidth="xs"
      >
        <Box
          sx={{
            py: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} textAlign="center">
                <img 
                  id="newPic" 
                  src="#" 
                  alt="no internet :(" 
                  style={userPic}
                  />
                <Box
                  variant="contained"
                  component="label"
                  id='get-pic'
                  sx={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    backgroundImage: `url(${cam})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="file"
                    hidden
                    onChange={handleChange}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={(e) => setnewFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={(e) => setnewLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e) => setnewEmail(e.target.value)}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "none"}}
                id="email-alert"
              >
                  <BasicAlerts text={emailAlert} />
              </Grid>
              <Grid
                item
                xs={12}
                justifyContent="center"
                container
                direction="row">
                <Input
                  type="radio"
                  name="gender"
                  value="male"
                  disableUnderline
                  sx={{ mx: 1 }}
                />
                  <Typography>
                    Male
                  </Typography>
                <Input
                  type="radio"
                  name="gender"
                  value="female"
                  disableUnderline
                  sx={{ mr: 1 , ml: 5 }}
                />
                  <Typography>
                    Female
                  </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                justifyContent="center"
                container
                direction="row">
                <Input
                  type="radio"
                  name="description"
                  value="teacher"
                  disableUnderline
                  sx={{ mx: 1 }} 
                  onClick={() => {
                  $('#teacher-type').css({'display': 'flex'})
                  $('#narrate').hide()
                  }}
                />
                  <Typography>
                    Teacher
                  </Typography>
                <Input
                  type="radio" 
                  name="description" 
                  value="student" 
                  disableUnderline 
                  sx={{ mr: 1 , ml: 5 }} 
                  onClick={() => {
                    $('#teacher-type').css({'display': 'none'})
                    $('#narrate').show()
                  }}  
                />
                  <Typography>
                    Student
                  </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                justifyContent="center"
                container
                direction="row"
                sx={{ display: "none" }}
                id="teacher-type"
              >
                <Input
                  type="radio"
                  name="due"
                  value="paid"
                  disableUnderline
                  sx={{ mx: 1 }}
                />
                  <Typography>
                    Paid
                  </Typography>
                <Input
                  type="radio"
                  name="due"
                  value="volunteer"
                  disableUnderline
                  sx={{ mr: 1 , ml: 5 }}
                />
                  <Typography>
                    Volunteer
                  </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "none"}}
                id="narrate"
              >
                <NarrationSelect
                  narrate={narration}
                  setter={setNarration}
                  identify="signup"
                />
              </Grid>
              <Grid item xs={12}>
                <CountrySelector
                  importance={true}
                  value={newCountry}
                  select={setnewCountry}
                  identify="signup"
                />
              </Grid>
              <Grid item xs={12}>
                <Locales
                  value={lang}
                  select={setLang}
                />
              </Grid>
              <Grid
                item
                xs={12}
                textAlign="center"
              >
                <DatePick
                  value={bDate}
                  choose={setBDate}
                  label="Birth Date:"
                  setWidth="100%"
                />
              </Grid>
              <Grid item xs={12}>
                <img 
                src={eye} 
                style={showPassStyle} 
                alt="show-password"
                id='signup-show-pass'
                onClick={() => showPass('signup-password')}
                />
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="signup-password"
                  autoComplete="new-password"
                  onChange={(e) => {
                    $('#signup-show-pass').show()
                    e.target.value === '' && $('#signup-show-pass').hide()
                    return setnewPass(e.target.value)}}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: "none"}} id="pass-alert">
                  <BasicAlerts text={passAlert} />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
  );
}

export default connect()(SignUp)