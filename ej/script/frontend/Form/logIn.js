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

const __logInForm = Form(LogInFieldsData, LogInButtons, LogInIcons, LogInFormID);
__logInForm.addEventListener("submit", onSubmitLogInHandler(closeModalClickHandler));

const [__logIn,] = document.querySelectorAll(".main-nav ul li a");
__logIn.addEventListener("click", setOpenModalHandler({
    title: "Enter your credentials:",
    content: __logInForm,
}));
