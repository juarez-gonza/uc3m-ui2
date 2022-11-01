/**
 * @param {Playlist[]} playlists
 * @return {CardContainerData[]}
 */
function allPlaylistsData(playlists) {
    return playlists.map(p => songsCardData(`Playlist: ${p.name}`, p._id, p.songs));
}

/**
 * @param {DragEvent} e
 * @param {Element} draggable
 * @param {Element} initialContainer
 * @param {Element} finalContainer
 */
function onPlaylistInsertion(e, draggable, initialContainer, finalContainer) {
    const initialPlaylist = Playlist.find(initialContainer.parentElement.id);
    const finalPlaylist = initialContainer === finalContainer ?
                        initialPlaylist :
                        Playlist.find(finalContainer.parentElement.id);

    const song = Song.find(draggable.id);
    const nextSong = draggable.nextElementSibling !== null ?
                        Song.find(draggable.nextElementSibling.id)
                        : null;

    initialPlaylist.removeSong(song)
    finalPlaylist.insertBefore(song, nextSong);

    // guardar las playlists
    initialPlaylist.save();
    if (initialPlaylist !== finalPlaylist)
        finalPlaylist.save();

    // repopular las playlists del usuario guardado con la información nueva.
    __Store.state.loggedIn = User.find(__Store.state.loggedIn._id);
}

/**
 * @param {HTMLElement} root
 * @param {User} user
 */
function PlaylistContent(root, user) {
    const title = document.createElement("h1");
    title.textContent = "Your playlists";
    title.classList.add("main-title");

    const playlistSection = DraggableCardSection(
        allPlaylistsData(user.playlists),
        setOnDraggableStart(id),
        setOnDraggableEnd(onPlaylistInsertion),
        setOnContainerDragover(id),
    );
    return appendChildren([title, ...playlistSection], root);
}