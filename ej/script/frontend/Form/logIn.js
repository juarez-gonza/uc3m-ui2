/** @typedef {Object} LogInSubmitedData
 *  @property {string} username
 *  @property {string} password
 */

/**
 * @param {function(Event, User): any}  onSuccess
 * @param {function(Event, string): any}  onError
 * @return {function(Event): any}
 */
function onSubmitLogInHandler(onSuccess, onError) {
    return e => {
        const inputNodes = Array.from(document.querySelectorAll(".modal .modal-content form .input input"));

        /** @type {LogInSubmitedData} */
        const {username, password} = foldl((obj, field) => {
                obj[field.id] = field.value;
                return obj;
            },
            inputNodes.map((/** @type{HTMLInputElement} */ field) => ({id: field.id, value: field.value})),
            {username: "", password: ""});

        try {
            const user = logInUserReq(username, password);
            return onSuccess(e, user);
        } catch (err) {
            if (err.name === "LSNotFoundException" || err.name === "RepetitionError" || err.name === "ValidationError")
                return onError(e, "Wrong username or password");
            throw err;
        }
    };
}

/**
 * 
 * @param {Event} e
 * @param {User} user
 */
function onLogInSuccess(e, user) {
    __Store.commit("logIn", user);
    closeModalClickHandler(e);
}

/** @readonly @type {string} */
const LogInFormID = "LogIn";

/** @readonly @type {InputData[]} */
const LogInFieldsData = [
    {
        id: "username", label: "Your username", type: "text",
        inputValidation: {
            errorMsg: "A username is required",
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
            errorMsg: "A password is required",
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
        classes: ["pinkish-bg-color", "button"],
        extraAttributes: {
            type: "reset",
        },
        onClickHandler: undefined,
    },
];

/** @readonly @type {IconsListData} */
const LogInIcons = {upperText: "or, log-in with ", iconsPath: [...OAuthIcons]};

/**
 * @return {HTMLFormElement}
 */
function LogInForm() {
    const logInForm = Form(LogInFieldsData, LogInButtons, LogInIcons, LogInFormID);
    logInForm.addEventListener("submit", onSubmitLogInHandler(onLogInSuccess, formError));
    return logInForm;
}