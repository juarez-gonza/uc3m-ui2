const modalContainer = document.querySelector(".modal-container");
const modal = modalContainer.querySelector(".modal")

/**
 * @readonly
 * @enum {number}
 */
const CloseModal = { TRUE: 1, FALSE: 0 };

/**
 * @typedef {Object} ModalData
 * @property {string} title
 * @property {HTMLElement[] | HTMLElement} content
 */

/**
 * 
 * @param {{preventDefault()}} e 
 */
function openModalClickHandler(e) {
    modalContainer.classList.add("modal-open");
    e.preventDefault();
}

/**
 * 
 * @param {{preventDefault()}} e 
 */
function closeModalClickHandler(e) {
    e.preventDefault();
    modalContainer.classList.remove("modal-open");
}

/**
 * 
 * @param {Event} e 
 */
function backdropClickHandler(e) {
    if (!isInDOMTree(e.target, modal))
        closeModalClickHandler(e);
}

/**
 * 
 * @param {ModalData} modalData 
 * @return {function({preventDefault()})}
 */
function setOpenModalHandler(modalData) {
    const {title, content} = modalData;

    return e => {
        modal.querySelector(".modal-header h1").textContent = title;

        const container = modal.querySelector(".modal-content");
        // limpiar contenido de modal previo (no se hace en cierre de modal porque
        // la animación de fade-out requiriría setTimeout mayor al tiempo de fade-out para remover el contenido)
        removeAllChildren(container);
        // llenar contenido
        if (Array.isArray(content))
            foldl((container, c) => {
                container.appendChild(c);
                return  container;
            }, content, container);
        else
            container.appendChild(content);

        openModalClickHandler(e);
    };
}

modalContainer.addEventListener("click", backdropClickHandler);
