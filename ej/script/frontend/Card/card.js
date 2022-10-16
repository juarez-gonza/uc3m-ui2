/** @typedef {Object} CardContainerData
 *  @property {string} title
 *  @property {Song[]} songs
 */

/**
 * @param {CardContainerData} cards
 * @return {HTMLElement}
 */
function CardContainer({title, songs}) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("playlist");

    const h1Title = document.createElement("h1");
    h1Title.textContent = title;

    wrapper.appendChild(h1Title);
    wrapper.appendChild(_CardContainer(songs))

    return wrapper;
}

/**
 * @param {Song[]} songsData
 * @return {HTMLElement}
 */
function _CardContainer(songsData) {
    const container = foldl((container, cData) => {
            container.appendChild(cData);
            return container;
        },
        songsData.map(c => Card(c)),
        document.createElement("div"));
    container.classList.add("card-container");
    return container;
}

/**
 * 
 * @param {Song} songData 
 * @return {HTMLElement}
 */
function Card(songData) {
    const ret = document.createElement("div");

    ret.classList.add("music-card");
    ret.classList.add("shadow2");

    const title = songData.title;
    const artist = songData.artist;
    const coverPath = songData.coverPath.length === 0 ? Album.find(songData.album).coverPath : songData.coverPath;
    const songPath = songData.songPath;
    const description = songData.description;

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