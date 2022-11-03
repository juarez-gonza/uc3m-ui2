/**
 * @param {Playlist[]} playlists
 * @return {CardContainerData[]}
 */
function allPlaylistsData(playlists) {
    return playlists.map(p => songsCardData(`Playlist: ${p.name}`, p._id, "" ,p.songs));
}

/**
 * 
 * @param {Element} decoratedContainer
 * @return {function(MouseEvent): any}
 */
function setOnDeletePlaylistHandler(decoratedContainer) {
    return e => {
        Playlist.find(decoratedContainer.id).remove();
        refreshLoggedIn();
        __Store.commit("toCheckPlaylists");
    };
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
    refreshLoggedIn();
}

/**
 * @param {Playlist[]} elements
 * @return {string}
 */
 function NoResultsMessagePlaylists(elements){
    let mensaje=""
    if (elements.length===0)
        mensaje="No Playlists were found... Create a new Playlist";
    return mensaje;
}

/**
 * @param {HTMLElement} root
 * @param {User} user
 */
function PlaylistContent(root, user) {
    const title = document.createElement("h1");
    title.textContent = "Your playlists";
    title.classList.add("main-title");
    const mensaje = document.createElement("h3");
    mensaje.textContent = NoResultsMessagePlaylists(user.playlists);

    let playlistSection = DraggableCardSection(
        allPlaylistsData(user.playlists),
        setOnDraggableStart(id),
        setOnDraggableEnd(onPlaylistInsertion),
        setOnContainerDragover(id),
    );

    if (user._id === __Store.state.loggedIn._id)
        playlistSection = DeletableCardSection(playlistSection, setOnDeletePlaylistHandler);

    return appendChildren([title, ...playlistSection,mensaje], root);
}