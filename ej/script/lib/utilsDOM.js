/**
 *  @param {Object} attrObj
 *  @return {string}
 */
function objToAttrStr(attrObj) {
    return intercalateStr(" ",
                Object.entries(attrObj).map(([k, v]) => `${k}=${v}`
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
    while (root.firstElementChild)
        root.firstElementChild.remove();
    return root;
}

/**
 * @template {HTMLElement} T
 * @param {HTMLElement[]} elements
 * @param {T} root
 * @return {T}
 */
function appendChildren(elements, root) {
    return foldl((c, e) => {
        c.appendChild(e);
        return c;
    }, elements, root);
}