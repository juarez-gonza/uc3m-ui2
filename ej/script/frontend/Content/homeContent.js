/**
 * @param {string} title
 * @param {Song[]} songs
 * @return {CardContainerData}
 */
function songsCardData(title, songs) {
    return {
        title: title,
        cardType: CardType.SongCard,
        data: songs
    };
}

/**
 * @param {Playlist[]} playlists
 * @return {CardContainerData[]}
 */
function allPlaylistsData(playlists) {
    return playlists.map(p => songsCardData(`Playlist: ${p.name}`, p.songs));
}

/**
 * @param {string} title
 * @param {Artist[]} recentArtists
 * @return {CardContainerData} 
 */
function artistsCardData(title, recentArtists) {
    return {
        title: title,
        cardType: CardType.ArtistCard,
        data: recentArtists
    };
}

/**
 * 
 * @param {HTMLElement} root 
 * @param {User} user 
 */
function HomeContent(root, user) {
    const title = document.createElement("h1");
    title.textContent = "Your Home Section";
    title.classList.add("main-title");
    const songsContent = CardContainerSection([
        artistsCardData("Recently heard artists", user.recentArtists),
        songsCardData("Recently heard songs", user.recentSongs),
        songsCardData("Your favourite songs", user.favSongs),
        ...allPlaylistsData(user.playlists)]);
    return appendChildren([title, ...songsContent], root);
}