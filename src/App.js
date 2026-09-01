import { BrowserRouter as Router, Route, Routes, Outlet, Navigate }
from 'react-router-dom';
import { connect } from 'react-redux';
import React, { useEffect, useRef, useState } from 'react';
import handleInitialData from './actions/shared';
import TeacherDashboard from './components/TeacherDashboard';
import RecitationDashboard from './components/RecitationDashboard';
import NewRecitation from './Component Libraries/NewRecitation/NewRecitation';
import SignUp from './Component Libraries/SignUp/SignUp';
import SignInSide from './Component Libraries/SignIn/SignIn';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppAppBar from './Component Libraries/AppBar/AppAppBar';
import getLPTheme from './helpers/getLPTheme';
import dark from './Resources/dark-bg.jpg';
import light from './Resources/light-bg.jpg';
import StudentDashboard from './components/StudentDashboard';
import HomePage from './components/HomePage';
import useMediaQuery from '@mui/material/useMediaQuery';
import RecitationProfile from './Component Libraries/Recitation/RecitationProfile';
import BlockList from './Component Libraries/BlockList/BlockList';
import SetNewAdmin from './Component Libraries/AddRemoveAdmin/AddRemoveAdmin';
import TajweedLevels from './Component Libraries/Tajweed/Levels';
import TajweedLessons from './Component Libraries/Tajweed/Lessons';
import AddLevel from './Component Libraries/Tajweed/AddLevel';
import EditLevel from './Component Libraries/Tajweed/EditLevel';
import AddLesson from './Component Libraries/Tajweed/AddLesson';
import EditLesson from './Component Libraries/Tajweed/EditLesson';

import { setAuthedUser } from './actions/authedUsers';
import { handleAddStudent } from './actions/user';
import { jwtDecode } from 'jwt-decode';

const PrivateWrapper = ({ auth: isAuthenticated }) => {
  if (isAuthenticated !== null) {
    return <Outlet />
  } 
    else { return <Navigate to="/" replace={true} />
  }
}

function NotFound () {
  return (
    <p id='not-found'>Error 404: Not Found</p>
    )
}

