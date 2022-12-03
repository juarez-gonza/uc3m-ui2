/**
 * @param {HTMLElement} footer
 * @return {HTMLElement}
 */
function MusicPlayer(footer) {
    footer.classList.add("music-player");
    footer.classList.remove("gradient1-bg");
    footer.classList.add("purple-bg-color");

    const play = document.createElement("img");
    play.classList.add("play-button");
    play.src = "./icons/icons8-play-button-circled-48.png";

    const pause = document.createElement("img");
    pause.src = "./icons/icons8-pause-squared-48.png";
    pause.classList.add("pause-button");

    const musicPlaying = currentlyPlayingSection("./icons/icons8-sheet-music-48.png",
                                                "Start playing music!",
                                                "Listen your favourite artists");


    const progressBar = document.createElement("div");
    setClasses(progressBar, ["gradient1-bg", "music-player-progress"]);
    progressBar.innerHTML = `<div class="progress-marker white-ish-bg-color"></div>`;

    return appendChildren([progressBar, play, pause, musicPlaying], footer);
}

/**
 * @param {string} imgSrc 
 * @param {string} songName 
 * @param {string} artistName 
 * @return {HTMLElement}
 */
function currentlyPlayingSection(imgSrc, songName, artistName) {
    const currentlyPlaying = document.createElement("div");
    currentlyPlaying.innerHTML = `
        <img src="${imgSrc}">
        <div>
            <span>${songName}</span>
            <span>${artistName}</span>
        </div>
    `;
    setClasses(currentlyPlaying, ["currently-playing"])
    return currentlyPlaying;
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
    footer.removeChild(footer.querySelector(".currently-playing"));
    footer.appendChild(currentlyPlayingSection(imgSrc, song.title, song.artist));

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