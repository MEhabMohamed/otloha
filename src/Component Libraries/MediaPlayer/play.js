export function startMe(audio, quran, pauseItem, playItem) {
    if (quran.length > 0) {
        let i = Math.floor(Math.random()*Math.floor(quran.length - 1));
        audio.src = quran[quran.length < 2 ? 0 : i];
        // Audio playback started ;)
        pauseItem.show();
        playItem.hide();
        return audio.play();
    }
};
