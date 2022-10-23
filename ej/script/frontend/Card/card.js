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
 * @property {CommonCardData} commonProperties
 */

/** @typedef {Object} CardContainerData
 *  @property {string} title
 *  @property {CardContainerType} containerType
 *  @property {(SongCardData|ArtistCardData|AlbumCardData)[]} data
 */

/**
 * @param {CardContainerData[]} containerData
 * @return {HTMLElement[]}
 */
function CardContainerSection(containerData) {
    return containerData.map(c => CardContainer(c));
}

/**
 * @param {CardContainerData} cards
 * @return {HTMLElement}
 */
function CardContainer(cards) {
    const {title}  = cards;
    const wrapper = document.createElement("div");
    wrapper.classList.add("playlist");

    const h1Title = document.createElement("h1");
    h1Title.textContent = title;

    wrapper.appendChild(h1Title);
    wrapper.appendChild(_CardContainer(cards));

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
    const {song, playable, commonProperties} = songData;
    const {title, artist, songPath, description, coverPath, album} = song;

    /** @type {HTMLElement} */
    const ret = setClasses(document.createElement("div"), ["music-card", "shadow2"]);

    const imgPath = coverPath.length === 0 ? Album.find(album).coverPath : coverPath;

    ret.innerHTML = `
        <div class="thumbnail">
            <img src="${imgPath}" alt="${title}">
            ${playable ? `
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

    ret.innerHTML = `
        <img src=${findSomeArtistImg(artist)}>
        <div class="description">${artist.name}</div>
    `;
    return addCommonProperties(ret, commonProperties);
}

/**
 * @param {AlbumCardData} albumData
 */
function AlbumCard(albumData) {
    const {album, commonProperties} = albumData;
    const ret = setClasses(document.createElement("div"), ["music-card", "shadow2"]);
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