function App({ initial, authedUser, recitations, levels, lessons, users, dispatch }) {

  const isAuthed = authedUser;
  let checkAuth = useRef(null);
  let [auth, setAuth] = useState(null);
  checkAuth.current = auth;
  const [mode, setMode] = useState('light');
  const LPtheme = createTheme(getLPTheme(mode));
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    initial().then(async () => {
      const hash = window.location.hash.startsWith('#')
        ? window.location.hash.substring(1)
        : window.location.hash;
      const hashParams = new URLSearchParams(hash);
      const searchParams = new URLSearchParams(window.location.search);

      const idToken = hashParams.get('id_token') || searchParams.get('id_token');
      const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
      const code = searchParams.get('code') || hashParams.get('code');
      const state = hashParams.get('state') || searchParams.get('state') || 'google';

      if (idToken || accessToken || code) {
        window.history.replaceState({}, document.title, window.location.pathname);

        let profileName = '';
        let profileEmail = '';
        let profileAvatar = '';
        let profileId = '';

        if (idToken) {
          try {
            const decoded = jwtDecode(idToken);
            if (decoded) {
              profileName = decoded.name || `${decoded.given_name || ''} ${decoded.family_name || ''}`.trim();
              profileEmail = decoded.email || '';
              profileAvatar = decoded.picture || '';
              profileId = decoded.sub || '';
            }
          } catch (e) {
            console.error('Error decoding ID token:', e);
          }
        }

        if (accessToken) {
          if (state === 'google' && (!profileName || !profileAvatar || !profileEmail)) {
            try {
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` }
              });
              if (res.ok) {
                const data = await res.json();
                profileName = profileName || data.name || `${data.given_name || ''} ${data.family_name || ''}`.trim();
                profileEmail = profileEmail || data.email || '';
                profileAvatar = profileAvatar || data.picture || '';
                profileId = profileId || data.sub || '';
              }
            } catch (e) {
              console.error('Error fetching Google user info:', e);
            }
          } else if (state === 'facebook') {
            try {
              const res = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`);
              if (res.ok) {
                const data = await res.json();
                profileName = data.name || profileName;
                profileEmail = data.email || profileEmail;
                profileAvatar = data.picture?.data?.url || profileAvatar;
                profileId = data.id || profileId;
              }
            } catch (e) {
              console.error('Error fetching Facebook user info:', e);
            }
          }
        }

        let userId = '';
        if (profileEmail) {
          userId = profileEmail.split('@')[0].replace(/\s+/g, '').trim().toLowerCase();
        } else if (profileId) {
          userId = `${state}_${profileId}`;
        } else {
          userId = `${state}_user`;
        }

        const finalName = profileName || `${state.charAt(0).toUpperCase() + state.slice(1)} User`;
        const finalEmail = profileEmail || `${userId}@gmail.com`;
        const finalAvatar = profileAvatar || '';

        dispatch(
          handleAddStudent(
            userId,
            finalName,
            'social_password',
            { code: 'EG', label: 'Egypt', phone: '20' },
            'student',
            finalEmail,
            'male',
            finalAvatar,
            'Hafs',
            'arEG',
            Date.now()
          )
        ).then(() => {
          dispatch(setAuthedUser(userId));
        });
      }
    });
  }, [initial, dispatch]);

  useEffect(() => {
    setAuth(isAuthed);
    setMode(prefersDarkMode ? 'dark' : 'light');
  }, [isAuthed, prefersDarkMode]);
  
  return (
    <ThemeProvider theme={LPtheme}>
      <CssBaseline />
      <Router>
        <AppAppBar mode={mode} toggleColorMode={toggleColorMode} auth={isAuthed}/>
          <Box sx={(theme) => ({
              width: '100%',
              backgroundImage:
                theme.palette.mode === 'light'
                  ? `url(${light})`
                  : `url(${dark})`,
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
              backgroundSize: 'cover'
            })}>
          <Routes>
            {isAuthed === null && <Route path='/createuser' element={<SignUp />} />}
            {isAuthed === null && <Route path='/' element={<SignInSide />} />}
            <Route element={<PrivateWrapper auth={isAuthed}/>}>
              <Route path='*' element={<NotFound />} />
              <Route path='/' element={<HomePage theme={mode} />} />
              <Route path='/createuser' element={<SignUp />} />
              <Route path='/new-recitation' element={<NewRecitation />} />
              <Route path='new-admin' element={<SetNewAdmin /> } />
              <Route path='/teachers' element={<TeacherDashboard />} />
              <Route path='/students' element={<StudentDashboard />} />
              <Route path='/recitations' element={<RecitationDashboard />} />
              <Route path='/blocked' element={<BlockList />} />
              <Route path='/tajweed/levels' element={<TajweedLevels />} />
              <Route path='/tajweed/lessons' element={<TajweedLessons />} />
              <Route path='/tajweed/level' element={<AddLevel />} />
              <Route path='/tajweed/lesson' element={<AddLesson />} />
              {levels.map((level) => {
                return <Route path={`/tajweed/edit-level/${level.id}`}
                element={<EditLevel id={level.id} />} />
              })}
              {lessons.map((lesson) => {
                return <Route path={`/tajweed/edit-lesson/${lesson.id}`}
                element={<EditLesson id={lesson.id} />} />
              })}
              {recitations.map((id =>
                <Route
                  path={`/recitations/${id}`}
                  key={id}
                  element={<RecitationProfile id={id}/>}
                />
              ))}
            </Route>
          </Routes>
          </Box>
      </Router>
    </ThemeProvider>
  );
}

function mapStateToProps({ authedUser, admins, recitations, tajweed, users }) {
  return {
    authedUser: authedUser !== null ? authedUser[0] : null,
    admins: Object.keys(admins),
    recitations: Object.keys(recitations),
    levels: tajweed.levels !== undefined ? Object.values(tajweed.levels) : [],
    lessons: tajweed.lessons !== undefined ? Object.values(tajweed.lessons) : [],
    users: users || {}
  }
}

function mapDispatchToProps (dispatch) {
  return {
    initial: () => dispatch(handleInitialData()),
    dispatch
  }
}

export default connect(mapStateToProps , mapDispatchToProps)(App);
