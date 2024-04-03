import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from 'react-router-dom';
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
import Recitation from './Component Libraries/Recitation/Recitation';
import StudentDashboard from './components/StudentDashboard';
import HomePage from './components/HomePage';

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

function App({ authedUser , initial , recitations }) {

  const isAuthed = authedUser;
  let checkAuth = useRef(null);
  let [auth, setAuth] = useState(null);
  checkAuth.current = auth;
  const [mode, setMode] = useState('light');
  const LPtheme = createTheme(getLPTheme(mode));

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {

      setAuth(isAuthed);
      
      return () => {
        initial();
      }
      
  }, [isAuthed, initial])
  
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
              backgroundSize: '100%'
            })}>
          <Routes>
            {isAuthed === null && <Route path='/createuser' element={<SignUp />} />}
            {isAuthed === null && <Route path='/' element={<SignInSide />} />}
            <Route element={<PrivateWrapper auth={isAuthed}/>}>
              <Route path='*' element={<NotFound />} />
                <Route path='/' element={<HomePage />} />
                <Route path='/createuser' element={<SignUp />} />
                <Route path='/new-recitation' element={<NewRecitation />} />
                <Route path='/teacher-dashboard' element={<TeacherDashboard />} />
                <Route path='/student-dashboard' element={<StudentDashboard />} />
                <Route path='/recitations' element={<RecitationDashboard theme={LPtheme}/>} />
                {recitations.map((id => <Route path={`/recitations/${id}`} key={id} element={<Recitation />} />))}
            </Route>
          </Routes>
          </Box>
      </Router>
    </ThemeProvider>
  );
}

function mapStateToProps({ authedUser , admins , recitations }) {
  return {
    authedUser: authedUser !== null ? authedUser[0] : null,
    admins: Object.keys(admins),
    recitations: Object.keys(recitations)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    initial: () => dispatch(handleInitialData())
  }
}

export default connect(mapStateToProps , mapDispatchToProps)(App);
