import * as React from 'react';
import { connect } from "react-redux";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import male from '../../Resources/male.jpg';
import female from '../../Resources/female.jpeg';
import { Container, Input } from '@mui/material';
import total from '../../Resources/blue-circle.png';
import maleSymbol from '../../Resources/male-symbol.png';
import femaleSymbol from '../../Resources/female-symbol.png';
import star from '../../Resources/star.png';
import accept from '../../Resources/accept.png';
import pending from '../../Resources/waiting.png';
import reject from '../../Resources/reject.png';
import report from '../../Resources/report.png';
import StatsFormer from '../StatsFormer/StatsFormer';
import LongMenu from '../DottedMenu/DottedMenu';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '8rem',
  maxHeight: '8rem',
  borderRadius: '50%',
});

function Student({users, authedUser , id , recites , recitations}) {
  return (
    <Paper
      sx={{
        maxWidth: "100%",
        pt: "3px"
      }}
    >
      <Grid
        container
        spacing={0}
        textAlign="left"
        className='teacher-container'
        sx={{
          mx: 1
        }}
      >
        {authedUser !== id &&
        <Grid item xs={0.25} sm={0.25} md={0.25} sx={{
          textAlign: "center",
        }}>
            <Input id={`choose-${id}`} type="checkbox" value={id} className="choose-user" disableUnderline/>
        </Grid>
        }
        <Grid  item
          container
          sm={10.75}
          md={10.75}
          xs={10.25}
        >
          <Grid item xs={12} md={2} sx={{
          height: 75,
          textAlign: "center"
        }}>
            <ButtonBase sx={{ width: 70, height: 70, cursor: "default", marginLeft: authedUser !== id ? "auto" : "1rem" }}>
              <Img sx={{ width: 70, height: 70 }} alt="student-pic" src={users[id].avatar !== "" ? URL.createObjectURL(users[id].avatar) : (users[id].gender === 'male' ? male : female)} />
            </ButtonBase>
          </Grid>
          <Grid item
            xs={12}
            sm={12}
            md={10}
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
                textAlign="right"
                sx={{
                    border: '2px inset transparent',
                    borderRradius: '5px',
                    font: 'bold 13px Helvetica, serif'
                  }}
                >
                    {users[id].gender === "male" ?
                    <Container component="div" sx={{
                      font: 'bold 15px "Monotype Corsiva", cursive'
                    }}>
                      <img src={maleSymbol}
                      alt="male"
                      style={{
                        width: 13,
                        height: 13,
                        mx: 5,
                      }} /> 
                      &nbsp;Male
                    </Container> : <Container component="div" sx={{
                      font: 'bold 15px "Monotype Corsiva", cursive'
                    }}>
                      <img src={femaleSymbol}
                      alt="female"
                      style={{
                        width: 15,
                        height: 15,
                        mx: 5,
                      }} /> 
                      &nbsp;Female
                    </Container>}
                </Grid>
              </Grid>
              <Grid item>
                <Typography
                variant="body2"
                gutterBottom
                color="text.secondary"
                sx={{
                  font: 'bold 10px Helvetica, serif'
                }}>
                  {users[id].email}
                </Typography>
              </Grid>
              <Grid
                item
                container
                sx={{
                  mb: 1
                }}
              >
                  {users[id].verified ? 
                  <Typography variant="body2" gutterBottom sx={{
                    background: 'rgba(10, 204, 211, 0.63)',
                    color: 'whitesmoke',
                    padding: 0.5,
                    mx: 0.5,
                    width: 60,
                    borderRadius: '0.25rem',
                    font: 'bold 10px Helvetica, serif'
                }}>
                Verified 
                </Typography> 
                :
                <Typography variant="body2" gutterBottom sx={{
                    background: 'rgba(177, 49, 10, 0.63)',
                    color: 'whitesmoke',
                    padding: 0.5,
                    mx: 0.5,
                    width: 60,
                    borderRadius: '0.25rem',
                    font: 'bold 10px Helvetica, serif'
                }}>
                Unverified 
                </Typography> }
                <Typography sx={{
                  font: 'bold 10px Helvetica, serif',
                  color: 'rgba(163, 153, 9, 0.849)',
                  mt: 0.5
                }}>
                  {users[id].level}&nbsp;
                  <img
                  src={star}
                  alt='star'
                  style={{
                    width: '10px',
                    height: '10px',
                  }}
                  />
                  {`${users[id].rating.toFixed(2)}`}
                </Typography>
                <Typography
                sx={{
                  font: 'bold 10px Helvetica, serif',
                  ml: 0.5,
                  mt: 0.5
                }}
                >
                Narration {users[id].narration}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" sx={{ font: 'bold 12px Helvetica, serif'}}>
                  Recitations Statistics
                </Typography>
              </Grid>
                <Grid item container sm={12} md={10} sx={{
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
                  <Grid item xs={3} sm={2} md={2.2}>
                    <StatsFormer image={total} num={recites.length} text="Total" />
                  </Grid>
                  <Grid item xs={3} sm={2} md={2.2}>
                    <StatsFormer image={pending} num={recites.map((recite) => recitations[recite].status).filter((i) => i === "Pending").length} text="Pending" />
                  </Grid>
                  <Grid item xs={3} sm={2} md={2.2}>
                    <StatsFormer image={accept} num={recites.map((recite) => recitations[recite].status).filter((i) => i === "Accepted").length} text="Accepted" />
                  </Grid>
                  <Grid item xs={3} sm={2} md={2.2}>
                    <StatsFormer image={reject} num={recites.map((recite) => recitations[recite].status).filter((i) => i === "Rejected").length} text="Rejected" />
                  </Grid>
                  <Grid item xs={3} sm={2} md={2.2}>
                    <StatsFormer image={report} num={recites.map((recite) => recitations[recite].status).filter((i) => i === "Reported").length} text="Reported" />
                  </Grid>
                </Grid>
            </Grid>
          </Grid>
          {authedUser !== id &&
              <Grid
                item
                md={1}
                sm={1}
                xs={1.5}
                textAlign="right"
              >
                <LongMenu id={id} authed={authedUser} />
              </Grid>
              }
        </Grid>
    </Paper>
  );
}

function mapStateToProps ({users , authedUser , recitations}, {id}) {
    return {
        users,
        id,
        authedUser: authedUser !== null ? authedUser[0] : null,
        recitations,
        recites: users[id].recitations
    }
};

export default connect(mapStateToProps)(Student)