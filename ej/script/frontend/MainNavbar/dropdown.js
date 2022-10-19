/** @typedef {Object} DropdownItemData
 *  @property {string} text
 *  @property {undefined|function(MouseEvent): any} clickHandler
 */

/**
 * @param {DropdownItemData} item
 */
function DropdownItem(item) {
    const {text, clickHandler} = item
    const ret = document.createElement("li");
    ret.textContent = text;
    if (clickHandler)
        ret.addEventListener("click", clickHandler);
    return ret;
}

/**
 * @param {DropdownItemData[]} items
 */
function DropdownItems(items) {
    return items.map(iData => DropdownItem(iData));
}

/**
 * @param {DropdownItemData[]} items
 * @return {HTMLElement}
 */
function Dropdown(items) {
    const dropdown = appendChildren(DropdownItems(items), document.createElement("ul"));
    dropdown.classList.add("dropdown");
    dropdown.classList.add("shadow1");

    return dropdown;
}