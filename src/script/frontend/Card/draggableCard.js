/**
 * Crea una card section donde los elementos son draggables
 * @param {CardContainerData[]} cardData  - datos
 * @param {function(Element, Element): function(DragEvent): any} setOnDragstart - función como la retornada por setOnDraggableStart
 * @param {function(Element, Element): function(DragEvent): any} setOnDragend - función como la retornada por setOnDraggableEnd
 * @param {function(Element): function(DragEvent): any} setOnDragover  - función como la retornada por setOnContainerDragover
 * @return {Element[]}
 */
function DraggableCardSection(cardData, setOnDragstart, setOnDragend, setOnDragover) {
    // un elemento de decoratedContainers tiene un titulo y el verdadero contenedor de cartas
    const decoratedContainers = CardContainerSection(cardData);
    return foldl((decoratedContainers, dc) => {
        decoratedContainers.push(DraggableCardContainer(dc, setOnDragstart, setOnDragend, setOnDragover));
        return decoratedContainers;
    }, decoratedContainers, []);
}

/**
 * Añade a un card container (y sus cartas contenidas) lo necesario para soportar drag and drop
 * @param {Element} decoratedCardContainer  - elemento como el retornado por CardContainer()
 * @param {function(Element, Element): function(DragEvent): any} setOnDragstart - función como la retornada por setOnDraggableStart
 * @param {function(Element, Element): function(DragEvent): any} setOnDragend - función como la retornada por setOnDraggableEnd
 * @param {function(Element): function(DragEvent): any} setOnDragover  - función como la retornada por setOnContainerDragover
 * @return {Element}
 */
function DraggableCardContainer(decoratedCardContainer, setOnDragstart, setOnDragend, setOnDragover) {
    const cardContainer = getUnderlyingCardContainer(decoratedCardContainer);
    assignDraggableContainerEvents(cardContainer, setOnDragover(cardContainer));
    foldl((container, card) => {
        DraggableCard(card, setOnDragstart(card, container), setOnDragend(card, container))
        return container;
    }, Array.from(cardContainer.querySelectorAll(".music-card")), cardContainer);
    return decoratedCardContainer;
}

/**
 * Añade a un card container (y sus cartas contenidas) lo necesario para soportar drag and drop
 * @param {Element} card  - html de carta. como el retornado por SongCard, ArtistCard, etc.
 * @param {function(DragEvent): any} onDragstart - dragstart event handler
 * @param {function(DragEvent): any} onDragend - dragend eventhandler
 * @return {Element}
 */
function DraggableCard(card, onDragstart, onDragend) {
    card.classList.add("draggable");
    return assignDraggableEvents(card, onDragstart, onDragend);
}

/**
 * Toma una función que recibirá la carta draggable y el contenedor donde inicia el dragging
 * de la carta. Retorna el event handler de dragstart
 * @param {function(DragEvent, Element, Element): any} onDragstart
 * @return {function(Element, Element): (function(DragEvent): any)}
 */
function setOnDraggableStart(onDragstart) {
    return (card, initialContainer) => e => {
        card.classList.add("dragging");
        onDragstart(e, card, initialContainer);
    };
}

/**
 * Toma una función que recibirá la carta draggable, el contenedor donde inicia el dragging,
 * y el contenedor donde finaliza el dragging de la carta. Retorna el event handler de dragstop
 * @param {function(DragEvent, Element, Element, Element): any} onDragend
 * @return {function(Element, Element): (function(DragEvent): any)}
 */
function setOnDraggableEnd(onDragend) {
    return (card, initialContainer) => e => {
        card.classList.remove("dragging");
        onDragend(e, card, initialContainer, card.parentElement);
    };
}

/**
 * Toma una función que recibe el elemento draggeado, el elemento siguiente en el contenedor donde esté tomando lugar
 * el drag, y el contenedor en sí. Retorna una función que dado un contenedor retorna el event handler.
 * @param {function(Element, Element, Element): any} onInsert - handler post inserción, toma 3 elementos
 * @return {function(Element): (function(DragEvent): any)} - retorna una función curried que toma un contenedor y retorna el event handler en sí
 */
function setOnContainerDragover(onInsert) {
    return container => e => {
        // por default no se pueden soltar items con drag and drop en un contenedor
        e.preventDefault(); 
        const draggable = document.querySelector(".dragging");

        // a veces el evento hace trigger solo, provocando errores de referencia
        if (draggable === null)
            return;

        const subseqElement = getDragAfterElement(container, e.clientX, e.clientY);
        if (subseqElement == null)
            return container.appendChild(draggable);
        container.insertBefore(draggable, subseqElement);
        onInsert(draggable, subseqElement, container);
        return draggable;
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
 * Busca en el contenedor de múltiples filas y columnas, la carta draggeale
 * más próxima a las coordenadas (x, y) pasadas como argumento
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
 * @param {function(DragEvent): any} onDragstart
 * @param {function(DragEvent): any} onDragend
 * @return {Element}
 */
function assignDraggableEvents(draggable, onDragstart, onDragend) {
    draggable.addEventListener("dragstart",  onDragstart);
    draggable.addEventListener("dragend", onDragend);
    return draggable;
}

/**
 * 
 * @param {Element} container 
 * @param {function(DragEvent): any} onDragover 
 * @returns 
 */
function assignDraggableContainerEvents(container, onDragover) {
    container.addEventListener("dragover", onDragover);
    return container;
}