/**
 * @param {string} title
 * @param {string} id
 * @param {Song[]} songs
 * @return {CardContainerData}
 */
function songsCardData(title, id, songs) {
    return {
        title: title,
        id: id,
        containerType: CardContainerType.SongCard,
        data: songs.map(s => ({
            song: s,
            playable: true,
            likeable: {liked: isLikedByLoggedIn(s)},
            commonProperties: {
                clickHandler: setClickToLikeHandler(s),
                intervalUpdate: undefined,
                badgeMessage: undefined,
            },
        }))
    };
}

/**
 * @param {string} title
 * @param {string} id
 * @param {Playlist[]} playlists
 * @return {CardContainerData}
 */
function playlistCardData(title, id, playlists) {
    return {
        title: title,
        id: id,
        containerType: CardContainerType.SongCard,
        data: playlists.map(p => ({
            song: p.songs[0],
            playable: false,
            likeable: undefined,
            commonProperties: {
                clickHandler: () => {
                    __Store.commit("toPlaylistCreator", p);
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
 * @param {Artist[]} recentArtists
 * @return {CardContainerData} 
 */
function artistsCardData(title, id, recentArtists) {
    return {
        title: title,
        id: id,
        containerType: CardContainerType.ArtistCard,
        data: recentArtists.map(a => (
            {
                artist: a,
                commonProperties: {
                    clickHandler: setArtistClickHandler(a),
                    badgeMessage: undefined,
                    intervalUpdate: undefined,
                }
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
            clickHandler: setIconClickHandler(u)
        }));
}

/**
 * @param {UserId[]} userIds - ids of users to show
 * @param {number} n - number of users to show
 * @return {HTMLElement}
 */
function _UserIconsSection(userIds, n) {
    const users = take(userIds, n).map(uid => User.find(uid));
    const ret = document.createElement("div");
    ret.classList.add("user-icons-section");
    return appendChildren(UserIcons(users, setClickToUserpage), ret);
}

/**
 * @param {string} title
 * @param {UserId[]} userIds - ids of users to show
 * @param {number} n - number of users to show
 * @return {HTMLElement}
 */
function UserIconsSection(title, userIds, n) {
    const ret = document.createElement("div");
    setClasses(ret, ["playlist", "user-icons-section"])

    const h1Title = document.createElement("h1");
    h1Title.textContent = title;

    const userIcons = _UserIconsSection(userIds, n);
    return appendChildren([h1Title, userIcons], ret);
}

/**
 * 
 * @param {HTMLElement} root 
 * @param {User} user
 * @return {HTMLElement}
 */
function HomeContent(root, user) {
    const title = document.createElement("h1");
    title.textContent = `${user.username}'s Home Section`;
    title.classList.add("main-title");

    const songsContent = CardContainerSection([
        artistsCardData("Recently heard artists", "recent-artists", user.recentArtists),
        songsCardData("Recently heard songs", "recent-songs", user.recentSongs),
        songsCardData("Favourite songs", "fav-songs", user.favSongs),
        playlistCardData("Your playlists", "your-playlists", user.playlists)
    ]);

    const followedUsers = UserIconsSection("Following", user.following, 5);

    return appendChildren([title, ...songsContent, followedUsers], root);
}