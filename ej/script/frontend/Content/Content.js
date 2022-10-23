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
                this.element = ArtistContent(this.element,
                    __Store.state.loggedIn,
                    __Store.state.extraPageData.artist)
                return this.element;
            case CurrentPage.OTHER_USER:
                console.warn("Other user page not developed yet!!")
                return this.element;
            case CurrentPage.PLAYLIST_CREATOR:
                console.warn("Playlist creator not developed yet!!")
                return this.element;
        }
    }
};