/**
 * @param {Song[]} favSongs
 * @return {CardContainerData}
 */
function favSongsData(favSongs) {
    return {
        title: "Your favourite songs",
        songs: favSongs
    };
}

/**
 * @param {Playlist} playlist
 * @return {CardContainerData}
 */
function playlistData(playlist) {
    return {
        title: `Playlist: ${playlist.name}`,
        songs: playlist.songs
    };
}

/**
 * @param {Playlist[]} playlists
 * @return {CardContainerData[]}
 */
function allPlaylistsData(playlists) {
    return playlists.map(p => playlistData(p));
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
    root.appendChild(title);

    const content = [...allPlaylistsData(user.playlists), favSongsData(user.favSongs)];

    return appendChildren(CardContainerSection(content), root);
}