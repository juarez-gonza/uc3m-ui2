const [logIn, signIn] = document.querySelectorAll(".main-nav ul li a");
const modalContainer = document.querySelector(".modal-container");
const modal = modalContainer.querySelector(".modal")
const closeButton = modal.querySelector(".modal-footer .modal-button");

/**
 * 
 * @param {ChildNode} target 
 * @param {ChildNode} root 
 * @return {boolean}
 */
function isInTree(target, root) {
    return target === root ||
        Array.from(root.childNodes).some(v => isInTree(target, v));
}

function openModalClickHandler(e) {
    e.preventDefault();
    modalContainer.classList.add("modal-open");
}

function closeModalClickHandler(e) {
    e.preventDefault();
    modalContainer.classList.remove("modal-open");
}

function backdropClickHandler(e) {
    if (!isInTree(e.target, modal))
        closeModalClickHandler(e);
}

logIn.addEventListener("click", openModalClickHandler);
signIn.addEventListener("click", openModalClickHandler);

closeButton.addEventListener("click", closeModalClickHandler);
modalContainer.addEventListener("click", backdropClickHandler);