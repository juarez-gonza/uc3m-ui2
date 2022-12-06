/** @readonly @type {string} */
const UploadInFormID = "Upload";

/** @readonly @type {InputData[]} */
const UploadFieldsData = [
   { 
        id: "username", label: "Collection Name", type: "text",
        inputValidation: {
            errorMsg: "Enter a name for the collection",
            attributes: {
                required: true,
            }
        },
        extraAttributes: {placeholder: "collection-0"}
    },
    {
        id: "password", label: "Track name", type: "text",
        inputValidation: {
            errorMsg: "Enter the name of the track",
            attributes: {
                required: true,
            }
        },
        extraAttributes: {placeholder: "track-0"},
    },
    {
        id: "profilePicB64", label: "File upload", type: "file",
        inputValidation: undefined,
        extraAttributes: undefined,
    },
];

/** @readonly @type {ButtonData[]} */
const uploadButtons = [
    {
        text: "New Track",
        classes: ["secondary-light-bg-color", "button"],
        extraAttributes: undefined,
        onClickHandler: undefined
    },
    {
        text: "Upload",
        classes: ["pinkish-bg-color", "button"],
        extraAttributes: undefined,
        onClickHandler: undefined,
    },
];

/** @readonly @type {IconsListData} */
const uploadIcons = {upperText: " ", iconsPath: []};
 
/**
 * @return {HTMLFormElement}
 */
function uploadForm() {
    const logInForm = Form(UploadFieldsData, uploadButtons, uploadIcons, UploadInFormID);
    return logInForm;
}