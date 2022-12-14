/**
 * @readonly
 * @enum {number}
 */
 const CardContainerType = {
    ArtistCard: 0,
    SongCard: 1,
    AlbumCard: 2,
};

/**
 * @typedef {Object} CommonCardData
 * @property {function(MouseEvent): any | undefined} clickHandler
 * @property {{period: number, handler: function(HTMLElement): boolean} | undefined} intervalUpdate
 * @property {string|undefined} badgeMessage
 */

/** @type {CommonCardData} - valor default para usar donde necesario */
const __NoCardProperties = {
    clickHandler: undefined,
    intervalUpdate: undefined,
    badgeMessage: undefined,
};

/**
 * @typedef {Object} ArtistCardData
 * @property {Artist} artist
 * @property {CommonCardData|undefined} commonProperties
 */

/**
 * @typedef {Object} AlbumCardData
 * @property {Album} album
 * @property {CommonCardData} commonProperties
 */

/**
 * @typedef {Object} SongCardData
 * @property {Song} song
 * @property {boolean} playable
 * @property {{liked: boolean} | undefined} likeable
 * @property {CommonCardData} commonProperties
 */

/** 
 * @typedef {Object} CardContainerData
 *  @property {string} title
 *  @property {string} id
 *  @property {string} emptyMessage
 *  @property {CardContainerType} containerType
 *  @property {(SongCardData|ArtistCardData|AlbumCardData)[]} data
 */

/**
 * @param {CardContainerData[]} containerData
 * @return {Element[]}
 */
function CardContainerSection(containerData) {
    return containerData.map(c => CardContainer(c));
}

/**
 * @param {CardContainerData} cardsData
 * @return {Element}
 */
 function CardContainer(cardsData) {
    const {title, id, emptyMessage: mensaje} = cardsData;
    const wrapper = document.createElement("div");
    wrapper.id = id;
    wrapper.classList.add("playlist");

    const h1Title = document.createElement("h1");
    h1Title.textContent = title;

    const h3mensaje = document.createElement("h3");
    h3mensaje.textContent = mensaje;

    wrapper.appendChild(h1Title);
    wrapper.appendChild(h3mensaje)
    wrapper.appendChild(_CardContainer(cardsData));

    return wrapper;
}

/**
 * @param {CardContainerData} containerData
 * @return {HTMLElement}
 */
function _CardContainer(containerData) {
    const {data, containerType} = containerData;

    let CardConstructor;
    switch (containerType) {
        case CardContainerType.ArtistCard:
            CardConstructor = ArtistCard;
            break;
        case CardContainerType.SongCard:
            CardConstructor = SongCard;
            break;
        case CardContainerType.AlbumCard:
            CardConstructor = AlbumCard;
            break;
        default:
            throw new Error(`No card constructor for card type ${containerType}`)
    }

    const container = appendChildren(
        data.map(c => CardConstructor(c)),
        document.createElement("div"));

    container.classList.add("card-container");
    return container;
}

/**
 * 
 * @param {SongCardData} songData 
 * @return {HTMLElement}
 */
function SongCard(songData) {
    const {song, playable, likeable, commonProperties} = songData;
    const {title, artist, songPath, description, coverPath, album} = song;

    /** @type {HTMLElement} */
    const ret = setClasses(document.createElement("div"), ["music-card", "shadow2"]);
    ret.id = song._id;

    const imgPath = coverPath.length === 0 ? Album.find(album).coverPath : coverPath;

    ret.innerHTML = `
        <div class="thumbnail">
            <img class="theme-img" src="${imgPath}" alt="${title}">
            ${playable ? `
            <img class="play-button" src="./icons/icons8-play-button-circled-48.png" alt="${title}-play-button">
            <audio controls>
                <source src="${songPath}" type="audio/mpeg">
                Your browser doest not support the audio tag
            </audio> 
            ` : ""
            }
        </div>
        <div class="description">
            <h6>${title}</h6>
            <p>${description}</p>
        </div>
    `;

    if (likeable !== undefined) {
        const likeButton = LikeButton(likeable.liked);
        likeButton.alt = `${title}-like-button`;
        const likeSection = document.createElement("div")
        likeSection.classList.add("like-button-section");
        ret.appendChild(likeSection).appendChild(likeButton);
    }

    if (playable) {
        const audioTag = ret.querySelector("audio");
        const playButton = ret.querySelector("img.play-button");

        audioTag.addEventListener("loadedmetadata", () => {
            const progressMarker = MusicProgressMarkerHandle();
            const playSongHandler = getPlaySongHandler(progressMarker, song, imgPath, audioTag)

            audioTag.addEventListener("play", playSongHandler);
            playButton.addEventListener("click", playSongHandler);

            audioTag.addEventListener("timeupdate", e => {
                updateMusicPlayer(progressMarker, audioTag.currentTime, audioTag.duration);
            });
        });
    }

    return addCommonProperties(ret, commonProperties);
}

