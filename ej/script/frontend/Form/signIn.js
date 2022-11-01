/**
 * @param {function(Event, User): any}  onSuccess
 * @param {function(Event, string): any}  onError
 * @return {function(Event): any}
 */
function onSubmitSignInHandler(onSuccess, onError) {
    return e => {
        const inputFields = Array.from(document.querySelectorAll(".modal .modal-content form .input input"))
                            .map((/** @type{HTMLInputElement} */ field) => (
                                {
                                    id: field.id === "profilePic" ? "profilePic64" : field.id,
                                    value: field.value
                                }
                            ));

        /** @type {NewUserData} */
        const newUserData = foldl((obj, field) => {
                obj[field.id] = field.value;
                return obj;
            },
            inputFields,
            {username: "", password: "", firstName: "", lastName: "", email: "", birth: "", profilePicB64: ""}
        );

        try {
            const newUser = signInUserReq(newUserData);
            onSuccess(e, newUser);
        } catch (err) {
            if (err.name === "RepetitionError")
                onError(e, "This username already exists");
        }
    };
}

/** @readonly @type {InputData[]} */
const SignInFieldsData = [

    {
        id: "username", label: "Choose a username", type: "text",
        inputValidation: {
            errorMsg: "A username is required",
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
    signInForm.addEventListener("submit", onSubmitSignInHandler(onLogInSuccess, setShowErrorFormMsg(signInForm)));
    return signInForm;
}