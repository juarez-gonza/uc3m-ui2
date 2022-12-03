class Sidebar {
    /** @type {HTMLElement} */
    element;

    constructor() {
        __Store.events.subscribe("stateChange", () => this.render());
        this.element = document.querySelector("aside");
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
                nextPage("toCheckPlaylists");
            }
        },
        {
            text: "Playlist Creator",
            iconPath: "./icons/icons8-search-40.png",
            alt: "playlist creator icon",
            clickHandler: e => {
                e.preventDefault();
                nextPage("toPlaylistCreator", null);
            }
        }
    ]);

    const nav = document.createElement("nav");

    nav.classList.add("main-dark-bg-color");
    appendChildren([upper, lower], nav);

    const slideButton = document.createElement("button");
    setClasses(slideButton, ["button", "main-dark-bg-color"]);
    slideButton.innerText = "▶";


    slideButton.addEventListener("click", () => {
        nav.classList.add("show");
    });
    window.addEventListener("click", e => {
        /* buscar nav de nuevo porque podría haber sido eliminado */
        const nav = document.querySelector("aside nav");
        const slideButton = document.querySelector("aside button");
        if (nav !== null && !isInDOMTree(e.target, nav) && slideButton !== e.target)
            nav.classList.remove("show");
    });

    return appendChildren([slideButton, nav], root);
}

/**
 * @param {HTMLElement} root
 * @return {HTMLElement}
 */
 function SidebarDefault(root) {
    return root;
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