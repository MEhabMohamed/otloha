import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Copyright from '../Copyright/Copyright';
import { useDispatch } from 'react-redux';
import $ from 'jquery';
import { Input, Paper } from '@mui/material';
import CountrySelector from '../CountrySelect/CountrySelector';
import NarrationSelect from '../Narration/Narration';
import { useNavigate } from 'react-router-dom';
import { addUser } from "../../actions/user";
import { setAuthedUser } from "../../actions/authedUsers";
import BasicAlerts from '../Alert/Alert';
import Locales from '../Language/Language';
import DatePick from '../Date/DatePicker';
import AlertShow from '../Alert/AlertShow';

export default function CompleteProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [profile, setProfile] = React.useState(null);
  const [gender, setGender] = React.useState('');
  const [role, setRole] = React.useState('');
  const [due, setDue] = React.useState('');
  const [narration, setNarration] = React.useState('');
  const [country, setCountry] = React.useState(null);
  const [lang, setLang] = React.useState('enUS');
  const [bDate, setBDate] = React.useState(null);
  const [alertText, setAlertText] = React.useState('');

  React.useEffect(() => {
    const profileStr = sessionStorage.getItem('onboarding_profile');
    if (!profileStr) {
      navigate('/');
      return;
    }
    setProfile(JSON.parse(profileStr));
  }, [navigate]);

  if (!profile) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!gender || !role || !country || !bDate) {
      AlertShow($('#onboarding-alert'), setAlertText, "Please complete all inputs!");
      return;
    }

    const payload = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
      gender,
      country,
      description: role,
      narration: role === 'student' ? narration : null,
      lang,
      bDate: String(Date.parse(bDate)),
      due: role === 'teacher' ? due : null
    };

    try {
      const endpoint = profile.provider === 'facebook' ? '/api/auth/facebook-register' : '/api/auth/google-register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Onboarding failed');
      }

      const data = await response.json();
      
      // Dispatch actions to sync Redux store
      dispatch(addUser(data.user));
      dispatch(setAuthedUser(data.id));
      localStorage.setItem("authedUser", JSON.stringify([data.id, Date.now()]));

      // Clear onboarding session storage
      sessionStorage.removeItem('onboarding_profile');

      navigate('/');
    } catch (err) {
      console.error(err);
      AlertShow($('#onboarding-alert'), setAlertText, "Registration failed, please try again.");
    }
  };

  return (
    <Container component={Paper} maxWidth="xs" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          py: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar 
          src={profile.avatar} 
          sx={{ width: 80, height: 80, mb: 2, border: '2px solid #1976d2' }} 
        />
        <Typography component="h1" variant="h5">
          Complete Profile
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Welcome {profile.name}! Please fill in the rest of your details to complete registration.
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <Grid container spacing={2}>
            
            {/* Gender Selection */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                Gender:
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <Input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === 'male'}
                    onChange={(e) => setGender(e.target.value)}
                    disableUnderline
                  />
                  &nbsp;Male
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <Input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === 'female'}
                    onChange={(e) => setGender(e.target.value)}
                    disableUnderline
                  />
                  &nbsp;Female
                </label>
              </Box>
            </Grid>

            {/* Role Selection */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                I am a:
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <Input
                    type="radio"
                    name="role"
                    value="student"
                    checked={role === 'student'}
                    onChange={(e) => {
                      setRole(e.target.value);
                      $('#teacher-extra').hide();
                      $('#student-extra').show();
                    }}
                    disableUnderline
                  />
                  &nbsp;Student
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <Input
                    type="radio"
                    name="role"
                    value="teacher"
                    checked={role === 'teacher'}
                    onChange={(e) => {
                      setRole(e.target.value);
                      $('#student-extra').hide();
                      $('#teacher-extra').show();
                    }}
                    disableUnderline
                  />
                  &nbsp;Teacher
                </label>
              </Box>
            </Grid>

            {/* Teacher Specific Fields */}
            <Grid
              item
              xs={12}
              id="teacher-extra"
              sx={{ display: 'none' }}
            >
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                Teacher Compensation:
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <Input
                    type="radio"
                    name="due"
                    value="paid"
                    checked={due === 'paid'}
                    onChange={(e) => setDue(e.target.value)}
                    disableUnderline
                  />
                  &nbsp;Paid
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <Input
                    type="radio"
                    name="due"
                    value="volunteer"
                    checked={due === 'volunteer'}
                    onChange={(e) => setDue(e.target.value)}
                    disableUnderline
                  />
                  &nbsp;Volunteer
                </label>
              </Box>
            </Grid>

            {/* Student Specific Fields */}
            <Grid
              item
              xs={12}
              id="student-extra"
              sx={{ display: 'none' }}
            >
              <NarrationSelect
                narrate={narration}
                setter={setNarration}
                identify="onboarding"
              />
            </Grid>

            {/* Country Selector */}
            <Grid item xs={12}>
              <CountrySelector
                importance={true}
                value={country}
                select={setCountry}
                identify="onboarding"
              />
            </Grid>

            {/* Language Selector */}
            <Grid item xs={12}>
              <Locales
                value={lang}
                select={setLang}
              />
            </Grid>

            {/* Date of Birth Picker */}
            <Grid item xs={12} textAlign="center">
              <DatePick
                value={bDate}
                choose={setBDate}
                label="Birth Date:"
                setWidth="100%"
              />
            </Grid>

            {/* Alert Box */}
            <Grid
              item
              xs={12}
              sx={{ display: 'none' }}
              id="onboarding-alert"
            >
              <BasicAlerts text={alertText} />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Complete Registration
          </Button>
        </Box>
      </Box>
      <Copyright sx={{ pb: 4 }} />
    </Container>
  );
}
