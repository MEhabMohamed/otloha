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
import { Link } from 'react-router-dom';
import mushaf from '../../Resources/mushaf.png';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '8rem',
  maxHeight: '8rem',
  borderRadius: '50%',
});

function Recitation({users, recitation , id, index , authedUser}) {
  return (
      <Paper
        sx={{
          maxWidth: "auto",
          pr: 0.5,
          pt: "3px"
        }}
      >
        <Grid
          container
          textAlign="left"
          className='recitation-container'
          sx={{
            mx: 1,
          }}
        >
          <Grid
            item
            xs={12}
            md={1.5}
            sx={{
              textAlign: "center"
            }}
          >
            <ButtonBase sx={{ width: 70, height: 70, cursor: "default" }}>
              <Img sx={{ width: 70, height: 70 }} alt="complex" src={users[recitation.authed].avatar !== "" ? URL.createObjectURL(users[recitation.authed].avatar) : (users[recitation.authed].gender === 'male' ? male : female)} />
            </ButtonBase>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6.5}
            container
          >
            <Grid item container>
              <Grid item md={4}>
                <Typography variant="body2">
                  {users[recitation.authed].name}
                </Typography>
              </Grid>
              <Grid item container md={8}>
                <Typography variant="body2" color="text.secondary">
                  ID {index}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                  mx: 2,
                }}>
                  {recitation.status === "Pending" ? "Not Evaluated yet!" : recitation.status}
                </Typography>
                <Link to={`./${id}`}>
                  <img
                  src={mushaf}
                  alt='mushaf'
                  style={{
                    width: '30px',
                    height: '30px',
                    marginTop: "-5px"
                  }}
                />
                </Link>
              </Grid>
            </Grid>
            <Grid item sx={{
              mt: {
                md: recitation.teacher.name !== "" && -8
              }
            }}>
              <Typography variant="body2">
                Created at:{formatDate(recitation.createdAt)}
              </Typography>
              <Typography variant="body2" gutterBottom>
                From {recitation.verse.from} To {recitation.verse.to}
              </Typography>
              <Typography variant="body2" sx={{ font: 'bold 12px Helvetica, serif'}}>
                {recitation.narration} - {recitation.verse.surah} - From Verse {recitation.verse.fromNumber} To Verse {recitation.verse.toNumber}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            item
            xs={11.5}
            md={3.9}
            textAlign='center'
          >
            <MediaPlayer id={id} />
            {recitation.teacher.name !== "" &&
            <Grid item container mt={1}>
                <Grid item xs={12} md={4} sx={{
                  height: 75,
                  textAlign: "center"
                }}>
                  <ButtonBase sx={{ width: 70, height: 70, cursor: "default", marginLeft: authedUser !== id ? "auto" : "1rem" }}>
                    <Img sx={{ width: 70, height: 70 }} alt="teacher-pic" src={recitation.teacher.avatar !== "" ? URL.createObjectURL(recitation.teacher.avatar) : (users[Object.keys(users).filter((id) => users[id].name === recitation.teacher.name).toString()].gender === 'male' ? male : female)} />
                  </ButtonBase>
                </Grid>
                <Grid item md={8} xs={12} sx={{
                  textAlign: {
                    md: "left",
                    xs: "center",
                    sm: "center"
                  }
                }}>
                <Typography variant="subtitle2" gutterBottom>
                  Teacher
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  {recitation.teacher.name}
                </Typography>
                </Grid>
            </Grid>}
          </Grid>
        </Grid>
      </Paper>
  );
}

function mapStateToProps ({users , recitations, authedUser}, {id}) {
    return {
        users,
        id,
        recitation: recitations[id],
        authedUser: authedUser !== null ? authedUser[0] : null,
    }
};

export default connect(mapStateToProps)(Recitation)