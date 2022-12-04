/** @typedef {Object} InputData
 *  @property {string} id
 *  @property {string} label
 *  @property {string} type
 *  @property {undefined|{attributes: Object, errorMsg: string}} inputValidation
 *  @property {Object|undefined} extraAttributes
 */

/** @typedef {Object} ButtonData
 *  @property {string} text 
 *  @property {function(Event): any} onClickHandler 
 *  @property {string[]} classes 
 *  @property {Object|undefined} extraAttributes
 */

/** @typedef {Object} IconsListData
 *  @property {string} upperText
 *  @property {string[]} iconsPath
 */

/**
 * @param {InputData} fields
 * @return {HTMLElement}
 */
function Input(fields) {
    const {id, label, type, inputValidation, extraAttributes} = fields;
    const validationStr = inputValidation === undefined ? "" : objToAttrStr(inputValidation.attributes);
    const extraAttrStr = extraAttributes === undefined ? "" : objToAttrStr(extraAttributes);

    const ret = document.createElement("div");
    ret.innerHTML = `
        <label for="${id}">
            ${label}
            ${validationStr.length > 0 && "required" in inputValidation.attributes ? `<span style="color: red"> *</span>` : ""}
        </label>
        <input type="${type}" id="${id}" name="${id}" ${validationStr} ${extraAttrStr}>
        ${
            inputValidation === undefined ? 
            ""
            : `
            <span class="input-error-message">${inputValidation.errorMsg}</span>
            `
        }
    `;
    ret.classList.add("input");
    return ret;
}

/**
 * 
 * @param {InputData[]} inputs 
 * @return {HTMLElement[]}
 */
function InputFields(inputs) {
    return inputs.map(i => Input(i))
}

/**
 * @param {string} iconPath
 * @return {HTMLImageElement}
 */
function Icon(iconPath) {
    const icon = document.createElement("img");
    icon.src = iconPath;
    icon.alt = "icon";
    return icon;
}

/**
 * @param {string[]} iconsPath
 * @return {HTMLUListElement}
 */
function IconList(iconsPath) {
    const listItems = iconsPath.map(iconPath => {
        const li = document.createElement("li");
        li.appendChild(Icon(iconPath));
        return li;
    });

    return appendChildren(listItems, document.createElement("ul"));
}

/**
 * 
 * @param {IconsListData} iconsPath 
 * @return {HTMLElement}
 */
function IconListSection({upperText, iconsPath}) {
    const list = IconList(iconsPath);

    const listTitle = document.createElement("h5");
    listTitle.textContent = upperText;

    const ret = document.createElement("div");
    ret.appendChild(listTitle);
    ret.appendChild(list);

    ret.classList.add("form-icons-list");

    return ret;
}

/**
 * @param {ButtonData} btnData
 * @return {HTMLButtonElement}
 */
function Button({text, classes, onClickHandler, extraAttributes}) {
    const btn = document.createElement("button")
    btn.textContent = text;
    btn.addEventListener("click", onClickHandler);
    setClasses(btn, classes);
    if (extraAttributes !== undefined)
        setAttributes(btn, extraAttributes);
    return btn;
}

/**
 * 
 * @param {ButtonData[]} btnsData 
 * @return {HTMLElement[]}
 */
function FormButtons(btnsData) {
    return btnsData.map(bData => Button(bData));
}

/**
 * 
 * @param {ButtonData[]} btnsData 
 * @return {HTMLElement}
 */
function ButtonSection(btnsData) {
    const ret = appendChildren(FormButtons(btnsData), document.createElement("div"));
    ret.classList.add("form-buttons-section");
    return ret;
}

/**
 * @return {HTMLDivElement}
 */
function BigFormMsg() {
    const errorMsg = document.createElement("div");
    errorMsg.innerHTML = `<h3>Some Message</h3>`;
    setClasses(errorMsg, ["big-form-msg", "shadow2"]);
    errorMsg.classList.add("big-form-msg");
    return errorMsg
}

