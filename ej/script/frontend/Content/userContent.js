/**
 * @param {HTMLElement} root 
 * @return {HTMLElement}
 */
 function UserContent(root) {

    const title = document.createElement("h2");
    title.textContent = "My Content";
    title.classList.add("main-title")

    const random=Math.floor(Math.random() * 18)
    const songsContent = CardContainerSection([
        songCardDataNotPlayable("Track 1", "", "", takeSelect(getAllSongs(),random,1)),
    ]);

    const random2=Math.floor(Math.random() * 18)
    const songsContent2 = CardContainerSection([
        songCardDataNotPlayable("Track 2", "", "", takeSelect(getAllSongs(),random2,1)),
    ]);
    
    track1.classList.add("statistics");
    track2.classList.add("statistics");

    return appendChildren([title, ...songsContent, track1, ...songsContent2, track2, uploadButton(buttonUpload)], root);
}


const track1= stats([
    {
        text: "Views: "+ Math.floor(Math.random() * 10000 + 5000),
        iconPath: "./icons/icons8-sleepy-eyes-30 (1).png",
        alt: "Views icon",
        clickHandler: undefined
    },
    {
        text: "Likes: " + Math.floor(Math.random() * 5000),
        iconPath: "./icons/icons8-me-gusta-30.png",
        alt: "Likes icon",
        clickHandler: undefined
    },
    {
        text: "Average listener age: " + Math.floor(Math.random() * 40 + 10),
        iconPath: "./icons/icons8-age-30.png",
        alt: "Age icon",
        clickHandler: undefined
    },
    {
        text: "Minutes listened: " + Math.floor(Math.random() * 20000 + 10000),
        iconPath: "./icons/icons8-timer-30.png",
        alt: "Minutes icon",
        clickHandler: undefined
    }
]);

const track2= stats([
    {
        text: "Views: "+ Math.floor(Math.random() * 10000 + 5000),
        iconPath: "./icons/icons8-sleepy-eyes-30 (1).png",
        alt: "Views icon",
        clickHandler: undefined
    },
    {
        text: "Likes: " + Math.floor(Math.random() * 5000),
        iconPath: "./icons/icons8-me-gusta-30.png",
        alt: "Likes icon",
        clickHandler: undefined
    },
    {
        text: "Average listener age: " + Math.floor(Math.random() * 40 + 10),
        iconPath: "./icons/icons8-age-30.png",
        alt: "Age icon",
        clickHandler: undefined
    },
    {
        text: "Minutes listened: " + Math.floor(Math.random() * 20000 + 10000),
        iconPath: "./icons/icons8-timer-30.png",
        alt: "Minutes icon",
        clickHandler: undefined
    }
]);

const buttonUpload = [
    {
        text: "Upload a new song",
        classes: ["secondary-light-bg-color", "button"],
        extraAttributes: {},
        onClickHandler: setOpenModalHandler("Upload A Collection",uploadForm)
    }]

/**
 * @param {string} title
 * @param {string} id
 * @param {string} mensaje
 * @param {Song[]} songs
 * @return {CardContainerData}
 */
function songCardDataNotPlayable(title, id, mensaje, songs) {
    return {
        title: title,
        id: id,
        emptyMessage: mensaje,
        containerType: CardContainerType.SongCard,
        data: songs.map(s => ({
            song: s,
            playable: false,
            likeable: undefined,
            commonProperties: undefined,
        }))
    };
}

/**
 * 
 * @param {ButtonData[]} btnsData 
 * @return {HTMLFormElement}
 */
 function uploadButton(btnsData) {
    const formId="form"
    const buttons = ButtonSection(btnsData);
    const ret = appendChildren([BigFormMsg(), buttons], document.createElement("form"));

    ret.classList.add("form");
    ret.id = formId;
    return ret;
}

/** @typedef {Object} StatsItemData
 * @property {string} alt
 * @property {string} iconPath
 * @property {string} text
 * @property {(function(MouseEvent): any | undefined)} clickHandler
 */

/**
 * @param {StatsItemData} item
 * @return {HTMLLIElement}
 */
 function StatsItem(item) {
    const {alt, iconPath, text, clickHandler} = item;
    const ret = document.createElement("li");
    ret.innerHTML = `
        <img alt="${alt}" src="${iconPath}"><a href=""> ${text}</a>
    `;
    if (clickHandler !== undefined)
        ret.addEventListener("click", clickHandler);
    return ret;
}

/**
 * @param {StatsItemData[]} items
 * @return {HTMLLIElement[]}
 */
 function StatsItems(items) {
    return items.map(iData => StatsItem(iData));
}

/**
 * @param {StatsItemData[]} items
 * @return {HTMLUListElement}
 */
 function stats(items) {
    return appendChildren([...StatsItems(items)], document.createElement("ul"));
}