/** TODO: leave one between songsContainer in this file and songsCardData in homeContent.js */
/**
 * @param {string} title
 * @param {Song[]} songs
 * @return {Element}
 */
function songsContainer(title, id, songs) {
    return CardContainer({
        title: title,
        id: id,
        containerType: CardContainerType.SongCard,
        emptyMessage:"",
        data: songs.map(s => ({
            song: s,
            playable: true,
            likeable: {
                liked: isLikedByLoggedIn(s)
            },
            commonProperties: {
                clickHandler: setClickToLikeHandler(s),
                intervalUpdate: undefined,
                badgeMessage: undefined,
            },
        }))
    });
}

/**
 * 
 * @param {Album} album 
 * @return {Element}
 */
function albumSongsContainer(album) {
    return songsContainer(`Album: ${album.title}, by ${album.artist}`, album._id, album.songs);
}

/**
 * 
 * @param {Artist} artist 
 * @return {HTMLElement[]}
 */
function artistAlbumSongs(artist) {
    return foldl((acc, a) => {
        acc.push(albumSongsContainer(a));
        return acc;
    }, artist.albums, []);
}

/**
 * 
 * @param {Artist} artist 
 * @return {Element}
 */
function artistSingles(artist) {
    return songsContainer(`${artist.name} singles`, "singles", take(artist.songs, 5));
}

/**
 * 
 * @param {Artist} artist 
 * @return {Element}
 */
function artistAlbums(artist) {
    return CardContainer({
        title: `Albums by ${artist.name}`,
        id: "Artist albums",
        containerType: CardContainerType.AlbumCard,
        emptyMessage: "",
        data: artist.albums.map(a => ({
            album: a,
            commonProperties: undefined,
        })),
    });
}

/**
 * 
 * @param {HTMLElement} root 
 * @param {User} user 
 * @param {Artist} artist 
 */
function ArtistContent(root, user, artist) {
    const title = document.createElement("h1");
    title.textContent = `${artist.name}`;
    title.classList.add("main-title");
    return appendChildren([
        title,
        artistSingles(artist),
        artistAlbums(artist),
        ...artistAlbumSongs(artist)],
        root);
}