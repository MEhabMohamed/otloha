import React , { useEffect, useState } from "react";
import $ from 'jquery';
import { connect } from "react-redux";
import { startMe } from "./play";
import playPic from "../../Resources/play.png";
import pausePic from "../../Resources/pause.png";
import stopPic from "../../Resources/stop.png";
import previousPic from "../../Resources/previous.png";
import nextPic from "../../Resources/next.png";
import mutePic from "../../Resources/volume_mute.png";
import unmutePic from "../../Resources/volume_off.png";
import Slider from '@mui/material/Slider';

const audioControlsStyle = {
	padding: 0,
	border: 0,
	background: 'transparent',
	cursor: 'pointer',
}

const volumeStyle = {
    margin: 'auto 2.5%',
	width: '20%',
    py: 0.5,
}

const audioStyle = {
    background: '#0d88c242',
    borderRadius: '25px',
    border: "1px solid white",
    maxHeight: 130,
}

const timeStyle = {
	display: 'inline-block',
	width: '37px',
	textAlign: 'center',
	fontSize: '12px',
	margin: '28.5px 0 18.5px 0'
}

const outputStyle = {
	display: 'inline-block',
	width: '0.5rem',
	textAlign: 'center',
	fontSize: '12px',
	clear: 'left',
	margin: 'auto 20px auto 5px'
}

