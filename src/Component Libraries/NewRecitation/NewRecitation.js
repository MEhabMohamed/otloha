import React, { useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { handleAddRecitation } from "../../actions/recitation";
import $ from "jquery";
import SurahSelect from "../Surahs/Surahs";
import AyahSelect from "../Ayahs/Ayahs";
import NarrationSelect from "../Narration/Narration";
import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import qu from "../../Resources/quran.png";
import plus from "../../Resources/plus.png";
import AlertShow from "../Alert/AlertShow";
import BasicAlerts from "../Alert/Alert";
import { useNavigate } from 'react-router-dom';

function NewRecitation({ authedUser }) {

    let verse = useRef('');
    let [narration, setNarration] = useState('');
    let [playback, setPlayback] = useState('');
    let [alarm, setAlarm] = useState('');
    let [mushaf, setMushaf] = React.useState('');
    let [surah, setSurah] = useState('');
    let [fromAyah, setFromAyah] = useState('');
    let [fromAyahNumber, setFromAyahNumber] = useState(0);
    let [toAyah, setToAyah] = useState('');
    let [toAyahNumber, setToAyahNumber] = useState(0);
    verse.current = {
        from: `...${fromAyah.substring(0, 40)}`,
        to: `...${toAyah.substring(0, 40)}`,
        fromNumber: fromAyahNumber,
        toNumber: toAyahNumber,
        fullFrom: fromAyah,
        fullTo: toAyah,
        surah
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();

    $.getJSON('https://drive.google.com/file/d/1xJGW2ICUiISO_dvmQ0H-2QvLkAwudem3/view?usp=sharing',
    (data) => setMushaf(data));

    function handleSubmitText (e) {
        e.preventDefault();
        if (verse.current && narration && playback !== "") {
            dispatch(handleAddRecitation(verse.current, narration,
            playback, authedUser));
            navigate('../recitations')
        } else {
            AlertShow($('#recitation-alert'), setAlarm, "Please choose all required!")
        }
    }

    return (
        <Container
            component={Paper}
            maxWidth="xs"
        >
            <Box 
                id="new-recitation"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <Box
                    component="form"
                    noValidate
                    sx={{
                        pt: 12,
                        pb: 2
                    }}
                    id="new-recitation-form"
                    onSubmit={(e) => {
                        fetch({
                            verse,
                            narration,
                            playback,
                        }).then(handleSubmitText(e))
                        .then(() => {
                                $('#playback').val('');
                                verse.current = '';
                                setNarration('');
                                setPlayback('');
                                setSurah('');
                                setFromAyah('');
                                setToAyah('');
                                $('#file-name').text('');
                            })}}>
                    <Grid
                        container
                        spacing={2}
                    >
                        <Grid
                            item
                            xs={12}
                            textAlign="center"
                        >
                        <img
                            src={qu}
                            alt="add-recitation" 
                            style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                }} />
                                <Box
                                variant="contained"
                                component="label"
                                id='get-verse'
                                sx={{
                                    width: '2rem',
                                    height: '2rem',
                                    position: 'absolute',
                                    margin: '4rem 0 2rem -1.5rem',
                                    backgroundSize: '100%',
                                    backgroundRepeat: 'no-repeat',
                                    cursor: 'pointer',
                                    backgroundImage: `url(${plus})`
                                }}
                            >
                            <input
                                type="file"
                                id="getVerse"
                                onChange={(e) => {
                                    const supportedTypes = ['audio/wav', 'audio/mpeg', 'audio/ogg']
                                    if (supportedTypes.includes(e.target.files[0].type)) {
                                        const reader = new FileReader();
                                        reader.onload = function (e) {
                                            setPlayback(e.target.result)
                                        };
                                        reader.readAsDataURL(e.target.files[0]);
                                        document.querySelector('#file-name').textContent
                                        = e.target.files[0].name.split(".")[0];
                                    }
                                }}
                                hidden
                            />
                            </Box>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            textAlign="center"
                        >
                            <Typography
                                variant="body1"
                                id="file-name"
                                >   
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sx={{
                                display: "none"
                            }}
                            id="recitation-alert"
                        >
                            <BasicAlerts text={alarm} />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                        >
                            <SurahSelect
                                surah={surah}
                                setter={setSurah}
                                mushaf={mushaf}
                            />
                        </Grid>
                        {surah !== "" && <Grid item xs={12}>
                            <AyahSelect
                                id="from-ayah-select"
                                surah={surah}
                                ayah={fromAyah}
                                setter={setFromAyah}
                                label="Ayah From"
                                numberSetter={setFromAyahNumber}
                                mushaf={mushaf}
                            />
                        </Grid>}
                        {surah !== "" && <Grid item xs={12}>
                            <AyahSelect
                                id="to-ayah-select"
                                surah={surah}
                                ayah={toAyah}
                                setter={setToAyah}
                                label="Ayah To"
                                numberSetter={setToAyahNumber}
                                mushaf={mushaf}
                            />
                        </Grid>}
                        <Grid item xs={12}>
                            <NarrationSelect
                                narrate={narration}
                                setter={setNarration}
                                identify="new-recitation"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                id="submit-recitation"
                                type="submit"
                                color="primary"
                                variant="contained"
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    )
}

function mapStateToProps({authedUser}) {
    return {
        authedUser: authedUser !== null ? authedUser[0] : null
    }
}

export default connect(mapStateToProps)(NewRecitation)