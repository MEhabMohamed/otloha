import * as React from 'react';
import { connect, useDispatch } from "react-redux";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import male from '../../Resources/male.jpg';
import female from '../../Resources/female.jpeg';
import { Button, Container, Input } from '@mui/material';
import StatsFormer from '../StatsFormer/StatsFormer';
import pending from '../../Resources/waiting.png';
import accept from '../../Resources/accept.png';
import reject from '../../Resources/reject.png';
import report from '../../Resources/report.png';
import earning from '../../Resources/earning.png';
import due from '../../Resources/due.png';
import heart from '../../Resources/heart.png';
import total from '../../Resources/blue-circle.png';
import maleSymbol from '../../Resources/male-symbol.png';
import femaleSymbol from '../../Resources/female-symbol.png';
import LongMenu from '../DottedMenu/DottedMenu';
import BasicRating from '../Rating/Rating';
import TeacherEvaluationSelect from './TeacherEvaluation';
import { handleTeacherEvaluation } from '../../actions/user';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '8rem',
  maxHeight: '8rem',
  borderRadius: '50%',
});

function Teacher({
                  users,
                  authedUser,
                  id,
                  recitations,
                  recites,
                  earnings,
                  dues,
                  pendingRecites,
                  type,
                  setter,
                  setValue,
                  admins
                }) {

  let ratingSum = 0;

  users[id].raters.map(({rating}) => ratingSum += rating);
  let [evaluation, setEvaluation] = React.useState('');

  const dispatch = useDispatch();

  const handleCheck = () => {
    if (setValue === false) {
        setter(true)
    } else {
        setter(false)
    }
  };

  const handleEvaluation = (e) => {
    e.preventDefault();
    evaluation !== "" && dispatch(handleTeacherEvaluation(id, evaluation))
  };

  return (
    <Paper
      sx={{
        width: "100%",
        pt: "3px"
      }}
    >
      <Grid
        container
        spacing={0}
        className='teacher-container'
        sx={{
          mx: 1,
          textAlign: {
            md: "left",
            sm: "center"
          },
          justifyContent: {
            md: "left",
            sm: "center"
          }
        }}
        >
        {authedUser !== id &&
        <Grid item xs={0.25} sm={0.25} md={0.25} sx={{
          textAlign: "center",
        }}>
            <Input
              id={`choose-${type}-${id}`}
              type="checkbox"
              value={setValue}
              className="choose-user"
              disableUnderline
              onChange={handleCheck}
              />
        </Grid>
        }
        <Grid
          item
          container
          sm={10.75}
          md={10.75}
          xs={9.75}
        >
          <Grid
            item
            xs={12}
            md={1.6}
            sx={{
            height: 75,
            textAlign: "center"
          }}>
            <ButtonBase
              sx={{ cursor: "default" }}
            >
              <Img
                sx={{
                  width: 70,
                  height: 70
                }}
                alt="teacher-pic"
                src={users[id].avatar !== ""
                ? URL.createObjectURL(users[id].avatar)
                : (users[id].gender === 'male' ? male : female)}
              />
            </ButtonBase>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6.5}
            container
            spacing={0}
            >
            <Grid item container>
              <Grid item md={4}>
                <Typography variant="body2" fontWeight="bolder">
                  {users[id].name}
                </Typography>
              </Grid>
              <Grid 
                variant="subtitle1"
                item
                md={8}
                sx={{
                  px: {
                    md: authedUser !== id && 2
                  },
                  textAlign: {
                    md: "right",
                    sm: "left",
                    xs: "left"
                  },
                  justifyContent: {
                    md: "right",
                    sm: "left",
                    xs: "left"
                  }
                }}>
                  {users[id].gender === "male" ?
                  <Container component="div" sx={{
                      font: 'bold 15px "Monotype Corsiva", cursive'
                    }}>
                    <img src={maleSymbol}
                    alt="male"
                    style={{
                      width: 13,
                      height: 13,
                    }} /> 
                    &nbsp;Male
                  </Container>
                  : <Container
                      component="div"
                      sx={{
                        font: 'bold 15px "Monotype Corsiva", cursive'
                      }}
                    >
                    <img
                      src={femaleSymbol}
                      alt="female"
                      style={{
                        width: 15,
                        height: 15,
                      }}
                    /> 
                    &nbsp;Female
                  </Container>}
              </Grid>
            </Grid>
            <Grid item container>
                <Typography
                variant="body2"
                gutterBottom
                color="text.secondary"
                sx={{
                  font: 'bold 10px Helvetica, serif'
                }}>
                  {users[id].email}
                </Typography>
                  {users[id].verified ? 
                  <Typography variant="body2" sx={{
                    background: 'rgba(10, 204, 211, 0.63)',
                    color: 'whitesmoke',
                    padding: 0.5,
                    height: 20,
                    mx: 0.5,
                    mt: -0.5,
                    width: 60,
                    borderRadius: '0.25rem',
                    font: 'bold 10px Helvetica, serif'
                }}>
                Verified 
                </Typography> 
                :
                <Typography variant="body2" sx={{
                    background: 'rgba(177, 49, 10, 0.63)',
                    color: 'whitesmoke',
                    padding: 0.5,
                    height: 20,
                    mx: 0.5,
                    mt: -0.5,
                    width: 60,
                    borderRadius: '0.25rem',
                    font: 'bold 10px Helvetica, serif'
                }}>
                Unverified 
                </Typography> }
                <BasicRating
                  level={users[id].level}
                  rating={ratingSum/users[id].raters.length}
                  rated={((users[id].id === authedUser)
                  || (users[authedUser].rated.includes(id)))}
                  ratedId={id}
                />
            </Grid>
            <Grid item>
                <Typography
                  variant="body2"
                  sx={{
                    font: 'bold 12px Helvetica, serif'
                  }}
                >
                Teacher Recitations Corrections
                </Typography>
            </Grid>
            <Grid
              item
              container
              sm={12}
              md={12}
              sx={{
                textAlign: {
                  md: "left",
                  sm: "center",
                  xs: "center"
                },
                justifyContent: {
                  md: "left",
                  sm: "center",
                  xs: "center"
                }
            }}>
              <Grid
                item
                xs={4}
                sm={2}
                md={2.2}
              >
                <StatsFormer
                  image={total}
                  num={recites.length}
                  text="Total"
                />
              </Grid>
              <Grid
                item
                xs={4}
                sm={2}
                md={2.2}
              >
                <StatsFormer
                  image={pending}
                  num={pendingRecites.map((recite) => recitations[recite].status)
                  .filter((i) => i === "Pending").length}
                  text="Pending"
                />
              </Grid>
              <Grid
                item
                xs={4}
                sm={2}
                md={2.2}
              >
                <StatsFormer
                  image={accept}
                  num={recites.map((recite) => recitations[recite].status)
                  .filter((i) => i === "Accepted").length}
                  text="Accepted"
                />
              </Grid>
              <Grid
                item
                xs={4}
                sm={2}
                md={2.2}
              >
                <StatsFormer
                  image={reject}
                  num={recites.map((recite) => recitations[recite].status)
                  .filter((i) => i === "Rejected").length}
                  text="Rejected"
                />
              </Grid>
              <Grid
                item
                xs={4}
                sm={2}
                md={2.2}
              >
                <StatsFormer
                  image={report}
                  num={recites.map((recite) => recitations[recite].status)
                  .filter((i) => i === "Reported").length}
                  text="Reported"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            container
            xs={12}
            md={3.65}
            sx={{
                textAlign: {
                md: "left",
                sm: "center",
                xs: "center"
              },
              justifyContent: {
                md: "left",
                sm: "center",
                xs: "center"
              }
            }}
          >
            {((admins.includes(authedUser)) && (id !== authedUser)
            && (users[id].status === "Pending"))
            && <Grid
              item
              container
              xs={12}
              sx={{
                mt: {
                  xs: 3,
                  sm: 3,
                  md: 1.8
                }
              }}
            >
              <Grid item md={9}>
                <TeacherEvaluationSelect
                  evaluation={evaluation}
                  setter={setEvaluation}
                  identify={id}
                />
              </Grid>
              <Grid item md={3}>
                <Button
                  type='submit'
                  size='small'
                  variant='contained'
                  onClick={handleEvaluation}
                >
                  Confirm
                </Button>
              </Grid>
            </Grid>}
            <Grid item>
              { users[id].due === "paid" ?
              <Grid
                item
                xs={12}
                md={12}
                sx={{
                    mt: {
                      md: ((id === authedUser)
                      || (users[id].status !== "Pending")
                      || (!admins.includes(authedUser)))
                      ? ((id === authedUser) ? 4.7 : 5.2) : "auto",
                    }
                  }}
              >
                <Container
                  component="div"
                >
                  <Typography
                    variant="body2"
                    sx={{
                      font: 'bold 12px Helvetica, serif'
                    }}
                  >
                    Teacher Accounting
                  </Typography>
                </Container>
                <Grid
                  item
                  container
                  sm={12}
                  md={11}
                  sx={{
                      textAlign: {
                      md: "right",
                      sm: "center",
                      xs: "center"
                    },
                    justifyContent: {
                      md: "right",
                      sm: "center",
                      xs: "center"
                    }
                  }}
                >
                  <Grid
                    item
                    xs={4.5}
                    sm={4.5}
                    md={4.5}
                  >
                    <StatsFormer
                      image={earning}
                      num={earnings.toFixed(2)}
                      text="Earnings"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={4.5}
                    sm={4.5}
                    md={4.5}
                  >
                    <StatsFormer
                      image={due}
                      num={dues.toFixed(2)}
                      text="Dues"
                    />
                  </Grid>
                </Grid>
              </Grid> 
              : <Container
                  component="div"
                  sx={{
                    font: 'bold 15px "Monotype Corsiva", cursive',
                    mt: {
                      md: ((id === authedUser)
                      || (users[id].status !== "Pending"))
                      ? 3 : "auto",
                    }
                  }}
                >
                    <img
                      src={heart}
                      alt="heart"
                      style={{
                        width: 30,
                        height: 30,
                      }}
                    /> 
                    &nbsp;Volunteer
                  </Container>}
            </Grid>
          </Grid>
        </Grid>
        {authedUser !== id &&
            <Grid
              item
              xs={2}
              sm={1}
              md={1}
              sx={{
                textAlign: "center"
              }}
            >
              <LongMenu id={id} authed={authedUser} />
            </Grid>
        }
      </Grid>
    </Paper>
  );
}

function mapStateToProps ({users , authedUser , recitations , admins}, {id}) {

  let earningSum = 0;
  let dueSum = 0;

  users[id].earnings.map((i) => earningSum += i);
  users[id].dues.map((i) => dueSum += i);

  return {
      admins: Object.keys(admins),
      users,
      id,
      authedUser: authedUser !== null ? authedUser[0] : null,
      recitations,
      recites: users[id].evaluatedRecitations,
      pendingRecites: Object.keys(recitations).filter((i) =>
      users[recitations[i].authed].description === "student"),
      earnings: earningSum,
      dues: dueSum,
  }
};

export default connect(mapStateToProps)(Teacher)