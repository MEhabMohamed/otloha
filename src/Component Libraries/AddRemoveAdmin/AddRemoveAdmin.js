import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Copyright from '../Copyright/Copyright';
import { connect, useDispatch } from 'react-redux';
import { Paper } from '@mui/material';
import AdminSelector from './AdminSelector';
import { handleAddAdmin, handleDeleteAdmin } from '../../actions/admin';
import AdminRemover from './AdminRemover';

function SetNewAdmin() {

  let [adminEmail, setAdminEmail] = React.useState('');
  let [removeEmail, setRemoveEmail] = React.useState('');
  console.log(removeEmail)

  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    adminEmail !== "" && dispatch(handleAddAdmin(adminEmail));
    setAdminEmail("");
  };

  const handleRemove = (event) => {
    event.preventDefault();
    removeEmail !== "" 
    && dispatch(
      handleDeleteAdmin(removeEmail
        .split('@')[0].replace(/\s+/g, '').trim().toLowerCase())
    );
    setRemoveEmail("");
  };

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
            Set or Remove Admin
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{
              mt: 3,
              width: "100%"
            }}
          >
            <Grid
              container
              spacing={1}
              direction="column"
            >
              <Grid item xs={12}>
                <AdminSelector
                  value={adminEmail}
                  select={setAdminEmail}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Set admin
                </Button>
              </Grid>
            </Grid>
            <Grid item textAlign="center">
              <Typography
                variant='subtitle2'
                color="text.secondary"
              >
                Or
              </Typography>
            </Grid>
            <Grid
              container
              spacing={1}
              direction="column"
            >
              <Grid item xs={12}>
                <AdminRemover
                  value={removeEmail}
                  select={setRemoveEmail}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={handleRemove}
                >
                  Remove admin
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
  );
}

export default connect()(SetNewAdmin)