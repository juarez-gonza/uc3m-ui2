/**
 * @param {User} user
 * @param {function(SubmitEvent, User): any}  onSuccess
 * @param {function(SubmitEvent, string): any}  onError
 * @return {function(SubmitEvent): any}
 */
function onSubmitAccSettingsHandler(user, onSuccess, onError) {
    return e => {
        e.preventDefault();
        /** @type {HTMLFormElement} */
        const form = document.querySelector(".main-content form.form");
        processAccSettingsForm(e, user, form, onSuccess, onError)
    };
}

/**
 * @param {User} user
 * @return {function(HTMLInputElement): Promise<NewUserData[keyof NewUserData]>|NewUserData[keyof NewUserData]}
 */
function setProcessAccSettingsInput(user) {
    return inputElem => {
        if (inputElem.id === "profilePicB64")
            return inputElem.files !== null && inputElem.files.length < 1 ?
                        user.profilePicB64
                        : getBase64(inputElem.files[0]);
        return inputElem.value;
    };
}

/**
 * @param {SubmitEvent} e 
 * @param {User} user
 * @param {HTMLFormElement} form 
 * @param {function(SubmitEvent, User): any}  onSuccess
 * @param {function(SubmitEvent, string): any}  onError
 */
async function processAccSettingsForm(e, user, form, onSuccess, onError) {
    /** @type {HTMLInputElement[]} */
    const inputElements = Array.from(form.querySelectorAll(".input input"));
    /** @type {UpdateUserData} */
    const newUserData = await processInputsAsync(inputElements, setProcessAccSettingsInput(user));

    const newUser = updateUserReq(user, newUserData);
    onSuccess(e, newUser);
}

/**
 * @param {HTMLFormElement} form
 * @return {function(SubmitEvent, User):any} 
 */
function setOnUpdateSuccess(form) {
    return (e, user) => {
        setShowSuccessFormMsg(form)(e, "The user has been updated successfully");
        __Store.state.loggedIn = user;
    };
}

/**
 * @param {User} user
 * @return {function(SubmitEvent): any}
 */
function onResetAccSettingsHandler(user) {
    return e => {
        e.preventDefault();
        /** @type {HTMLInputElement[]} */
        const inputNodes = getAccSettingsInputNodes();
        for (const inputNode of inputNodes)
            switch (inputNode.id) {
                case "birth":
                    setDateInputValue(inputNode, user.birth);
                    break;
                case "profilePicB64":
                    inputNode.files = null;
                    break;
                default:
                    inputNode.value = user[inputNode.id];
            }
    };
}

/**
 * @return {HTMLInputElement[]}
 */
function getAccSettingsInputNodes() {
    return Array.from(document.querySelectorAll(".main-content form.form .input input"));
}

/**
 * @param {User} user 
 * @return {InputData[]}
 */
function getAccSettingsFieldsData(user) {
    return SignInFieldsData.map(field => {
        if (field.extraAttributes === undefined)
            field.extraAttributes = {};

        field.extraAttributes.value = user[field.id];
        return field;
    });
}

/**
 * @param {User} user 
 * @return {ButtonData[]}
 */
function getAccSettingsButtons(user) {
    return [
        {
            text: "Commit changes",
            classes: ["secondary-light-bg-color", "button"],
            extraAttributes: {type: "submit"},
            onClickHandler: undefined,
        },
        {
            text: "Restore changes",
            classes: ["pinkish-bg-color", "button"],
            extraAttributes: undefined, /* no seteado a {type: "reset"} porque eso no permite que el clickHandler
                                         * restore los campos de tipo date al valor previo del usuario
                                         */
            onClickHandler: onResetAccSettingsHandler(user),
        }
    ];
}

/** @readonly @type {string} */
const AccSettingsFormID = "AccSettings";

/**
 * @param {User} user
 * @return {HTMLFormElement}
 */
function AccSettingsForm(user) {
    const accSettingsForm = Form(getAccSettingsFieldsData(user),
                                    getAccSettingsButtons(user),
                                    null,
                                    AccSettingsFormID);
    accSettingsForm.addEventListener("submit",
                                    onSubmitAccSettingsHandler(user,
                                    setOnUpdateSuccess(accSettingsForm),
                                    setShowErrorFormMsg(accSettingsForm)));

    /* corregir valor default de datePicker, aparentemente solo
     * se puede hacer cuando el elemento html del elemento ya está creado (no seteando un elemento
     * que tenga un atributo value por default, como se hace en getAccSettingsFieldsData())
     */
    setDateInputValue(accSettingsForm.querySelector("#birth"), user.birth);
    return accSettingsForm;
}

/**
 * @param {HTMLElement} root 
 * @param {User} user 
 * @return {HTMLElement}
 */
function AccSettingsContent(root, user) {
    const title = document.createElement("h1");
    title.textContent = "Account Settings";
    title.classList.add("main-title");

    return appendChildren([title, AccSettingsForm(user)], root);
}