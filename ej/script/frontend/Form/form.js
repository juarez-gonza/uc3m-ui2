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

    return foldl((list, item) => {
        list.appendChild(item);
        return list;
    }, listItems, document.createElement("ul"));
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
    const ret = foldl((container, btn) => {
            container.appendChild(btn);
            return container;
        },
        FormButtons(btnsData),
        document.createElement("div")
    );
    ret.classList.add("form-buttons-section");
    return ret;
}

/**
 * @return {HTMLDivElement}
 */
function BigFormError() {
    const errorMsg = document.createElement("div");
    errorMsg.innerHTML = `<h3>Some Error</h3>`;
    setClasses(errorMsg, ["big-form-msg", "main-light-bg-color", "shadow2"]);
    errorMsg.classList.add("big-form-msg");
    return errorMsg
}

/**
 * 
 * @param {InputData[]} fieldsData 
 * @param {ButtonData[]} btnsData 
 * @param {IconsListData} iconPaths 
 * @param {string} formId
 * @returns 
 */
function Form(fieldsData, btnsData, iconPaths, formId) {
    const inputs = InputFields(fieldsData);
    const iconsList = IconListSection(iconPaths);
    const buttons = ButtonSection(btnsData);
    const ret = foldl((container, item) => {
        container.appendChild(item);
        return container;
    }, [BigFormError(), ...inputs, buttons, iconsList],
    document.createElement("form"));

    ret.classList.add("form");
    ret.id = formId;
    return ret;
}

/**
 * 
 * @param {Event} e 
 * @param {string} msg 
 */
function formError(e, msg) {
    e.preventDefault();

    const formError = document.querySelector("form.form .big-form-msg");
    formError.querySelector("h3").textContent = msg;
    formError.classList.add("show");
}

/** @readonly @type {string[]} */
const OAuthIcons = ["./icons/icons8-facebook-100.png", "./icons/icons8-google-100.png"];