function Player ({ id, recite, recitations }) {

    let quran = [recite[id].playback];

    let [volume, setVolume] = useState(100);
    let [playBackTime, setPlayBackTime] = useState(0);
    let [max, setMax] = useState(100);

    const handleVolumeChange = (_, newValue) => {
        setVolume(newValue);
        document.querySelector(`#${id.slice(-6)}-volume-output`).textContent = newValue;
        document.querySelector(`#${id.slice(-6)}-audio`).volume = newValue / 100;
    };

    function pauseMe() {
        document.querySelector(`#${id.slice(-6)}-audio`).pause();
        $(`#${id.slice(-6)}-pauseItem`).hide();
        $(`#${id.slice(-6)}-play`).show();
    };

    function playMe() {
        let i = Math.floor(Math.random()*Math.floor(quran.length - 1));
        if (document.querySelector(`#${id.slice(-6)}-audio`).src === "") {
            document.querySelector(`#${id.slice(-6)}-audio`).src
            = quran[quran.length < 2 ? 0 : i]
        } return document.querySelector(`#${id.slice(-6)}-audio`).play().then(() => {
        $(`#${id.slice(-6)}-pauseItem`).show();
        $(`#${id.slice(-6)}-play`).hide();
        });
    };

    const handlePlayer = (_, value) => {
        document.querySelector(`#${id.slice(-6)}-current-time`).textContent
        = calculateTime(value);
        document.querySelector(`#${id.slice(-6)}-audio`).currentTime = value;
    }

    function stop() {
        document.querySelector(`#${id.slice(-6)}-audio`).currentTime = 0;
        document.querySelector(`#${id.slice(-6)}-audio`).pause();
        $(`#${id.slice(-6)}-pauseItem`).hide();
        $(`#${id.slice(-6)}-play`).show();
    };

    const calculateTime = (secs) => {
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${minutes}:${returnedSeconds}`;
    };

    const displayDuration = () => {
        $(`#${id.slice(-6)}-duration`)
        .text(calculateTime(document.querySelector(`#${id.slice(-6)}-audio`).duration));
    };

    const setSliderMax = () => {
        document.querySelector(`#${id.slice(-6)}-seek-slider`).max
        = Math.floor(document.querySelector(`#${id.slice(-6)}-audio`).duration);
    };

    function playNext() {
        let i = Math.floor(Math.random()*Math.floor(quran.length - 1));
        i++;
        if (i >= quran.length) {
            i = Math.floor(Math.random()*Math.floor(quran.length - 1));
        };
        document.querySelector(`#${id.slice(-6)}-audio`).src = quran[i];
    };

    function playPrevious() {
        let i = Math.floor(Math.random()*Math.floor(quran.length - 1));
        i--;
        if (i < 0) {
            i = Math.floor(Math.random()*Math.floor(quran.length - 1));
        };
        document.querySelector(`#${id.slice(-6)}-audio`).src = quran[i];
    };

    useEffect(() => {
        const whilePlaying = () => {
            setPlayBackTime(Math.floor(document.querySelector(`#${id.slice(-6)}-audio`)
            .currentTime));
            $(`#${id.slice(-6)}-current-time`).text(calculateTime(playBackTime));
        }

        const playerCounter = setInterval(whilePlaying, 1000);
        return () => {
            clearInterval(playerCounter);
        } 

    }, [id, playBackTime])

    return (
        <div
            style={audioStyle}
            id={`${id.slice(-6)}-audio-player-container`}
        >
            <audio 
                    preload='metadata'
                    id={`${id.slice(-6)}-audio`}
                    onEnded={() => {
                        stop();
                    }} 
                    onLoadedMetadata={() => {
                        setMax(document.querySelector(`#${id.slice(-6)}-audio`).duration);
                        displayDuration();
                        setSliderMax();
                }}/>
            <img 
                className="audio-controls" 
                src={playPic} 
                id={`${id.slice(-6)}-play`} 
                alt="play" 
                style={audioControlsStyle}
                onClick={() => {
                    recitations.filter((id) => {
                        document.querySelector(`#${id.slice(-6)}-audio`) !== null
                        && document.querySelector(`#${id.slice(-6)}-audio`).pause()
                        $(`#${id.slice(-6)}-pauseItem`).hide();
                        $(`#${id.slice(-6)}-play`).show();
                        return id
                    })
                    document.querySelector(`#${id.slice(-6)}-audio`).currentTime !== 0 ?
                    playMe(document.querySelector(`#${id.slice(-6)}-audio`)) 
                    : startMe(document.querySelector(`#${id.slice(-6)}-audio`),
                    quran, $(`#${id.slice(-6)}-pauseItem`), $(`#${id.slice(-6)}-play`))
                }}
            />

            <img 
                className="audio-controls pauseItem"
                src={pausePic}
                alt="pause"
                id={`${id.slice(-6)}-pauseItem`}
                onClick={() => pauseMe(document.querySelector(`#${id.slice(-6)}-audio`))}
                style={{display: 'none', ...audioControlsStyle}}
            />

            <img 
                className="audio-controls"
                src={stopPic} alt="stop"
                id={`${id.slice(-6)}-stopIcon`}
                onClick={() => stop()}
                style={audioControlsStyle}
            />

            <img 
                className="audio-controls"
                src={previousPic}
                alt="prev"
                style={audioControlsStyle}
                id={`${id.slice(-6)}-prevIcon`} 
                onClick={() => {
                    document.querySelector(`#${id.slice(-6)}-audio`).currentTime = 0;
                    fetch(playPrevious())
                    .then(() => playMe(document.querySelector(`#${id.slice(-6)}-audio`))
            )}}/>

            <span 
                id={`${id.slice(-6)}-current-time`} 
                className="time"
                style={timeStyle}>0:00
            </span>

            <Slider 
                size="small" 
                id={`${id.slice(-6)}-seek-slider`} 
                aria-label="time-indicator" 
                min={0} 
                step={1} 
                max={max} 
                value={playBackTime} 
                onChange={handlePlayer}
                sx={{ width: '25%', py: '2px', mx: 0.5}} 
            />

            <span 
                id={`${id.slice(-6)}-duration`} 
                className="time"
                style={timeStyle}>0:00
            </span>

            <img 
                className="audio-controls"
                src={nextPic}
                alt="next"
                style={audioControlsStyle}
                id={`${id.slice(-6)}-nextIcon`}
                onClick={() => {
                    document.querySelector(`#${id.slice(-6)}-audio`).currentTime = 0;
                    fetch(playNext())
                    .then(() => playMe(document.querySelector(`#${id.slice(-6)}-audio`)))
                }}
            />

            <Slider 
                size="small" 
                aria-label="Volume" 
                value={volume} 
                onChange={handleVolumeChange} 
                sx={volumeStyle}
            />

            <output 
                id={`${id.slice(-6)}-volume-output`} 
                className="volume-output"
                style={outputStyle}>100
            </output>

            <img 
                className="audio-controls unmute" 
                src={unmutePic} 
                alt="unmute" 
                id={`${id.slice(-6)}-unmute`} 
                onClick={() => {
                    document.querySelector(`#${id.slice(-6)}-audio`).muted = false;
                    $(`#${id.slice(-6)}-unmute`).hide();
                    $(`#${id.slice(-6)}-mute`).show();
                }}
                style={{ display: 'none', ...audioControlsStyle}}
            />

            <img 
                className="audio-controls"
                src={mutePic}
                alt="mute"
                style={audioControlsStyle}
                id={`${id.slice(-6)}-mute`} 
                onClick={() => {
                    document.querySelector(`#${id.slice(-6)}-audio`).muted = true;
                    $(`#${id.slice(-6)}-unmute`).show();
                    $(`#${id.slice(-6)}-mute`).hide();
                }}
            />
        </div>
    )
};

function mapStateToProps({recitations}) {
    return {
        recitations: Object.keys(recitations),
        recite: recitations
    }
}

export default connect(mapStateToProps)(Player)