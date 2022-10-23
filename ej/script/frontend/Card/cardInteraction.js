/**
 * 
 * @param {Artist} artist 
 * @return {function(MouseEvent): any}
 */
function setArtistClickHandler(artist) {
    return e => {
        __Store.commit("toArtistPage", artist);
    };
}

/**
 * 
 * @param {Song} song
 * @return {function(MouseEvent): any}
 */
function setClickToLikeHandler(song) {
    return e => {
        /** @type {Element} */
        // @ts-ignore e.target tiene tipo EventTarget y eso no puede castearse a Element o Node en JSDoc
        const tg = e.target;

        // si el boton de like no fue clickeado, retornar inmediatamente
        if (!tg.parentElement.classList.contains("like-button-section"))
            return;

        const liked = isLikedByLoggedIn(song)
 
        // actualizar estilo de botón de acuerdo al nuevo valor
        const likeSection = tg.parentElement;
        likeSection.removeChild(tg);
        const likeButton = LikeButton(!liked)
        likeSection.appendChild(likeButton);

        // actualizar localStorage
        toggleLike(liked, song);
    };
}