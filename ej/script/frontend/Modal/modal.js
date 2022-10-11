const [logIn, signIn] = document.querySelectorAll(".main-nav ul li a");
const modalContainer = document.querySelector(".modal-container");
const modal = modalContainer.querySelector(".modal")
const closeButton = modal.querySelector(".modal-footer .modal-button");

/**
 * @readonly
 * @enum {number}
 */
const CloseModal = { TRUE: 1, FALSE: 0 };

/**
 * @typedef {Object} ModalData
 * @property {string} title
 * @property {HTMLElement[] | HTMLElement} content
 * @property {{onSubmit: function(Event): CloseModal, text: string}} buttonInfo
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
    const {title, content, buttonInfo: {onSubmit, text}} = modalData;

    closeButton.addEventListener("click", (e) => {
        if (onSubmit(e) === CloseModal.TRUE)
            closeModalClickHandler(e);
    });

    return e => {
        modal.querySelector(".modal-header h1").textContent = title;

        const container = modal.querySelector(".modal-content");
        // llenar contenido
        if (Array.isArray(content))
            foldl((container, c) => {
                container.appendChild(c);
                return  container;
            }, content, container);
        else
            container.appendChild(content);

        closeButton.textContent = text;
        openModalClickHandler(e);
    };
}

modalContainer.addEventListener("click", backdropClickHandler);