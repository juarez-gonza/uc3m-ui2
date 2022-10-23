/**
 * @param {string} title
 * @param {Song[]} songs
 * @param {function(Song):CommonCardData} genCardCommon
 */
function songsContainer(title, songs, genCardCommon) {
    return CardContainer({
        title: title,
        containerType: CardContainerType.SongCard,
        data: songs.map(s => ({
            song: s,
            playable: true,
            commonProperties: genCardCommon(s),
        }))
    });
}

/**
 * 
 * @param {Album} album 
 * @return {HTMLElement}
 */
function albumSongsContainer(album) {
    return songsContainer(
        `Album: ${album.title}, by ${album.artist}`,
        album.songs,
        () => ({
            clickHandler: undefined,
            intervalUpdate: undefined,
            badgeMessage: undefined
        }));
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
 * @return {HTMLElement}
 */
function artistSingles(artist) {
    return songsContainer(
        `${artist.name} singles`,
        take(artist.songs, 5),
        () => ({
            clickHandler: undefined,
            intervalUpdate: undefined,
            badgeMessage: undefined
        }));
}

/**
 * 
 * @param {Artist} artist 
 * @return {HTMLElement}
 */
function artistAlbums(artist) {
    return CardContainer({
        title: `Albums by ${artist.name}`,
        containerType: CardContainerType.AlbumCard,
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