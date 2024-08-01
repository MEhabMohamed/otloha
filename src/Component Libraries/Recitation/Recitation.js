import * as React from 'react';
import { connect } from "react-redux";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import male from '../../Resources/male.jpg';
import female from '../../Resources/female.jpeg';
import { formatDate } from '../../helpers/savers';
import MediaPlayer from '../MediaPlayer/MediaPlayer';
import BasicRating from '../Rating/Rating';
import { Link } from 'react-router-dom';
import mushaf from '../../Resources/mushaf.png';
import star from '../../Resources/star-light.png';
import { handleAddRecitationRating } from '../../actions/recitation';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '8rem',
  maxHeight: '8rem',
  borderRadius: '50%',
});

function Recitation({id}) {

  let ratingSum = 0;

  let users = JSON.parse(localStorage.getItem("users"));
  let recitations = JSON.parse(localStorage.getItem("recitations"));
  let recitation = recitations[id];
  let authedUser = JSON.parse(localStorage.getItem("authedUser")) !== null ? 
  JSON.parse(localStorage.getItem("authedUser"))[0] : null;
  let index = Object.keys(recitations).length - Object.keys(recitations).sort((a, b,) =>
  recitations[b].createdAt - recitations[a].createdAt).indexOf(id);
  recitation.raters.map(({rating}) => ratingSum += rating);

  return (
      <Paper
        sx={{
          maxWidth: "auto",
          pr: 0.5,
          pt: "3px",
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
            <ButtonBase
              sx={{
                width: 70,
                height: 70,
                cursor: "default"
              }}
            >
              <Img
                sx={{
                  width: 70,
                  height: 70
                }}
                alt="complex"
                src={users[recitation.authed].avatar !== ""
                ? users[recitation.authed].avatar
                : (users[recitation.authed].gender === 'male' ? male : female)}
              />
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
              <Grid item container md={5}>
                <Typography variant="body1" fontWeight="bolder">
                  {users[recitation.authed].name}
                </Typography>
                <Grid item mt={0.75}>
                  <BasicRating
                    ratingType={handleAddRecitationRating}
                    rating={ratingSum/recitation.raters.length}
                    rated={((recitation.authed === authedUser)
                      || (users[authedUser].ratedRecitations.includes(id)))}
                    ratedId={id}
                  />
                </Grid>
              </Grid>
              <Grid item container md={7}>
                <Typography variant="body1" color="text.secondary">
                  ID {index}
                </Typography>
                {recitation.remarkable &&
                <Grid
                  item
                  sx={{
                  textAlign: "center"
                  }}
                >
                      <Img sx={{ width: 20, height: 20 }} alt="complex" src={star} />
                </Grid>}
                {users[recitation.authed].description === "student"
                && <Stack variant="body2" sx={{
                  mx: 2,
                }}>
                  {recitation.status === "Pending" ?
                   "Not Evaluated yet!" : 
                   (recitation.status === "Accepted" ?
                  <Typography
                  sx={{
                    background: "rgba(20, 121, 40, 0.55)",
                    font: "bold 12px Georgia, serif",
                    p: 0.5,
                    borderRadius: "25px"
                  }}>
                    {recitation.status}
                  </Typography> : 
                  (recitation.status === "Rejected" ? 
                  <Typography sx={{
                    background: "rgba(134, 8, 19, 0.58)",
                    font: "bold 12px Georgia, serif",
                    p: 0.5,
                    borderRadius: "25px"
                  }}>
                    {recitation.status}
                  </Typography> : 
                  (recitation.status === "Reported" &&
                  <Typography sx={{
                    background: "rgba(134, 56, 8, 0.58)",
                    font: "bold 12px Georgia, serif",
                    p: 0.5,
                    borderRadius: "25px"
                  }}>
                    {recitation.status}
                  </Typography>
                  )))}
                </Stack>}
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
                md: (recitation.status !== "Pending"
                && users[recitation.authed].description === "student")
                ? (recitation.status === "Reported" ? -4 : -9)
                : -2
              }
            }}>
              <Typography variant="body2" color="text.secondary">
                Created at:{formatDate(recitation.createdAt)}
              </Typography>
              {((recitation.evaluatedAt !== "") && (users[recitation.authed].description === "student")) &&
                <Typography variant="body2" color="text.secondary">
                  Evaluated at:{formatDate(recitation.evaluatedAt)}
                </Typography>
              }
              <Typography variant="body2" gutterBottom color="text.secondary">
                From {recitation.verse.from} To {recitation.verse.to}
              </Typography>
              <Typography variant="body2" sx={{ font: 'bold 12px Helvetica, serif'}}>
                {`${recitation.narration} - ${recitation.verse.surah} 
                - From Verse ${recitation.verse.fromNumber} To Verse 
                ${recitation.verse.toNumber}`}
              </Typography>
              {recitation.status === "Reported" && 
                <Typography variant="body2" sx={{
                    background: "rgba(134, 56, 8, 0.58)",
                    textAlign: "center",
                    mt: 1,
                    fontWeight: "bold",
                    p: 1,
                    borderRadius: "25px"
                  }}>
                  {recitation.report}
                </Typography>
              }
            </Grid>
          </Grid>
          <Grid
            item
            xs={11.5}
            md={3.9}
            textAlign='center'
          >
            <Stack
              sx={{ 
                mb: 1,
                alignItems: "center",
              }}
            >
              <MediaPlayer id={id} />
            </Stack>
            {((recitation.teacher !== undefined && recitation.teacher.name !== "")) &&
            <Grid item container mt={1}>
                <Grid item xs={12} md={5} sx={{
                  height: 75,
                  textAlign: "center"
                }}>
                  <ButtonBase
                    sx={{
                      width: 70,
                      height: 70,
                      cursor: "default",
                      marginLeft: authedUser !== id ? "auto" : "1rem"
                    }}
                  >
                    <Img
                      sx={{ width: 70, height: 70 }}
                      alt="teacher-pic"
                      src={(recitation.teacher.name && 
                        users[Object.keys(users)
                       .filter((id) => users[id].name === recitation.teacher.name)
                       .toString()].avatar) !== "" ?
                       URL.createObjectURL(users[Object.keys(users)
                       .filter((id) => users[id].name === recitation.teacher.name)
                       .toString()].avatar) :
                        (recitation.teacher.avatar !== "" ? recitation.teacher.avatar : 
                        (users[Object.keys(users)
                       .filter((id) => users[id].name === recitation.teacher.name)
                       .toString()]
                       .gender === 'male' ? male : female))}
                    />
                  </ButtonBase>
                </Grid>
                <Grid item md={7} xs={12} sx={{
                  textAlign: {
                    md: "left",
                    xs: "center",
                    sm: "center"
                  }
                }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  fontWeight="bolder"
                >
                  Teacher
                </Typography>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  fontWeight="bolder"
                >
                  {recitation.teacher.name}
                </Typography>
                </Grid>
            </Grid>}
          </Grid>
        </Grid>
      </Paper>
  );
}

export default connect()(Recitation)