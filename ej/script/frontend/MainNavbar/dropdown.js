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

    // TODO: check why this setTimeout is needed for the dropdown to show up in the first place
    setTimeout(() => {
        document.addEventListener("click", e => {
            const clicked = isInDOMTree(e.target, dropdown);
            if (!clicked)
                dropdown.remove();
        });
    }, 0);

    return dropdown;
}