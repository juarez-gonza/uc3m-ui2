const __modalContainer = document.querySelector(".modal-container");
const __modal = __modalContainer.querySelector(".modal")

/**
 * 
 * @param {{preventDefault()}} e 
 */
function openModalClickHandler(e) {
    __modalContainer.classList.add("modal-open");
    e.preventDefault();
}

/**
 * 
 * @param {{preventDefault()}} e 
 */
function closeModalClickHandler(e) {
    e.preventDefault();
    __modalContainer.classList.remove("modal-open");
}

/**
 * 
 * @param {Event} e 
 */
function backdropClickHandler(e) {
    if (!isInDOMTree(e.target, __modal))
        closeModalClickHandler(e);
}

/**
 * @param {string} title
 * @param {function(Event): HTMLElement[] | HTMLElement} createContent
 * @return {function(Event)}
 */
function setOpenModalHandler(title, createContent) {

    return e => {
        __modal.querySelector(".modal-header h1").textContent = title;
        
        /** @type {HTMLElement} */
        const container = __modal.querySelector(".modal-content");

        // limpiar contenido de modal previo (no se hace en cierre de modal porque
        // la animación de fade-out requiriría setTimeout mayor al tiempo de fade-out para remover el contenido)
        removeAllChildren(container);

        // crear contenido aquí porque de pasarse el contenido directamente como parámetro, entonces el estado
        // del componente se compartiría entre distintos modales (por ejemplo, los mensajes de error
        // de un formulario nuevo serían los que quedaron en el anterior).
        const content = createContent(e);
        if (Array.isArray(content))
            appendChildren(content, container);
        else
            container.appendChild(content);

        openModalClickHandler(e);
    };
}

/**
 * 
 * @param {string} title
 * @param {string} title2
 * @param {function(Event): HTMLElement[] | HTMLElement} createContent
 * @return {function(Event)}
 */
function setOpenModalHandler2(title,title2, createContent) {

    return e => {
        __modal.querySelector(".modal-header h1").textContent = title;
        
        /** @type {HTMLElement} */
        const container = __modal.querySelector(".modal-content");

        // limpiar contenido de modal previo (no se hace en cierre de modal porque
        // la animación de fade-out requiriría setTimeout mayor al tiempo de fade-out para remover el contenido)
        removeAllChildren(container);

        // crear contenido aquí porque de pasarse el contenido directamente como parámetro, entonces el estado
        // del componente se compartiría entre distintos modales (por ejemplo, los mensajes de error
        // de un formulario nuevo serían los que quedaron en el anterior).
        const content = createContent(e);
        if (Array.isArray(content))
            appendChildren(content, container);
        else
            container.appendChild(content);

        openModalClickHandler(e);
    };
}
__modalContainer.addEventListener("click", backdropClickHandler);