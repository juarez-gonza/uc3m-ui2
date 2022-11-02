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

/**
 * 
 * @param {function(MouseEvent): any} onClickHandler 
 * @return {HTMLImageElement}
 */
function deleteButton(onClickHandler) {
    const img = document.createElement("img");
    img.src = "./icons/icons8-waste-64.png";
    img.classList.add("delete-button");
    img.addEventListener("click", onClickHandler)
    img.alt = "delete these cards";
    return img;
}

/**
 * @param {Element[]} cardContainerSection
 * @param {function(Element): function(MouseEvent): any} setOnContainerDelete
 * @return {Element[]}
 */
function DeletableCardSection(cardContainerSection, setOnContainerDelete) {
    return cardContainerSection.map(cardContainer => {
        cardContainer.classList.add("deletable");
        insertAfter(
            deleteButton(
                setOnContainerDelete(cardContainer)
            ),
            cardContainer.querySelector(".card-container")
        );
        return cardContainer;
    });
}