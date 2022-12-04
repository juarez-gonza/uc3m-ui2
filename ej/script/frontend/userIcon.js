/**
 * @typedef {Object} UserIconData
 * @property {User} user
 * @property {{text: string} | undefined} label
 * @property {function(MouseEvent): any | undefined} clickHandler
 */

/**
 * @param {User} user
 * @return {function(MouseEvent): any}
 */
function setClickToUserpage(user) {
    return e => {
        nextPage("toUserPage", user);
    };
}

/**
 * 
 * @param {User} user 
 * @return {string}
 */
function userImgOrDefault(user) {
    return user.profilePicB64 || "./icons/icons8-user-64.png";
}

/**
 * @param {UserIconData} iconData
 * @return {HTMLElement}
 */
function _UserIconImgOnly(iconData) {
    const {user, clickHandler} = iconData;
    const ret = document.createElement("img");
    ret.src = userImgOrDefault(user);
    if (clickHandler !== undefined)
        ret.addEventListener("click", clickHandler);
    ret.classList.add("profile-img");
    return ret;
}

/**
 * @param {UserIconData} iconData
 * @return {HTMLElement}
 */
function _LabeledUserIcon(iconData) {
    const {label} = iconData;
    const ret = document.createElement("div");
    const labelItem = document.createElement("span");
    labelItem.textContent = label.text;

    appendChildren([_UserIconImgOnly(iconData), labelItem], ret)
    ret.classList.add("labeled-profile-img");
    return ret;
}

/**
 * @param {UserIconData} iconData
 * @return {HTMLElement}
 */
function UserIcon(iconData) {
    const {label} = iconData
    return label !== undefined? _LabeledUserIcon(iconData) : _UserIconImgOnly(iconData);
}
