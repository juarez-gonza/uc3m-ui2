/**
 * @param {function(SubmitEvent, string, Song[]): any}  onSuccess
 * @param {function(SubmitEvent, string): any}  onError
 * @return {function(SubmitEvent): any}
 */
function onSubmitPlaylistCreatorHandler(onSuccess, onError) {
    return e => {
        /** @type {HTMLInputElement} */
        const newTitleInput = document.querySelector(".new-playlist input");

        const cards = Array.from(document.querySelectorAll(".new-playlist .playlist .card-container .music-card"));
        if (cards.length < 1)
            return onError(e, "Cannot create a playlist with 0 songs");

        const songs = cards.map(card => Song.find(card.id));
        return onSuccess(e, newTitleInput.value, songs)
    }
}

/**
 * 
 * @param {User} user 
 * @param {HTMLFormElement} form
 * @return {function(SubmitEvent, string, Song[]): any}
 */
function setOnPlaylistCreatorSuccess(user, form) {
    return (e, newTitle, songs) => {
        try {
            user.addPlaylist(newTitle, songs);
            user.save();
            __Store.commit("toCheckPlaylists");
        } catch (err) {
            if (err.name !== "RepetitionError") 
                throw err; // re-throw error desconocido
            return setShowErrorFormMsg(form)(e, "There is a pre-existent playlist with this name");
        }
    }
}

/**
 * @param {Event} e
 */
function clearPlaylistCreatorCards(e) {
    removeAllChildren(document.querySelector(".new-playlist .playlist .card-container"));
}

/** @readonly @type {string} */
const PlaylistCreatorFormID = "new-playlist-form";

/** 
 * @param {string|undefined} value
 * @return {InputData[]}
 */
function getPlaylistCreatorFieldsData(value) {
    return [
        {
            id: "playlist-name", label: "Your playlist name", type: "text",
            inputValidation: {
                errorMsg: "A name for the playlist is required",
                attributes: {
                    required: true,
                }
            },
            extraAttributes: {
                placeholder: "playlist-name",
                value: value !== undefined ? value : "",
            }
        },
    ];
}

/** @readonly @type {ButtonData[]} */
const PlaylistCreatorButtons = [
    {
        text: "Add new playlist!",
        classes: ["main-dark-bg-color", "button"],
        extraAttributes: {
            type: "submit",
        },
        onClickHandler: undefined
    },
    {
        text: "Reset Playlist",
        classes: ["secondary-light-bg-color", "button"],
        extraAttributes: {
            type: "reset",
        },
        onClickHandler: clearPlaylistCreatorCards
    }
];

/**
 * 
 * @param {HTMLElement} root 
 * @return {function(Song[]): any}
 */
function replaceFoundSongsContent(root) {
    return songs => {
        const currentFoundSongs = root.querySelector("#found-songs");
        if (currentFoundSongs !== null)
            currentFoundSongs.remove();

        const decoratedContainer = foundSongsContainer(songs);
        if (songs.length === 0)
            getUnderlyingCardContainer(decoratedContainer).textContent = "...No songs were found";
        else
            DraggableCardContainer(
                decoratedContainer,
                setOnDraggableStart(id),
                setOnDraggableEnd(id),
                setOnContainerDragover(id)
            );

        root.appendChild(decoratedContainer);
    };
}


/**
 * @param {User} user
 * @param {Playlist | null} playlist
 * @return {Element}
 */
function newPlaylistContent(user, playlist) {
    const playlistSongs = playlist !== null ? playlist.songs : [];
    const playlistTitle = playlist !== null ? playlist.name : undefined;
    const playlistId = playlist !== null ? playlist._id : "new-playlist-songs";

    const ret = document.createElement("div");
    ret.classList.add("new-playlist");

    const form = Form(getPlaylistCreatorFieldsData(playlistTitle), PlaylistCreatorButtons, null, PlaylistCreatorFormID);
    form.addEventListener("submit",
                            onSubmitPlaylistCreatorHandler(
                                setOnPlaylistCreatorSuccess(user, form),
                                setShowErrorFormMsg(form)
                        ));

    /* contenedor con canciones de la nueva playlist */
    let decoratedContainer = CardContainer(
        songsCardData("Drag and drop your songs here!", playlistId, playlistSongs)
    );

    if (playlist !== null)
        [decoratedContainer,] = DeletableCardSection([decoratedContainer], setOnDeletePlaylistHandler);

    DraggableCardContainer(
        decoratedContainer,
        setOnDraggableStart(id),
        setOnDraggableEnd(id),
        setOnContainerDragover(id)
    );

    /* botón de submit */
    const button = document.createElement("button");
    setClasses(button, ["button", "main-dark-bg-color"]);
    button.textContent = "Create playlist!";

    return appendChildren([form, decoratedContainer], ret);
}

/**
 * 
 * @param {HTMLElement} root 
 * @param {User} user 
 * @param {Playlist | null} playlist
 * @return {HTMLElement}
 */
function PlaylistCreatorContent(root, user, playlist) {
    const title = document.createElement("h1");
    title.textContent = "Playlist Creation Page";
    title.classList.add("main-title");

    const songsFoundContent = foundSongsContainer([]);

    return appendChildren([
        title,
        newPlaylistContent(user, playlist),
        Searchbar(
            "Look for songs to add to your playlist",
            findSongs,
            replaceFoundSongsContent(root)
        ),
        songsFoundContent
    ], root);
}