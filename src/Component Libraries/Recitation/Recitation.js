import * as React from 'react';
import { connect } from "react-redux";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import male from '../../Resources/male.jpg';
import female from '../../Resources/female.jpeg';
import { formatDate } from '../../helpers/savers';
import MediaPlayer from '../MediaPlayer/MediaPlayer';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '8rem',
  maxHeight: '8rem',
  borderRadius: '50%',
});

function Recitation({users, recitation , id}) {
  return (
      <Paper
        sx={{
          p: 1,
          margin: 1,
          maxWidth: "auto",
          flexGrow: 1,
        }}
      >
        <Grid container spacing={2} maxWidth="xs" textAlign="left" className='recitation-container'>
          <Grid item>
            <ButtonBase sx={{ width: 70, height: 70, cursor: "default", marginLeft: "auto" }}>
              <Img sx={{ width: 70, height: 70 }} alt="complex" src={users[recitation.authed].avatar !== "" ? URL.createObjectURL(users[recitation.authed].avatar) : (users[recitation.authed].gender === 'male' ? male : female)} />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1" component="div">
                  {users[recitation.authed].name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Created at:{formatDate(recitation.createdAt)}
                </Typography>
                <Typography variant="body2">
                  From {recitation.verse.from} To {recitation.verse.to}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" sx={{ font: 'bold 12px Helvetica, serif'}}>
                  {recitation.narration} - {recitation.verse.surah} - From Verse {recitation.verse.fromNumber} To Verse {recitation.verse.toNumber}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={4} textAlign='center'>
                  <MediaPlayer id={id} />
            </Grid>
          </Grid>
        </Grid>
      </Paper>
  );
}

function mapStateToProps ({users , recitations}, {id}) {
    return {
        users,
        id,
        recitation: recitations[id]
    }
};

export default connect(mapStateToProps)(Recitation)