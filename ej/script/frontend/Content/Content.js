class Content {
    /** @type {HTMLElement} */
    element;
    constructor() {
        __Store.events.subscribe("stateChange", () => this.render());
        this.element = document.querySelector("main");
    }

    /**
     * @return {HTMLElement}
     */
    render() {
        removeAllChildren(this.element);
        switch (__Store.state.currentPage) {
            case CurrentPage.DEFAULT:
                this.element = DefaultContent(this.element);
                return this.element;
            case CurrentPage.USER_HOME:
                this.element = HomeContent(this.element, __Store.state.loggedIn);
                return this.element;
            case CurrentPage.ARTIST:
                return this.element;
            case CurrentPage.OTHER_USER:
                return this.element;
            case CurrentPage.PLAYLIST_CREATOR:
                return this.element;
        }
    }
};