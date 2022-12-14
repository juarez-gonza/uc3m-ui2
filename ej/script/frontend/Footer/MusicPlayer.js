/**
 * @param {HTMLElement} footer
 * @return {HTMLElement}
 */
function MusicPlayer(footer) {
    footer.classList.add("music-player");
    footer.classList.remove("gradient1-bg");
    footer.classList.add("purple-bg-color");

    /* music controls */
    const controls = document.createElement("div");
    controls.classList.add("music-controls")

    const play = document.createElement("img");
    play.classList.add("play-button");
    play.src = "./icons/icons8-play-button-circled-48.png";
    play.alt = "controls-play-button";

    const pause = document.createElement("img");
    pause.src = "./icons/icons8-pause-squared-48.png";
    pause.alt = "controls-pause-button";
    pause.classList.add("pause-button");
    appendChildren([play, pause], controls);

    /* music mini-thumbnail and title and artist of theme being played */
    const musicPlaying = playingThemeImg("./icons/icons8-sheet-music-48.png",
                                                "Start playing music!",
                                                "Listen your favourite artists");


    /* theme progress bar */
    const progressBar = document.createElement("div");
    setClasses(progressBar, ["gradient1-bg", "music-player-progress"]);
    progressBar.innerHTML = `<div class="progress-marker white-ish-bg-color"></div>`;

    return appendChildren([progressBar, controls, musicPlaying], footer);
}

/**
 * @param {string} imgSrc 
 * @param {string} songName 
 * @param {string} artistName 
 * @return {HTMLElement}
 */
function playingThemeImg(imgSrc, songName, artistName) {
    const ret = document.createElement("div");
    ret.innerHTML = `
        <img src="${imgSrc}" alt="playing-theme-img">
        <div>
            <span>${songName}</span>
            <span>${artistName}</span>
        </div>
    `;
    setClasses(ret, ["playing-theme-img"])
    return ret;
}

/**
 * @return {HTMLElement}
 */
function MusicProgressMarkerHandle() {
    return document.querySelector(".main-footer .music-player-progress .progress-marker");
}

/**
 * @param {HTMLElement} progressMarker
 * @param {Song} song
 * @param {string} imgSrc
 * @param {HTMLAudioElement} audioTag
 */
function startNewSong(progressMarker, song, imgSrc, audioTag) {
    clearMusicPlayer(progressMarker);
    const footer = document.querySelector(".main-footer");
    footer.removeChild(footer.querySelector(".playing-theme-img"));
    footer.appendChild(playingThemeImg(imgSrc, song.title, song.artist));

    const playButton = removeEventListeners(footer.querySelector(".play-button"));
    const pauseButton = removeEventListeners(footer.querySelector(".pause-button"));

    pauseButton.addEventListener("click", () => {
        if (!audioTag.paused)
            audioTag.pause();
    });

    playButton.addEventListener("click", () => {
        if (audioTag.paused)
            audioTag.play();
    });

    audioTag.play();
}

/**
 * @param {HTMLElement} progressMarker
 */
function clearMusicPlayer(progressMarker) {
    updateMusicPlayer(progressMarker, 0, 1);
}

/**
 * @param {HTMLElement} progressMarker
 * @param {number} currentSeconds
 * @param {number} totalSeconds
 */
function updateMusicPlayer(progressMarker, currentSeconds, totalSeconds) {
    progressMarker.style.width = `${Math.round(currentSeconds / totalSeconds * 100)}%`;
}

/**
 * @param {HTMLMediaElement} mediaTag
 */
function stopDifferentMedia(mediaTag) {
    for (const elem of Array.from(document.getElementsByTagName("audio")))
        if (!mediaTag.isSameNode(elem))
            elem.pause();
}

/**
 * @param {Node} node 
 * @return {Node} - element with removed listeners
 */
function removeEventListeners(node) {
    const parent = node.parentElement;
    const newNode = node.cloneNode(true)
    parent.removeChild(node);
    parent.appendChild(newNode);
    return newNode;
}

/**
 * @param {HTMLElement} progressMarker
 * @param {Song} song
 * @param {string} imgSrc
 * @param {HTMLAudioElement} audioTag
 * @return {function(Event): any}
 */
function getPlaySongHandler(progressMarker, song, imgSrc, audioTag) {
    return () => {
        const user = __Store.state.loggedIn;
        if (user !== null)
            user.addRecentSong(song);
        stopDifferentMedia(audioTag);
        startNewSong(progressMarker, song, imgSrc, audioTag);
    };
}