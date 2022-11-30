/**
 * TODO:
 *  - encapsular esto para evitar stack como variable global y permitir inicializar la pagina inicial del historial 
 *  - ver si se puede unificar __PageHistory y __PageStack (estoy seguro que si)
 *  - ver navegacion hacia adelante (complica el manejo simple de estado mediante __PageStack y window.location.hash)
 *  - hacer mas pruebas con MIN_TIME_BETWEEN_EVENT_THRESHOLD
 */

/** @type {[MKeys, StateChange][]} - stack inicializado con la pagina inicial */
const __PageHistory = [
    ["logOut", undefined]
];

/** @type {[MKeys, StateChange][]} */
const __PageStack = [];

/**
 * @param {MKeys} mutationName
 * @param {StateChange} newState
 */
function nextPage(mutationName, newState) {
    /** @type {[MKeys, StateChange]} */
    const newEntry = [mutationName, newState];
    __PageStack.push(__PageHistory[__PageHistory.length - 1]);
    __PageHistory.push(newEntry);
    window.location.hash = mutationName;
    __Store.commit(mutationName, newState);

    /* algunas mutaciones toman 1 solo argumento,
     * pero en javascript esto no importa, el segundo argumento sería ignorado en este caso
     */
}

function prevPage() {
    const [mutationName, restoredState] = __PageStack.pop();
    window.location.hash = mutationName;
    __Store.commit(mutationName, restoredState);
}

window.addEventListener("load", () => {
    const [body,..._] = document.getElementsByTagName("body");

    /**
     * @type {boolean} variable que permite diferenciar entre navegacion desde adentro del documento
     * y desde afuera (i.e.: botones de navegacion del navegador).
     */
    let isInnerNavigation = false;

    // mouse de usuario en la pagina
    body.addEventListener("mouseover", () => {
        isInnerNavigation = true;
    });

    // mouse de usuario abandona la pagina
    body.addEventListener("mouseleave", () => {
        isInnerNavigation = false;
    });

    /** @type {undefined | number} */
    let lastEventTime = 0;
    const MIN_TIME_BETWEEN_EVENT_THRESHOLD = 500;
    window.addEventListener("hashchange", () => {
        const currentTime = new Date().getTime();
        if (currentTime - lastEventTime < MIN_TIME_BETWEEN_EVENT_THRESHOLD)
            return;
        lastEventTime = currentTime;

        if (!isInnerNavigation)
            prevPage();
    });
});