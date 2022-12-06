/**
 * @param {string} title
 * @param {string} id
 * @param {string} mensaje
 * @param {Song[]} songs
 * @param {function(Song): CommonCardData} setCommonProperties
 * @return {CardContainerData}
 */
function songsCardData(title, id, mensaje, songs, setCommonProperties=()=>__NoCardProperties) {
    return {
        title: title,
        id: id,
        emptyMessage: mensaje,
        containerType: CardContainerType.SongCard,
        data: songs.map(s => ({
            song: s,
            playable: true,
            likeable: likeableByLoggedIn(s),
            commonProperties: setCommonProperties(s),
        }))
    };
}


/**
 * @param {string} title 
 * @param {string} id
 * @param {string} mensaje
 * @param {Playlist[]} playlists
 * @return {CardContainerData}
 */
function playlistCardData(title, id, mensaje, playlists) {
    return {
        title: title,
        id: id,
        emptyMessage: mensaje,
        containerType: CardContainerType.SongCard,
        data: playlists.map(p => ({
            song: p.songs[0],
            playable: false,
            likeable: undefined,
            commonProperties: {
                clickHandler: () => {
                    nextPage("toPlaylistCreator", p);
                },
                intervalUpdate: undefined,
                badgeMessage: undefined,
            },
        }))
    };
}


/**
 * @param {string} title
 * @param {string} id
 * @param {string} mensaje
 * @param {Artist[]} recentArtists
 * @param {function(Artist): CommonCardData} setCommonProperties
 * @return {CardContainerData} 
 */
function artistsCardData(title, id, mensaje, recentArtists, setCommonProperties=()=>__NoCardProperties) {
    return {
        title: title,
        id: id,
        emptyMessage: mensaje,
        containerType: CardContainerType.ArtistCard,
        data: recentArtists.map(a => (
            {
                artist: a,
                commonProperties: setCommonProperties(a)
            }
        ))
    };
}

/**
 * 
 * @param {User[]} users
 * @param {function(User): (function(MouseEvent): any) | undefined} setIconClickHandler
 * @return {HTMLElement[]}
 */
function UserIcons(users, setIconClickHandler) {
    return users.map(u => UserIcon({
            user: u,
            label: {text: u.username},
            clickHandler: setIconClickHandler(u)
        }));
}

/**
 * @param {UserId[]} userIds - ids of users to show
 * @param {function(User): (function(MouseEvent): any) | undefined} setIconClickHandler
 * @param {number} n - number of users to show
 * @return {HTMLElement}
 */
function _UserIconsSection(userIds, setIconClickHandler, n) {
    const users = take(userIds, n).map(uid => User.find(uid));
    const ret = document.createElement("div");
    ret.classList.add("user-icons-section");
    return appendChildren(UserIcons(users, setIconClickHandler), ret);
}

/**
 * @param {string} title
 * @param {UserId[]} userIds - ids of users to show
 * @param {string} notFoundMessage - message when no results are found
 * @param {function(User): (function(MouseEvent): any) | undefined} setIconClickHandler
 * @param {number | undefined} n - number of users to show
 * @return {HTMLElement}
 */
function UserIconsSection(title, userIds, notFoundMessage, setIconClickHandler=()=>id, n=undefined) {
    const ret = document.createElement("div");
    setClasses(ret, ["playlist", "user-icons-section"]);

    const h1Title = document.createElement("h1");
    h1Title.textContent = title;

    const h3Title = document.createElement("h3");
    h3Title.textContent = notFoundMessage;

    const userIcons = _UserIconsSection(userIds, setIconClickHandler, n !== undefined ? n : userIds.length);
    return appendChildren([h1Title, userIcons, h3Title], ret);
}

/**
 * @param {object} elements
 * @return {string}
 */
function NoResultsMessage(elements){
    return elements.length > 0 ? "" : "No results were found for this section... Continue exploring" ;
}

/**
 * @param {User} user
 */
function FollowUserButton(user) {
    const ret = document.createElement("button");
    const isFollowing = __Store.state.loggedIn.isFollowing(user._id);

    setClasses(ret,
                ["follow-button", "button",
                isFollowing ? "main-dark-bg-color" : "main-light-bg-color"]);
    ret.textContent = isFollowing ? `Unfollow ${user.username}` : `Follow ${user.username}`;

    ret.addEventListener("click", () => {
        const loggedIn = __Store.state.loggedIn;
        if (loggedIn.isFollowing(user._id)) {
            loggedIn.unfollowUser(user._id);
            ret.classList.remove("main-dark-bg-color");
            ret.classList.add("main-light-bg-color");
            ret.textContent = `Follow ${user.username}`;
        } else {
            loggedIn.followUser(user._id);
            ret.classList.remove("main-light-bg-color");
            ret.classList.add("main-dark-bg-color");
            ret.textContent = `Unollow ${user.username}`;
        }
        saveAndRefreshLoggedIn();
    });
    return ret;
}

/**
 * @param {HTMLElement} root 
 * @param {User} user
 * @return {HTMLElement}
 */
function HomeContent(root, user) {
    const title = document.createElement("h1");
    title.textContent = `${user.username}'s Home Section`;
    title.classList.add("main-title");

    const songsContent = CardContainerSection([
        artistsCardData("Recently heard artists",
                        "recent-artists",
                        NoResultsMessage(user.recentArtists),
                        user.recentArtists,
                        (a) => ({
                            clickHandler: setArtistClickHandler(a),
                            badgeMessage: undefined,
                            intervalUpdate: undefined,
                        })),
        songsCardData("Recently heard songs", "recent-songs", NoResultsMessage(user.recentSongs), user.recentSongs),
        songsCardData("Favourite songs", "fav-songs", NoResultsMessage(user.favSongs), user.favSongs),
        playlistCardData("Playlists", "your-playlists", NoResultsMessage(user.playlists), user.playlists)
    ]);

    const followedUsers = UserIconsSection("Following", user.following, NoResultsMessage(user.playlists), setClickToUserpage, 5);

    /* comparar por id porque la referencia si puede haber cambiado */
    return __Store.state.loggedIn._id !== user._id ? appendChildren([FollowUserButton(user),
                                                            title,
                                                            ...songsContent,
                                                            followedUsers], root)
            : appendChildren([title, ...songsContent, followedUsers], root);
}