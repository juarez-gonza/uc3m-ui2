/**
 * @param {Element} card
 * @return {function(Event): any}
 */
function setOnDraggableStart(card) {
    return e => {
        card.classList.add("dragging");
    };
}

/**
 * @param {Element} card
 * @return {function(MouseEvent): any}
 */
function setOnDraggableEnd(card) {
    return e => {
        card.classList.remove("dragging");
    };
}

/**
 * @param {Element} container
 * @return {function(MouseEvent): any}
 */
function setOnDragoverContainer(container) {
    return e => {
    };
}

/**
 * @param {Element} container
 * @return {function(MouseEvent): any}
 */
function setOnContainerDragover(container) {
    return e => {
        // por default no se pueden soltar items con drag and drop en un contenedor
        e.preventDefault(); 
        const draggable = document.querySelector(".dragging");
        const subseqElement = getDragAfterElement(container, e.clientX, e.clientY);
        if (subseqElement == null)
            return container.appendChild(draggable);
        return container.insertBefore(draggable, subseqElement);
    };
}

/**
 * @param {HTMLElement} elem
 */
function makeDraggable(elem) {
    elem.draggable = true;
    elem.classList.add("draggable");
}

/**
 * 
 * @param {Element} container 
 * @param {number} x 
 * @param {number} y 
 * @return {Element} 
 */
function getDragAfterElement(container, x, y) {
    // retornar element más cercano a las coordenadas x y
    return foldl((closest, child) => {
        const box = child.getBoundingClientRect();
        const offsetX = x - box.right;
        const offsetY = y - box.top - box.height / 2;

        if (offsetY < 0
            && offsetX < 0
            && offsetX > closest.offsetX
            && offsetY > closest.offsetY)
            return { offsetX, offsetY, element: child };
        return closest;
    },
    // obtener draggables dentro del container
    [...container.querySelectorAll(".draggable:not(.dragging)")],
    // elemento identidad de la reducción, offset muy negativo para que cualquier
    // elemento candidato tenga un offset menos negativo que el inicial
    {
        offsetX: Number.NEGATIVE_INFINITY,
        offsetY: Number.NEGATIVE_INFINITY,
        element: null,
    }).element;
}

/**
 * 
 * @param {Element} draggable 
 * @param {function(MouseEvent): any} onDragstart
 * @param {function(MouseEvent): any} onDragend
 * @return {Element}
 */
function setDraggableEvents(draggable, onDragstart, onDragend) {
    draggable.addEventListener("dragstart", onDragstart);
    draggable.addEventListener("dragend", onDragend);
    return draggable;
}

/**
 * 
 * @param {Element} container 
 * @param {function(MouseEvent): any} onDragover 
 * @returns 
 */
function setDraggableContainerEvents(container, onDragover) {
    container.addEventListener("dragover", onDragover);
    return container;
}

/**
 * 
 * @param {CardContainerData[]} playlists 
 * @param {function(Element): function(MouseEvent): any} setOnDragstart
 * @param {function(Element): function(MouseEvent): any} setOnDragend
 * @param {function(Element): function(MouseEvent): any} setOnDragover 
 * @return {HTMLElement[]}
 */
function DraggableCardSection(playlists, setOnDragstart, setOnDragend, setOnDragover) {
    // un elemento de decoratedContainers tiene un titulo y el verdadero contenedor de cartas
    const decoratedContainers = CardContainerSection(playlists);
    for (const dc of decoratedContainers) {
        // tomar el verdadero contenedor de cartas
        const cardContainer = dc.querySelector(".card-container");
        setDraggableContainerEvents(cardContainer, setOnDragover(cardContainer));

        for (const c of cardContainer.querySelectorAll(".music-card")) {
            c.classList.add("draggable");
            setDraggableEvents(c, setOnDragstart(c), setOnDragend(c));
        }
    }
    return decoratedContainers;
}

/**
 * @param {Playlist[]} playlists
 * @return {CardContainerData[]}
 */
function allPlaylistsData(playlists) {
    return playlists.map(p => songsCardData(`Playlist: ${p.name}`, p.songs));
}

/**
 * @param {HTMLElement} root
 * @param {User} user
 */
function PlaylistContent(root, user) {
    const title = document.createElement("h1");
    title.textContent = "Your playlists";
    title.classList.add("main-title");

    /** @type {HTMLElement[]} */
    const playlistSection = DraggableCardSection(
        allPlaylistsData(user.playlists),
        setOnDraggableStart,
        setOnDraggableEnd,
        setOnContainerDragover);
    return appendChildren([title, ...playlistSection], root);
}