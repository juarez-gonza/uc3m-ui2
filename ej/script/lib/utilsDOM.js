/**
 *  @param {Object} attrObj
 *  @return {string}
 */
function objToAttrStr(attrObj) {
    return intercalateStr(" ",
                Object.entries(attrObj).map(([k, v]) => `${k}=${attrObj[k]}`
            ));
}

/**
 * @param {HTMLElement} element
 * @param {Object} attributes
 * @return {HTMLElement}
 */
function setAttributes(element, attributes) {
    for (const [k, v] of Object.entries(attributes))
        if (v)
            element.setAttribute(k, v);
    return element;
}

/**
 * @param {Element} element
 * @param {string[]} classes
 * @return {Element}
 */
function setClasses(element, classes) {
    for (const c of classes)
        element.classList.add(c);
    return element;
}

/**
 * 
 * @param {EventTarget} target 
 * @param {Element | ChildNode} root 
 * @return {boolean}
 */
function isInDOMTree(target, root) {
    return target === root ||
        Array.from(root.childNodes).some(v => isInDOMTree(target, v));
}

/**
 * @param {Element} root
 * @return {Element | ChildNode}
 */
function removeAllChildren(root) {
    for (let e = root.lastElementChild; e !== null; e = root.lastElementChild)
        e.remove();
    return root;
}