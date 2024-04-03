export function startMe(audio, quran, pauseItem, playItem) {
    quran.length > 0 ?
    fetch(quran)
    .then(() => {
        let i = Math.floor(Math.random()*Math.floor(quran.length - 1));
        audio.src = quran[quran.length < 2 ? 0 : i];
        return audio.play();
    })
    .then(() => {
      // Audio playback started ;)
        pauseItem.show();
        playItem.hide();
    })
    .catch(e => {
      // Audio playback failed ;(
        console.log(e)
    }) : alert('no source available')
};
