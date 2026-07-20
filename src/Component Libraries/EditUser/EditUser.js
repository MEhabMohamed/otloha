import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import $ from "jquery";
import Button from '@mui/material/Button';
import { handleEditPassword, handleEditPic, handleEditProfileDetails } from "../../actions/user";
import eye from "../../Resources/eye.png";
import readURL from "../../helpers/getPic";
import { Box, TextField, Container, Grid, Card, CardContent, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, InputAdornment } from "@mui/material";
import cam from "../../Resources/cam.jpg";
import male from "../../Resources/male.jpg";
import female from "../../Resources/female.jpeg";
import BasicAlerts from "../Alert/Alert";
import Locales from "../Language/Language";
import NarrationSelect from "../Narration/Narration";

function EditUser({ users, authedUser }) {
  const dispatch = useDispatch();
  const currentUser = React.useMemo(() => {
    return users[authedUser] || { name: '', avatar: '', gender: 'male', password: '', lang: 'arEG', narration: '', due: 'volunteer', description: 'student' };
  }, [users, authedUser]);

  // Profile Pic State
  const [newPic, setNewPic] = useState('');
  const [picStatus, setPicStatus] = useState('');
  const [picMessage, setPicMessage] = useState('');

  // Profile Details State
  const [name, setName] = useState(currentUser.name || '');
  const [lang, setLang] = useState(currentUser.lang || 'arEG');
  const [narration, setNarration] = useState(currentUser.narration || '');
  const [due, setDue] = useState(currentUser.due || 'volunteer');
  const [detailsStatus, setDetailsStatus] = useState('');
  const [detailsMessage, setDetailsMessage] = useState('');

  // Password State
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passStatus, setPassStatus] = useState('');
  const [passMessage, setPassMessage] = useState('');

  // Sync state if currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setLang(currentUser.lang || 'arEG');
      setNarration(currentUser.narration || '');
      setDue(currentUser.due || 'volunteer');
    }
  }, [currentUser]);

  const handlePicChange = (e) => {
    readURL(e.target, $('#editedPic'), $('#edited-get-pic'), {
      'width': '100%',
      'height': '100%',
      'borderRadius': '50%'
    }, setNewPic);
  };

  const savePic = () => {
    if (!newPic) {
      setPicStatus('error');
      setPicMessage('Please select an image first.');
      return;
    }
    setPicStatus('loading');
    dispatch(handleEditPic(authedUser, newPic))
      .then(() => {
        setPicStatus('success');
        setPicMessage('Profile picture updated successfully!');
      })
      .catch((err) => {
        setPicStatus('error');
        setPicMessage(err.message || 'Failed to update profile picture.');
      });
  };

  const saveDetails = () => {
    if (!name.trim()) {
      setDetailsStatus('error');
      setDetailsMessage('Name cannot be empty.');
      return;
    }
    setDetailsStatus('loading');
    const updateData = {
      id: authedUser,
      name,
      lang,
      ...(currentUser.description === 'student' ? { narration } : { due })
    };
    dispatch(handleEditProfileDetails(updateData))
      .then(() => {
        setDetailsStatus('success');
        setDetailsMessage('Profile details updated successfully!');
      })
      .catch((err) => {
        setDetailsStatus('error');
        setDetailsMessage(err.message || 'Failed to update profile details.');
      });
  };

  const savePassword = () => {
    if (!pass || !confirmPass) {
      setPassStatus('error');
      setPassMessage('Please fill in both password fields.');
      return;
    }
    if (pass.length < 8) {
      setPassStatus('error');
      setPassMessage('Password must be at least 8 characters.');
      return;
    }
    if (pass !== confirmPass) {
      setPassStatus('error');
      setPassMessage('Passwords do not match.');
      return;
    }
    if (pass === currentUser.password) {
      setPassStatus('error');
      setPassMessage('Password is the same as the current password.');
      return;
    }
    setPassStatus('loading');
    dispatch(handleEditPassword(authedUser, pass))
      .then(() => {
        setPassStatus('success');
        setPassMessage('Password updated successfully!');
        setPass('');
        setConfirmPass('');
      })
      .catch((err) => {
        setPassStatus('error');
        setPassMessage(err.message || 'Failed to update password.');
      });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 10 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Account Settings
      </Typography>
      <Grid container spacing={4}>
        {/* Card 1: Profile Picture */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Profile Picture
              </Typography>
              <Box sx={{ position: 'relative', width: 120, height: 120, mb: 3 }}>
                <img
                  id="editedPic"
                  src={currentUser.avatar !== ""
                    ? currentUser.avatar
                    : (currentUser.gender === 'male' ? male : female)}
                  alt="Avatar"
                  style={{
                    borderRadius: '50%',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    border: '3px solid #10B981'
                  }}
                />
                <Box
                  component="label"
                  id="edited-get-pic"
                  sx={{
                    width: 32,
                    height: 32,
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    borderRadius: '50%',
                    backgroundImage: `url(${cam})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  <input
                    type="file"
                    hidden
                    onChange={handlePicChange}
                  />
                </Box>
              </Box>
              {picMessage && (
                <Box sx={{ width: '100%', mt: 1 }}>
                  <BasicAlerts text={picMessage} severity={picStatus === 'success' ? 'success' : 'error'} />
                </Box>
              )}
            </CardContent>
            <Box sx={{ p: 2 }}>
              <Button
                variant="contained"
                fullWidth
                disabled={picStatus === 'loading'}
                onClick={savePic}
              >
                {picStatus === 'loading' ? 'Saving...' : 'Save Image'}
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Card 2: Profile Details */}
        <Grid item xs={12} md={8}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Profile Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Display Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Locales
                    value={lang}
                    select={setLang}
                  />
                </Grid>
                {currentUser.description === 'student' ? (
                  <Grid item xs={12} sm={6}>
                    <NarrationSelect
                      narrate={narration}
                      setter={setNarration}
                      identify="editprofile"
                    />
                  </Grid>
                ) : (
                  <Grid item xs={12} sm={6}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend" sx={{ mb: 1 }}>Teacher Status</FormLabel>
                      <RadioGroup
                        row
                        value={due}
                        onChange={(e) => setDue(e.target.value)}
                      >
                        <FormControlLabel value="paid" control={<Radio />} label="Paid" />
                        <FormControlLabel value="volunteer" control={<Radio />} label="Volunteer" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                )}
                {detailsMessage && (
                  <Grid item xs={12}>
                    <BasicAlerts text={detailsMessage} severity={detailsStatus === 'success' ? 'success' : 'error'} />
                  </Grid>
                )}
              </Grid>
            </CardContent>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                disabled={detailsStatus === 'loading'}
                onClick={saveDetails}
              >
                {detailsStatus === 'loading' ? 'Saving...' : 'Save Details'}
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Card 3: Change Password */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Change Password
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type={showPass ? 'text' : 'password'}
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    InputProps={{
                      endAdornment: pass && (
                        <InputAdornment position="end">
                          <img
                            src={eye}
                            alt="show"
                            style={{ width: 15, height: 15, cursor: 'pointer' }}
                            onClick={() => setShowPass(!showPass)}
                          />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type={showConfirmPass ? 'text' : 'password'}
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    InputProps={{
                      endAdornment: confirmPass && (
                        <InputAdornment position="end">
                          <img
                            src={eye}
                            alt="show"
                            style={{ width: 15, height: 15, cursor: 'pointer' }}
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                          />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                {passMessage && (
                  <Grid item xs={12}>
                    <BasicAlerts text={passMessage} severity={passStatus === 'success' ? 'success' : 'error'} />
                  </Grid>
                )}
              </Grid>
            </CardContent>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                disabled={passStatus === 'loading'}
                onClick={savePassword}
              >
                {passStatus === 'loading' ? 'Updating...' : 'Update Password'}
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

function mapStateToProps({ users, authedUser }) {
  return {
    users,
    authedUser: authedUser !== null ? authedUser[0] : null
  }
}

export default connect(mapStateToProps)(EditUser);