/**
 * 
 * @param {InputData[]} fieldsData 
 * @param {ButtonData[]} btnsData 
 * @param {IconsListData} iconPaths 
 * @param {string} formId
 * @return {HTMLFormElement}
 */
function Form(fieldsData, btnsData, iconPaths, formId) {
    const inputs = InputFields(fieldsData);
    const iconsList = iconPaths !== null ? IconListSection(iconPaths) : stubHTMLElement();
    const buttons = ButtonSection(btnsData);
    const ret = appendChildren([BigFormMsg(), ...inputs, buttons, iconsList], document.createElement("form"));

    ret.classList.add("form");
    ret.id = formId;
    return ret;
}

/**
 * @param {HTMLFormElement} form - formulario sobre el cual setear el error (debe tener un nodo hijo 
 *                                      .bif-form-msg como el formulario creado en form.js)
 * @return {function(SubmitEvent, string)} - función que toma el evento de submit fallido y el string de error
 */
function setShowErrorFormMsg(form) {
    return (e, msg) => {
        e.preventDefault();
        showBigFormMsg(form, msg, ["secondary-light-bg-color"]);
    };
}

/**
 * @param {HTMLFormElement} form - formulario sobre el cual setear el mensaje de éxíto(debe tener un nodo hijo 
 *                                      .bif-form-msg como el formulario creado en form.js)
 * @return {function(SubmitEvent, string)} - función que toma el evento de submit fallido y el string de error
 */
function setShowSuccessFormMsg(form) {
    return (e, msg) => {
        e.preventDefault();
        showBigFormMsg(form, msg, ["main-dark-bg-color"]);
    };
}

/** Muestra BigFormMsg en el formulario especificado, con el mensaje y las clases de css especificadas.
 * @param {HTMLFormElement} form
 * @param {string} msg 
 * @param {string[]} classes 
 */
function showBigFormMsg(form, msg, classes) {
    const bigFormMsg = form.querySelector(".big-form-msg");
    bigFormMsg.querySelector("h3").textContent = msg;
    setClasses(bigFormMsg, ["show", ...classes]);
}

/**
 * @param {HTMLInputElement} dateInputElement
 * @param {Date} date
 * @return {HTMLInputElement}
 */
function setDateInputValue(dateInputElement, date) {
    dateInputElement.valueAsDate = new Date(date);
    return dateInputElement;
}

/**
 * @template T
 * @param {HTMLInputElement[]} inputElements
 * @param {function(HTMLInputElement): T[keyof T] | boolean} processField - función que debe convertir input element en un
 *                                                                        - valor apropiado para el cmapo
 * @return {T}
 */
function processInputs(inputElements, processField) {
    // @ts-ignore - convertir el objeto sin keys en un objeto de tipo T falla
    return foldl((obj, elem) => {
        obj[elem.id] = processField(elem);
        return obj;
    }, inputElements, {});
}

/**
 * @template T
 * @param {HTMLInputElement[]} inputElements
 * @param {function(HTMLInputElement): Promise<T[keyof T]> | T[keyof T] | boolean}  processField - función asíncrona que debe convertir input element en un
 *                                                                                               - valor apropiado para el cmapo
 */
async function processInputsAsync(inputElements, processField) {
    // @ts-ignore - convertir el objeto sin keys en un objeto de tipo T falla
    /** @type {Object<key, Promise<T[keyof T]> | T>} */
    const objWithPromises = foldl((obj, elem) => {
        obj[elem.id] = processField(elem);
        return obj;
    }, inputElements, {});

    for (const key of Object.keys(objWithPromises))
        objWithPromises[key] = await objWithPromises[key];
    
    return objWithPromises;
}



/** @readonly @type {string[]} */
const OAuthIcons = ["./icons/icons8-facebook-100.png", "./icons/icons8-google-100.png"];