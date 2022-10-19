class Footer {
    /** @type {HTMLElement} */
    element;

    constructor() {
        __Store.events.subscribe("stateChange", () => this.render());
        this.element = document.querySelector("footer");
    }

    /**
     * @return {HTMLElement}
     */
    render() {
        removeAllChildren(this.element);
        if (__Store.state.loggedIn === null)
            return DefaultFooter(this.element);
        return FooterLoggedIn(this.element);
    }
};

/**
 * @param {HTMLElement} footer
 * @return {HTMLElement}
 */
function DefaultFooter(footer) {
    return footer;
}

/**
 * @param {HTMLElement} footer
 * @return {HTMLElement}
 */
function FooterLoggedIn(footer) {
    footer.style.display = "none";
    document.body.style.gridTemplateAreas =  `"nav nav" "sidebar content" "sidebar content" "footer  footer"`;
    document.body.style.gridTemplateRows =  "0.8fr 4.3fr 4.3fr"
    return footer;
}