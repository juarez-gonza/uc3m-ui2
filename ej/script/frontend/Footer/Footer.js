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
    removeAllChildren(footer);
    footer.classList.add("gradient1-bg");
    footer.style.display = "";
    document.body.style.gridTemplateAreas =  `"nav nav" "content content" "footer  footer"`;
    document.body.style.gridTemplateRows =  "0.8fr 8fr 0.6fr"
    return footer;
}

/**
 * @param {HTMLElement} footer
 * @return {HTMLElement}
 */
function FooterLoggedIn(footer) {
    removeAllChildren(footer);
    footer.innerText = "";
    document.body.style.gridTemplateAreas =  `"nav nav" "sidebar content" "sidebar content" "footer  footer"`;
    document.body.style.gridTemplateRows =  "0.8fr 4fr 4fr 0.6fr"
    return MusicPlayer(footer);
}