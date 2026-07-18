import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import handleInitialData from './actions/shared';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppAppBar from './Component Libraries/AppBar/AppAppBar';
import getLPTheme from './helpers/getLPTheme';
import dark from './Resources/dark-bg.jpg';
import light from './Resources/light-bg.jpg';
import useMediaQuery from '@mui/material/useMediaQuery';

const TeacherDashboard = lazy(() => import('./components/TeacherDashboard'));
const RecitationDashboard = lazy(() => import('./components/RecitationDashboard'));
const NewRecitation = lazy(() => import('./Component Libraries/NewRecitation/NewRecitation'));
const SignUp = lazy(() => import('./Component Libraries/SignUp/SignUp'));
const SignInSide = lazy(() => import('./Component Libraries/SignIn/SignIn'));
const StudentDashboard = lazy(() => import('./components/StudentDashboard'));
const CompleteProfile = lazy(() => import('./Component Libraries/SignUp/CompleteProfile'));
const HomePage = lazy(() => import('./components/HomePage'));
const RecitationProfile = lazy(() => import('./Component Libraries/Recitation/RecitationProfile'));
const BlockList = lazy(() => import('./Component Libraries/BlockList/BlockList'));
const SetNewAdmin = lazy(() => import('./Component Libraries/AddRemoveAdmin/AddRemoveAdmin'));
const TajweedLevels = lazy(() => import('./Component Libraries/Tajweed/Levels'));
const TajweedLessons = lazy(() => import('./Component Libraries/Tajweed/Lessons'));
const AddLevel = lazy(() => import('./Component Libraries/Tajweed/AddLevel'));
const EditLevel = lazy(() => import('./Component Libraries/Tajweed/EditLevel'));
const AddLesson = lazy(() => import('./Component Libraries/Tajweed/AddLesson'));
const EditLesson = lazy(() => import('./Component Libraries/Tajweed/EditLesson'));

const PrivateWrapper = ({ auth: isAuthenticated }: { auth: any }) => {
  if (isAuthenticated !== null) {
    return <Outlet />;
  } else {
    return <Navigate to="/" replace={true} />;
  }
};

function NotFound() {
  return <p id="not-found">Error 404: Not Found</p>;
}

function App({ initial, authedUser, recitations, levels, lessons }: any) {
  const isAuthed = authedUser;
  let checkAuth = useRef<any>(null);
  let [auth, setAuth] = useState<any>(null);
  checkAuth.current = auth;
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const LPtheme = createTheme(getLPTheme(mode) as any);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initial()
      .then(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        if (code) {
          window.history.replaceState({}, document.title, window.location.pathname);
          setLoading(true);
          const isFacebook = state === 'facebook';
          const endpoint = isFacebook ? '/api/auth/facebook-login' : '/api/auth/google-login';
          
          fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          })
            .then((res) => {
              if (!res.ok) throw new Error(`${isFacebook ? 'Facebook' : 'Google'} OAuth failed`);
              return res.json();
            })
            .then((data) => {
              if (data.registered) {
                initial().then(() => setLoading(false)).catch(() => setLoading(false));
              } else {
                sessionStorage.setItem('onboarding_profile', JSON.stringify({
                  id: data.id,
                  name: data.profile.name,
                  email: data.profile.email,
                  avatar: data.profile.avatar,
                  provider: isFacebook ? 'facebook' : 'google',
                }));
                window.location.href = '/complete-profile';
              }
            })
            .catch((err) => {
              console.error(err);
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [initial]);

  useEffect(() => {
    setAuth(isAuthed);
    prefersDarkMode ? setMode('dark') : setMode('light');
  }, [isAuthed, prefersDarkMode]);

  if (loading) {
    return (
      <ThemeProvider theme={LPtheme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            width: '100vw',
            backgroundColor: mode === 'light' ? '#f4f6f8' : '#090a0f',
            color: mode === 'light' ? '#090a0f' : '#ffffff',
          }}
        >
          <CircularProgress size={50} thickness={4} sx={{ mb: 2 }} />
          <Typography sx={{ fontWeight: 500, letterSpacing: 1 }}>
            LOADING OTLOHA...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={LPtheme}>
      <CssBaseline />
      <Router>
        <AppAppBar mode={mode} toggleColorMode={toggleColorMode} auth={isAuthed} />
        <Box
          sx={(theme) => ({
            width: '100%',
            backgroundImage:
              theme.palette.mode === 'light' ? `url(${light})` : `url(${dark})`,
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
          })}
        >
          <Suspense fallback={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '80vh',
                width: '100vw',
              }}
            >
              <CircularProgress size={40} thickness={4} />
            </Box>
          }>
            <Routes>
              {isAuthed === null && <Route path="/createuser" element={<SignUp />} />}
              {isAuthed === null && <Route path="/" element={<SignInSide />} />}
              {isAuthed === null && <Route path="/complete-profile" element={<CompleteProfile />} />}
              <Route element={<PrivateWrapper auth={isAuthed} />}>
                <Route path="*" element={<NotFound />} />
                <Route path="/" element={<HomePage theme={mode} />} />
                <Route path="/createuser" element={<SignUp />} />
                <Route path="/complete-profile" element={<CompleteProfile />} />
                <Route path="/new-recitation" element={<NewRecitation />} />
                <Route path="new-admin" element={<SetNewAdmin />} />
                <Route path="/teachers" element={<TeacherDashboard />} />
                <Route path="/students" element={<StudentDashboard />} />
                <Route path="/recitations" element={<RecitationDashboard />} />
                <Route path="/blocked" element={<BlockList />} />
                <Route path="/tajweed/levels" element={<TajweedLevels />} />
                <Route path="/tajweed/lessons" element={<TajweedLessons />} />
                <Route path="/tajweed/level" element={<AddLevel />} />
                <Route path="/tajweed/lesson" element={<AddLesson />} />
                <Route path="/tajweed/edit-level/:id" element={<EditLevel id={undefined as any} />} />
                <Route path="/tajweed/edit-lesson/:id" element={<EditLesson id={undefined as any} />} />
                <Route path="/recitations/:id" element={<RecitationProfile id={undefined as any} />} />
              </Route>
            </Routes>
          </Suspense>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

function mapStateToProps({ authedUser, admins, recitations, tajweed }: any) {
  return {
    authedUser: authedUser !== null ? authedUser[0] : null,
    admins: Object.keys(admins),
    recitations: Object.keys(recitations),
    levels: tajweed.levels !== undefined ? Object.values(tajweed.levels) : [],
    lessons: tajweed.lessons !== undefined ? Object.values(tajweed.lessons) : [],
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    initial: () => dispatch(handleInitialData()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
