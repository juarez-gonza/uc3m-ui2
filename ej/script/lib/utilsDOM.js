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
 * @template {Element} T
 * @param {T} element
 * @param {string[]} classes
 * @return {T}
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

/**
 * setea un intervalo que se limpia a si mismo cuando el handler
 * retorna false. Acepta varios parametros aunque de un mismo tipo
 * (alguna forma de hacer variadic templates en jsdoc?)
 * @template T
 * @param {function(...T): boolean} handler 
 * @param {number} period 
 * @param  {...T} handlerArg 
 */
function setIntervalUntil(handler, period, ...handlerArg) {
    const intervalId = setInterval(() => {
        if (handler(...handlerArg) === false)
            clearInterval(intervalId)
    }, period);
}

/**
 * 
 * @param {number} duration 
 * @return {string}
 */
function msToHhmmss(duration) {
    const ss = Math.floor((duration / 1000) % 60);
    const mm = Math.floor((duration / (1000 * 60)) % 60);
    const hh = Math.floor((duration / (1000 * 60 * 60)));
    return `${(hh < 10) ? "0" + hh : hh}:${(mm < 10) ? "0" + mm : mm}:${(ss < 10) ? "0" + ss : ss}`
}

/**
 * 
 * @param {string} str 
 * @return {number}
 */
function hhmmssToMs(str) {
    const [hh,mm,ss] = str.split(":");
    return Number(hh) * 1000 * 60 * 60
            + Number(mm) * 1000 * 60
            + Number(ss) * 1000;
}

/**
 * 
 * @param {Date} date 
 * @return {Date}
 */
function copyDate(date) {
    return new Date(Number(date));
}

/**
 * @param {Date} date 
 * @param {number} n 
 * @return {Date}
 */
function addDays(date, n) {
    const ret = copyDate(date);
    ret.setDate(date.getDate() + n);
    return ret;
}

/**
 * @param {number} n
 * @return {Date}
 */
function nDaysFromNow(n) {
    return addDays(new Date(), n);
}

/**
 * @param {Date} d1
 * @param {Date} d2
 * @return {number}
 */
function diffDateMs(d1, d2) {
    return d1.getTime() - d2.getTime();
}

/**
 * @param {Date} date
 * @return {number}
 */
function diffFromNowMs(date) {
    return diffDateMs(date, new Date());
}