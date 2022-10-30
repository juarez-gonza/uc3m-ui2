class Sidebar {
    /** @type {HTMLElement} */
    element;

    constructor() {
        __Store.events.subscribe("stateChange", () => this.render());
        this.element = document.querySelector("aside nav");
    }

    /**
     * @return {HTMLElement}
     */
    render() {
        removeAllChildren(this.element);
        if (__Store.state.loggedIn === null)
            return SidebarDefault(this.element);
        return SidebarLoggedIn(this.element);
    }
}

/**
 * 
 * @param {HTMLElement} root 
 * @return {HTMLElement}
 */
function SidebarLoggedIn(root) {
    const upper = SidebarSubmenu("Options", [
        {
            text: "Check Your Playlists",
            iconPath: "./icons/icons8-playlist-48.png",
            alt: "your playlists icon",
            clickHandler: e => { 
                e.preventDefault();
                __Store.commit("toCheckPlaylists");
            }
        },
        {
            text: "Playlist Creator",
            iconPath: "./icons/icons8-search-40.png",
            alt: "playlist creator icon",
            clickHandler: undefined
        }
    ]);
    
    return appendChildren([upper, lower], root);
}
/**
 * 
 * @param {HTMLElement} root 
 * @return {HTMLElement}
 */
 function SidebarDefault(root) {
    const upper = SidebarSubmenu("Options", [
        {
            text: "Home",
            iconPath: "./icons/icons8-interior-48.png",
            alt: "Home icon",
            clickHandler: undefined
        },
        {
            text: "Podacasts",
            iconPath: "./icons/icons8-podcast-64.png",
            alt: "Podcasts icon",
            clickHandler: undefined
        }
    ]);

    return appendChildren([upper, lower], root);
}

const lower = SidebarSubmenu("Contact Us!", [
    {
        text: "Instagram",
        iconPath: "./icons/icons8-instagram-48.png",
        alt: "instagram icon",
        clickHandler: undefined
    },
    {
        text: "Twitter",
        iconPath: "./icons/icons8-twitter-48.png",
        alt: "twitter icon",
        clickHandler: undefined
    },
    {
        text: "Privacy",
        iconPath: "./icons/icons8-privacy-policy-64.png",
        alt: "privacy policy",
        clickHandler: undefined
    }
]);

/** @typedef {Object} SidebarItemData
 * @property {string} alt
 * @property {string} iconPath
 * @property {string} text
 * @property {(function(MouseEvent): any | undefined)} clickHandler
 */

/**
 * @param {SidebarItemData} item
 * @return {HTMLLIElement}
 */
function SidebarItem(item) {
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
 * @param {SidebarItemData[]} items
 * @return {HTMLLIElement[]}
 */
function SidebarItems(items) {
    return items.map(iData => SidebarItem(iData));
}

/**
 * @param {string} title
 * @param {SidebarItemData[]} items
 * @return {HTMLUListElement}
 */
function SidebarSubmenu(title, items) {
    const titleItem = document.createElement("li");
    titleItem.textContent = title;
    return appendChildren([titleItem, ...SidebarItems(items)], document.createElement("ul"));
}