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
 * @param {UserIconParams} iconData
 * @return {HTMLElement}
 */
function UserIcon(iconData) {
    const {user, clickHandler} = iconData;
    const ret = document.createElement("img");
    ret.src = "./icons/icons8-user-64.png";
    if (clickHandler !== undefined)
        ret.addEventListener("click", clickHandler);
    ret.classList.add("profile-img");
    return ret;
}
