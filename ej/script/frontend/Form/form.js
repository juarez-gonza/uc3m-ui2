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
 *  @property {undefined|Object} extraAttributes
 */

/** @typedef {Object} IconsListData
 *  @property {string} upperText
 *  @property {string[]} iconsPath
 */

/**
 *  @param {Object} attrObj
 *  @return {string}
 */
function objToAttrStr(attrObj) {
    return intercalateStr(" ",
                Object.entries(attrObj).map(([k, v]) => v !== true ? `${k}=${attrObj[k]}` : k
            ));
}

/**
 * @param {HTMLElement} element
 * @param {Object} attributes
 * @return {HTMLElement}
 */
function setAttributes(element, attributes) {
    for (const [k, v] of Object.entries(attributes))
        if (v)
            element.setAttribute(k, v);
    return element;
}

/**
 * @param {HTMLElement} element
 * @param {string[]} classes
 * @return {HTMLElement}
 */
function setClasses(element, classes) {
    for (const c of classes)
        element.classList.add(c);
    return element;
}

/**
 * @param {InputData} fields
 * @return {HTMLElement}
 */
function Input(fields) {
    const {id, label, type, inputValidation, extraAttributes} = fields;
    const validationStr = inputValidation === undefined ? "" : objToAttrStr(inputValidation.attributes);
    const extraAttrStr = extraAttributes === undefined ? "" : objToAttrStr(extraAttributes);
    const ret = document.createElement("div");
    ret.classList.add("input");
    ret.innerHTML = `
        <label for="${id}">${label}</label>
        <input type="${type}" id="${id}" name="${id}" ${validationStr} ${extraAttrStr}>
        ${
            inputValidation === undefined ? 
            ""
            : `
            <span class="input-error-message">${inputValidation.errorMsg}</span>
            `
        }
    `;
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
    }, [...inputs, buttons, iconsList], document.createElement("form"));

    ret.classList.add("form");
    ret.id = formId;
    return ret;
}

/** @readonly @type {string[]} */
const OAuthIcons = ["./icons/icons8-facebook-100.png", "./icons/icons8-google-100.png"];

/** @readonly @type {InputData[]} */
const SignInFieldsData = [
    {
        id: "username", label: "Choose a username", type: "text",
        inputValidation: {
            errorMsg: "This field is mandatory.",
            attributes: {
                required: true
            }
        },
        extraAttributes: {
            placeholder: "sounsound-user00"
        }
    },
    {
        id: "password", label: "Choose a password (max 8 chars., lowercase or numbers)", type: "password",
        inputValidation: {
            errorMsg: "Write a password of at least 8 characters.",
            attributes: {
                required: true,
                maxlength: 8,
                pattern: "[a-z0-9A-Z]+"
            }
        },
        extraAttributes: {
            placeholder: "secret"
        }
    },
    {
        id: "firstName", label: "What's your first name?", type: "text",
        inputValidation: {
            errorMsg: "Enter your name (letters, dashes and upper commas).",
            attributes: {
                required: true,
                pattern: "([a-zA-Z]|\-|')+"
            }
        },
        extraAttributes: {
            placeholder: "Leonardo"
        }
    },
    {
        id: "lastName", label: "What's your last name?", type: "text",
        inputValidation: {
            errorMsg: "Enter your last name (letters, dashes and upper commas).",
            attributes: {
                required: true,
                pattern: "([a-zA-Z]|\-|')+"
            }
        },
        extraAttributes: {
            placeholder: "DiCaprio"
        }
    },
    {
        id: "email", label: "What's your email?", type: "email",
        inputValidation: {
            errorMsg: "Enter a mail (ex.: me@mail.com)",
            attributes: {
                required: true,
                pattern: "[a-zA-Z0-9_.+-]+@[a-zA-Z0-9_.+-](.[a-z0-9]+)+"
            }
        },
        extraAttributes: {
            placeholder: "leodc@mail.com"
        }
    },
    {
        id: "birth", label: "Date of birth", type: "date",
        inputValidation: {
            errorMsg: "Please select a date",
            attributes: {
                required: true,
            }
        },
        extraAttributes: undefined
    },
    {
        id: "profilePic", label: "Upload a profile picture", type: "file",
        inputValidation: undefined,
        extraAttributes: undefined,
    },
];

/** @readonly @type {string} */
const SignInFormID = "SignIn";

/** @readonly @type {ButtonData[]} */
const SignInButtons = [
    {
        text: "Sign In!",
        classes: ["secondary-light-bg-color", "button"],
        extraAttributes: {type: "submit"},
        onClickHandler: undefined,
    },
    {
        text: "Clear Fields",
        classes: ["main-light-bg-color", "button"],
        extraAttributes: {type: "reset"},
        onClickHandler: undefined,
    },
];

/** @readonly @type {IconsListData} */
const SignInIcons = {upperText: "or, sign-in with ", iconsPath: [...OAuthIcons]};

/** @readonly @type {string} */
const LogInFormID = "LogIn";

/** @readonly @type {InputData[]} */
const LogInFieldsData = [
    {
        id: "username", label: "Your username", type: "text",
        inputValidation: {
            errorMsg: "This field is mandatory",
            attributes: {
                required: true,
            }
        },
        extraAttributes: {
            placeholder: "sounsound-user00"
        }
    },
    {
        id: "password", label: "Your password", type: "password",
        inputValidation: {
            errorMsg: "This field is mandatory",
            attributes: {
                required: true,
                maxlength: 8,
                pattern: "[a-z0-9A-Z]+"
            }
        },
        extraAttributes: {
            placeholder: "secret"
        }
    },
];

/** @readonly @type {ButtonData[]} */
const LogInButtons = [
    {
        text: "Log In!",
        classes: ["secondary-light-bg-color", "button"],
        extraAttributes: {
            type: "submit",
        },
        onClickHandler: undefined
    },
    {
        text: "Clear Fields",
        classes: ["main-light-bg-color", "button"],
        extraAttributes: {
            type: "reset",
        },
        onClickHandler: undefined,
    },
];

/** @readonly @type {IconsListData} */
const LogInIcons = {upperText: "or, log-in with ", iconsPath: [...OAuthIcons]};

/**
 * @param {function(Event): any}  onSuccess
 * @return {function(Event): any}
 */
function onSubmitLogInHandler(onSuccess) {
    return (e) => {
        e.preventDefault();
        onSuccess(e);
    };
}

const logInForm = Form(LogInFieldsData, LogInButtons, LogInIcons, LogInFormID);
const signInForm = Form(SignInFieldsData, SignInButtons, SignInIcons, SignInFormID);

logInForm.addEventListener("submit", onSubmitLogInHandler(closeModalClickHandler));
signInForm.addEventListener("submit", onSubmitLogInHandler(closeModalClickHandler));

logIn.addEventListener("click", setOpenModalHandler({
    title: "Enter your credentials:",
    content: logInForm,
}));

signIn.addEventListener("click", setOpenModalHandler({
    title: "Register",
    content: signInForm,
}));