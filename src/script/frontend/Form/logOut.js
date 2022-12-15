 function logOut() {
    nextPage("logOut");
}

/**
 * 
 * @param {Event} e
 */
function onLogOut(e) {
    logOut();
    closeModalClickHandler(e);
}

/** @readonly @type {string} */
const LogOutFormID = "logOut";

/** @readonly @type {ButtonData[]} */
const LogOutButtons = [
    {
        text: "Yes",
        classes: ["secondary-light-bg-color", "button"],
        extraAttributes: undefined,
        onClickHandler: (e) => {
            e.preventDefault();
            onLogOut(e);
        }
    },
    {
        text: "No",
        classes: ["pinkish-bg-color", "button"],
        extraAttributes: undefined,
        onClickHandler: (e) => {
            e.preventDefault();
            onLogInSuccess(e, __Store.state.loggedIn);
        },
    },
];

/** @readonly @type {IconsListData} */
const LogOutIcons = {upperText: " ", iconsPath: []};

/**
 * @return {HTMLFormElement}
 */
function LogOutForm() {
    const logOutnForm = Form([], LogOutButtons, LogOutIcons, LogOutFormID);
    return logOutnForm;
}