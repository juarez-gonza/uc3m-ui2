/**
 * @readonly
 * @enum {number}
 */
 const SearchCategory = {
    Artists: 0,
    Songs: 1,
    Users: 2,
};

/**
 * @typedef {object} Search
 * @property {SearchCategory} category
 * @property {Song[]} songs
 * @property {Artist[]} artists
 * @property {User[]} users
 */

/**
 * 
 * @param {Search} search
 * @param {User} user
 */
function SelectContent(search, user) {
    switch (search.category) {
        case SearchCategory.Songs:
            return foundSongs(search.songs, user);
        case SearchCategory.Artists:
            return foundArtists(search.artists, user);
        case SearchCategory.Users:
            return foundUsers(search.users, user);
    }
}

/**
 * @param {SearchCategory} newCategory 
 * @param {Search} search
 * @return {function(MouseEvent): any}
 */
function switchSearchCategory(newCategory, search) {
    return e => {
        e.preventDefault();
        nextPage("toSearchPage", {...search, category: newCategory});
    }
}

/**
 * @param {Song[]} songs
 * @param {User} user
 * @return {Element}
 */
 function foundSongs(songs, user) {
    return CardContainer(
        songsCardData("Songs found",
                      "found-songs",
                      NoResultsMessage(songs),
                      songs,
                      user === null ? () => __NoCardProperties : likeableCardProperties));
}

/**
 * @param {Artist[]} artists
 * @param {User} user
 * @return {Element}
 */
function foundArtists(artists, user) {
    return CardContainer(
        artistsCardData("Artitsts found",
                        "artists-songs",
                        NoResultsMessage(artists),
                        artists,
                        user === null ? () => __NoCardProperties : interactableArtistCardProperties));
}

/**
 * @param {User[]} results
 * @param {User} user
 * @return {Element}
 */
 function foundUsers(results, user) {
    return UserIconsSection("Found Users",
                            results.map(u => u._id),
                            NoResultsMessage(results),
                            user === null ? () => id : setClickToUserpage);
}

function Options(items) {
    return appendChildren([...SidebarItems(items)], document.createElement("ul"));
}

/**
 * @param {HTMLElement} root
 * @param {User} user
 * @param {Search} search
 */
function SearchContent(root, user, search) {
    const title = document.createElement("h1");
    title.textContent = "Best results";
    title.classList.add("main-title");
    const foundContent = SelectContent(search, user);
    const upper = Options([
        {
            text: "Songs",
            iconPath: "./icons/icons8-down-arrow-64.png",
            alt: "search songs",
            clickHandler: switchSearchCategory(SearchCategory.Songs, search)
        },
        {
            text: "Artists",
            iconPath:"./icons/icons8-down-arrow-64.png",
            alt: "search artists",
            clickHandler: switchSearchCategory(SearchCategory.Artists, search)
        },
        {
            text: "Users",
            iconPath: "./icons/icons8-down-arrow-64.png",
            alt: "search users",
            clickHandler: switchSearchCategory(SearchCategory.Users, search)
        }
    ]);
    return appendChildren([title, upper, foundContent], root);
}