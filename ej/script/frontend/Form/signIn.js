/**
 * @param {function(Event): any}  onSuccess
 * @return {function(Event): any}
 */
function onSubmitSignInHandler(onSuccess) {
    return e => {
        onSuccess(e);
    };
}

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
        classes: ["pinkish-bg-color", "button"],
        extraAttributes: {type: "reset"},
        onClickHandler: undefined,
    },
];

/** @readonly @type {IconsListData} */
const SignInIcons = {upperText: "or, sign-in with ", iconsPath: [...OAuthIcons]};

function SignInForm() {
    const signInForm = Form(SignInFieldsData, SignInButtons, SignInIcons, SignInFormID);
    signInForm.addEventListener("submit", onSubmitSignInHandler(closeModalClickHandler));
    return signInForm;
}

const [, __signIn] = document.querySelectorAll(".main-nav ul li a");
__signIn.addEventListener("click", setOpenModalHandler("Register", SignInForm));