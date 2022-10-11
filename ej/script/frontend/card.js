/** @typedef {Object} CardInfo
 *  @property {string} img
 *  @property {string} audio
 *  @property {string} songTitle
 *  @property {string} songDescription 
 */

/**
 * @param {string} title
 * @param {Song[]} cardInfo
 * @return {HTMLElement}
 */
function decoratedCardContainer(title, cardInfo) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("playlist");

    const h1Title = document.createElement("h1");
    h1Title.textContent = title;

    wrapper.appendChild(h1Title);
    wrapper.appendChild(cardContainer(cardInfo))

    return wrapper;
}

/**
 * @param {Song[]} cardInfo
 * @return {HTMLElement}
 */
function cardContainer(cardInfo) {
    const container = foldl((container, cInfo) => {
        const c = card(cInfo);
        container.appendChild(c);
        return container;
    }, cardInfo, document.createElement("div"));
    container.classList.add("card-container");
    return container;
}

/**
 * 
 * @param {Song} cardInfo 
 * @return {HTMLElement}
 */
function card(cardInfo) {
    const ret = document.createElement("div");

    ret.classList.add("music-card");
    ret.classList.add("shadow2");

    const title = cardInfo.title;
    const artist = cardInfo.artist;
    const coverPath = cardInfo.coverPath.length === 0 ? Album.find(cardInfo.album).coverPath : cardInfo.coverPath;
    const songPath = cardInfo.songPath;
    const description = cardInfo.description;

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