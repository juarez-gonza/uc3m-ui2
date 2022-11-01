/**
 * @param {User} user
 * @param {function(SubmitEvent, User): any}  onSuccess
 * @param {function(SubmitEvent, string): any}  onError
 * @return {function(SubmitEvent): any}
 */
function onSubmitAccSettingsHandler(user, onSuccess, onError) {
    return e => {
        const inputNodes = getAccSettingsInputNodes();
        /** @type {UpdateUserData} */
        const accSettingsData = foldl((obj, field) => {
                obj[field.id] = field.value;
                return obj;
            },
            inputNodes.map((/** @type{HTMLInputElement} */ field) => ({id: field.id, value: field.value})),
            {username: "", password: "", firstName: "", lastName: "", email: "", birth: "", profilePic: ""}
        );

        const updatedUser = updateUserReq(user, accSettingsData);
        onSuccess(e, updatedUser);
    };
}

/**
 * @param {HTMLFormElement} form
 * @return {function(SubmitEvent, User):any} 
 */
function setOnUpdateSuccess(form) {
    return (e, user) => {
        setFormSuccess(form)(e, "The user has been updated successfully")
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
                case "profilePic":
                    console.warn("implement profilePic handling");
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
    return Array.from(document.querySelectorAll(".main-content .form .input input"));
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
                                    setFormError(accSettingsForm)));

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

    appendChildren([title, AccSettingsForm(user)], root);
    return root;
}