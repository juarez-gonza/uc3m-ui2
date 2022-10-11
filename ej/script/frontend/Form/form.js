/** @typedef {Object} InputField
 *  @property {string} id
 *  @property {string} label
 *  @property {string} type
 */
/**
 * @param {InputField} fields
 * @return {HTMLElement}
 */
function Input(fields) {
    const {id, label, type} = fields;
    const ret = document.createElement("div");
    ret.classList.add("input");
    ret.innerHTML = `
        <label for="${id}">${label}</label>
        <input type="${type}" id="${id}" name="${id}">
    `;
    return ret;
}

/**
 * 
 * @param {InputField[]} inputs 
 * @return {HTMLElement}
 */
function InputFields(inputs) {
    const ret = document.createElement("div");
    ret.classList.add("form");

    foldl((container, field) => {
        container.appendChild(field);
        return container;
    }, inputs.map(i => Input(i)), ret);

    return ret;
}

logIn.addEventListener("click", setOpenModalHandler({
    title: "Enter your credentials:",
    content: InputFields([
        {id: "username", label: "Your username", type: "text"},
        {id: "password", label: "Your password", type: "password"}
    ]),
    buttonInfo: {
        text: "Log In!",
        onSubmit: (e) => { console.log("submiting"); return CloseModal.FALSE; }
    }
}));

signIn.addEventListener("click", setOpenModalHandler({
    title: "Register",
    content: [],
    buttonInfo: {
        text: "Sign In!",
        onSubmit: (e) => { console.log("submiting"); return CloseModal.FALSE; }
    }
}));