/**
 * 
 * @param {ArtistCardData} artistData 
 */
function ArtistCard(artistData) {
    const {artist, commonProperties} = artistData;
    /** @type {HTMLElement} */
    const ret = setClasses(document.createElement("div"), ["artist-card", "shadow2"]);
    ret.id = artist._id;

    ret.innerHTML = `
        <img src=${findSomeArtistImg(artist)} alt="${artist._id}-img">
        <div class="description"><h6>${artist.name}</h6></div>
    `;
    return addCommonProperties(ret, commonProperties);
}

/**
 * @param {AlbumCardData} albumData
 */
function AlbumCard(albumData) {
    const {album, commonProperties} = albumData;
    const ret = setClasses(document.createElement("div"), ["music-card", "shadow2"]);
    ret.id = album._id;
    ret.innerHTML = `
        <div class="thumbnail">
            <img src="${album.coverPath}" alt="${album.title}">
        </div>
        <div class="description">
            <h6>${album.title}</h6>
            <p>${album.artist}</p>
        </div>
    `;

    return addCommonProperties(ret, commonProperties);
}

/**
 * @param {HTMLElement} card
 * @param {CommonCardData} commonProperties 
 * @return {HTMLElement}
 */
function addCommonProperties(card, commonProperties) {
    if (commonProperties === undefined)
        return card;

    const {clickHandler, badgeMessage, intervalUpdate} = commonProperties

    if (badgeMessage !== undefined)
        card.appendChild(BadgeMessage(badgeMessage));

    if (clickHandler !== undefined)
        card.addEventListener("click", clickHandler);

    if (intervalUpdate !== undefined)
        setIntervalUntil(intervalUpdate.handler, intervalUpdate.period, card);

    return card;
}


const __Filled_Heart_Path = "./icons/icons8-heart-50(1).png";
const __Cleared_Heart_Path =  "./icons/icons8-heart-50.png";
/**
 * @param {boolean} liked
 * @return {HTMLImageElement}
 */
function LikeButton(liked) {
    const img = document.createElement("img");
    img.src = liked ? __Filled_Heart_Path : __Cleared_Heart_Path;

    if (!liked) {
        img.addEventListener("mouseenter", () => img.src = __Filled_Heart_Path);
        img.addEventListener("mouseleave", () => img.src = __Cleared_Heart_Path);
    }

    return img;
}

/**
 * @param {string} message
 * @return {HTMLElement}
 */
function BadgeMessage(message) {
    const ret = setClasses(document.createElement("div"),
                            ["badge-msg", "main-dark-bg-color", "shadow1"]);
    ret.innerText = message;
    return ret;
}

/**
 * @param {Artist} artistData
 * @return {string}
 */
function findSomeArtistImg(artistData) {
    if (artistData.albums.length > 0)
        return artistData.albums[0].coverPath;
    return artistData.songs.find(s => s.coverPath.length > 0).coverPath;
}

/**
 * @param {Element} decoratedContainer
 */
function getUnderlyingCardContainer(decoratedContainer) {
    if (decoratedContainer.classList.contains("playlist"))
        return decoratedContainer.querySelector(".card-container")
    return null;
}