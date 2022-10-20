/**
 * @readonly
 * @enum {number}
 */
 const CardType = {
    ArtistCard: 0,
    SongCard: 1,
};


/** @typedef {Object} CardContainerData
 *  @property {string} title
 *  @property {CardType} cardType
 *  @property {(Song|Artist)[]} data
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
    const {title, data, cardType}  = cards;
    const wrapper = document.createElement("div");
    wrapper.classList.add("playlist");

    const h1Title = document.createElement("h1");
    h1Title.textContent = title;

    wrapper.appendChild(h1Title);
    wrapper.appendChild(_CardContainer(cards));

    return wrapper;
}

/**
 * @param {CardContainerData} cards
 * @return {HTMLElement}
 */
function _CardContainer(cards) {
    const {data, cardType} = cards;
    const container = appendChildren(data.map(c => Card(c, cardType)), document.createElement("div"));
    container.classList.add("card-container");
    return container;
}

/**
 * 
 * @param {Song|Artist} data 
 * @param {CardType} cardType
 * @return {HTMLElement}
 */
function Card(data, cardType) {
    if (cardType === CardType.ArtistCard)
        // @ts-ignore no soporte para dynamic dispatch en jsdoc
        return ArtistCard(data);
    // @ts-ignore no soporte para dynamic dispatch en jsdoc
    return SongCard(data) ;
}

/**
 * 
 * @param {Song} songData 
 * @return {HTMLElement}
 */
function SongCard(songData) {
    /** @type {HTMLElement} */
    const ret = setClasses(document.createElement("div"), ["music-card", "shadow2"]);
    const {title, artist, songPath, description} = songData;

    const coverPath = songData.coverPath.length === 0 ? Album.find(songData.album).coverPath : songData.coverPath;

    ret.innerHTML = `
        <div class="thumbnail">
            <img src="${coverPath}" alt="${title}">
            <audio controls>
                <source src="${songPath}" type="audio/mpeg">
                Your browser doest not support the audio tag
            </audio> 
        </div>
        <div class="description">
            <h6>${title}</h6>
            <p>${description}</p>
        </div>
    `;

    return ret;
}

/**
 * 
 * @param {Artist} artistData 
 */
function ArtistCard(artistData) {
    /** @type {HTMLElement} */
    const ret = setClasses(document.createElement("div"), ["artist-card", "shadow2"]);
    const img = document.createElement("img");
    img.src = findSomeArtistImg(artistData);
    ret.appendChild(img);
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
