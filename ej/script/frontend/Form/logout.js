 function goOutOfProfile(){
    __Store.commit("logOut");
}

/** @readonly @type {string} */
const LogOutFormID = "logOut";



const LogOutButtons = [
    {
        text: "Yes",
        classes: ["secondary-light-bg-color", "button"],
        extraAttributes: {
            type: undefined,
        },
        onClickHandler: goOutOfProfile
    },
    {
        text: "No",
        classes: ["pinkish-bg-color", "button"],
        extraAttributes: {
            type: undefined,
        },
        onClickHandler: goToLoggedInProfile,
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