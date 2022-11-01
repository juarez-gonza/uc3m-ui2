/**
 * @typedef {Object} UserIconParams
 * @property {User} user
 * @property {function(MouseEvent): any | undefined} clickHandler
 */

/**
 * @param {User} user
 * @return {function(MouseEvent): any}
 */
function setClickToUserpage(user) {
    return e => {
        __Store.commit("toUserPage", user);
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
 * @param {UserIconParams} iconData
 * @return {HTMLElement}
 */
function UserIcon(iconData) {
    const {user, clickHandler} = iconData;
    const ret = document.createElement("img");
    ret.src = userImgOrDefault(user);
    if (clickHandler !== undefined)
        ret.addEventListener("click", clickHandler);
    ret.classList.add("profile-img");
    return ret;
}
