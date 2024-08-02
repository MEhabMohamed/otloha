import * as React from 'react';
import { connect, useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import TextField from '@mui/material/TextField';
import male from '../../Resources/male.jpg';
import female from '../../Resources/female.jpeg';
import { formatDate } from '../../helpers/savers';
import MediaPlayer from '../MediaPlayer/MediaPlayer';
import Evaluate from '../Evaluation/Evaluation';
import Button from '@mui/material/Button';
import BasicRating from '../Rating/Rating';
import { handleAddRecitationRating, handleEvaluateRecitation } from '../../actions/recitation';
import AlertShow from '../Alert/AlertShow';
import star from '../../Resources/star-light.png';
import $ from 'jquery';
import BasicAlerts from '../Alert/Alert';


const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '8rem',
  maxHeight: '8rem',
  borderRadius: '50%',
});

function RecitationProfile({ id, users, authedUser, recitations }) {

  let [evaluation, setEvaluation] = React.useState('');
  let [report, setReport] = React.useState('');
  let [evaluationAlert, setEvaluationAlert] = React.useState('');

  let index = Object.keys(recitations).length
  - Object.keys(recitations).sort((a, b,) =>
  recitations[b].createdAt - recitations[a].createdAt).indexOf(id);

  let recitation = recitations[id];

  let ratingSum = 0;

  recitation !== null && recitation.raters.map(({rating}) => ratingSum += rating);

  const dispatch = useDispatch();

  function handleEvaluation(e) {
      e.preventDefault();
      if (evaluation !== "") {
        if (evaluation === "Reported") {
          report !== "" ?
          dispatch(handleEvaluateRecitation(
            id,
            authedUser,
            evaluation,
            users[authedUser].name,
            users[authedUser].avatar,
            report))
          : AlertShow(
            $('#evaluation-alert'),
            setEvaluationAlert,
            "Please add report details!")
        } else {
          dispatch(handleEvaluateRecitation(
            id,
            authedUser,
            evaluation,
            users[authedUser].name,
            users[authedUser].avatar,
            report))
        }
      } else {
        AlertShow(
          $('#evaluation-alert'),
          setEvaluationAlert,
          "Please choose an Evaluation!")
      }
  }

  return (
        <Grid
          container
          textAlign="left"
          className='recitation-container'
          sx={{
            mx: 1,
            pt: 12
          }}
        >
           <Grid
            item
            xs={12}
            md={4}
            sx={{
              textAlign: "center"
            }}
          >
            <ButtonBase
              sx={{
                width: 150,
                height: 150,
                cursor: "default"
              }}
            >
              <Img
                sx={{
                  width: 150,
                  height: 150
                }}
                alt="complex"
                src={users[recitation.authed].avatar !== ""
                ? users[recitation.authed].avatar
                : (users[recitation.authed].gender === 'male' ? male : female)} />
            </ButtonBase>
            <Typography variant="subtitle1" sx={{
              fontWeight: "bolder"
            }}>
              {users[recitation.authed].name}
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
            <Typography variant="body2" color="text.secondary">
              ID {index}
            </Typography>
            <Grid item justifyContent="center" container>
              <BasicRating
                ratingType={handleAddRecitationRating}
                rating={ratingSum/recitation.raters.length}
                rated={((recitation.authed === authedUser)
                  || (users[authedUser].ratedRecitations.includes(id)))}
                ratedId={id}
              />
            </Grid>
            {users[recitation.authed].description === "student"
            && <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mx: 2
                  }}
                >
                  {recitation.status === "Pending"
                  ? "Not Evaluated yet!"
                  : recitation.status}
                </Typography>}
            <Typography variant="body2">
              Created at:{formatDate(recitation.createdAt)}
            </Typography>
            {((recitation.evaluatedAt !== "")
            && (users[recitation.authed].description === "student")) &&
            <Typography variant="body2">
               Evaluated at:{formatDate(recitation.evaluatedAt)}
            </Typography>
            }
            {recitation.status === "Reported" &&
            <Typography variant="body2" sx={{
              background: "rgba(134, 56, 8, 0.58)",
              font: "bold 18px Georgia, serif",
              py: 0.5,
              borderRadius: "25px"
            }}>
               {recitation.report}
            </Typography>
            }
            <Typography variant="body2" sx={{ font: 'bold 12px Helvetica, serif'}}>
              {recitation.narration} - {recitation.verse.surah}
            </Typography>
            {recitation.remarkable &&
            <Typography variant="body2" sx={{ font: 'bold 12px Helvetica, serif'}}>
               Remarkable
            </Typography>
            }
          </Grid>
          <Grid
            item
            xs={11.5}
            md={5.5}
            textAlign='center'
          >
            <Typography variant="h5" gutterBottom>
              From {recitation.verse.fullFrom}
            </Typography>
            <Typography variant="h5" gutterBottom>
              To {recitation.verse.fullTo}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {`From Verse ${recitation.verse.fromNumber}
              To Verse ${recitation.verse.toNumber}`}
            </Typography>
            <Stack sx={{ 
              mb: 2,
              alignItems: "center",
            }} >
              <MediaPlayer id={id} />
            </Stack>
            {(users[recitation.authed].description === "student") && ((recitation.status === "Pending") ?
            <Grid item>
              {((users[authedUser].description === "teacher")
              && (users[recitation.authed].description === "student"))
              && <Evaluate evaluate={evaluation} setter={setEvaluation} />}
              {evaluation === "Reported" && <TextField
                    required
                    fullWidth
                    id={`${id.slice(-6)}-recitation-report`}
                    label="Report"
                    name="report"
                    autoComplete="report"
                    onChange={(e) => setReport(e.target.value)}
                    sx={{ mt: 2}}
                  />}
              <Grid item xs={12} sx={{ display: "none"}} id="evaluation-alert">
                <BasicAlerts text={evaluationAlert} />
              </Grid>
              {evaluation !== '' && <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={(e) => handleEvaluation(e)}
              >
                Evaluate
              </Button>}
            </Grid>
            : <Grid item container alignItems="center">
                <Grid item xs={12} md={4} sx={{
                  height: 75,
                  textAlign: {
                    md: "right",
                    sm: "center",
                    xs: "center"
                  },
                }}>
                  <ButtonBase sx={{ width: 70, height: 70, cursor: "default" }}>
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
                        (recitation.teacher.avatar !== ""
                        ? recitation.teacher.avatar : 
                        (users[Object.keys(users)
                       .filter((id) => users[id].name === recitation.teacher.name)
                       .toString()]
                       .gender === 'male' ? male : female))} 
                    />
                  </ButtonBase>
                </Grid>
                <Grid item md={8} xs={12} sx={{
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
            </Grid>)}
          </Grid>
        </Grid>
  );
}

function mapStateToProps({users, authedUser, recitations}) {
  return {
      users,
      authedUser: authedUser !== null ? authedUser[0] : null,
      recitations
  }
}

export default connect(mapStateToProps)(RecitationProfile)