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
        const loggedIn = __Store.state.loggedIn;
        switch (__Store.state.currentPage) {
            case CurrentPage.DEFAULT:
                this.element = DefaultContent(this.element);
                return this.element;
            case CurrentPage.USER_HOME:
                this.element = HomeContent(this.element, loggedIn);
                return this.element;
            case CurrentPage.ARTIST:
                this.element = ArtistContent(this.element, loggedIn,
                                            __Store.state.extraPageData.artist)
                return this.element;
            case CurrentPage.OTHER_USER:
                this.element = HomeContent(this.element, __Store.state.extraPageData.otherUser);
                return this.element;
            case CurrentPage.SEARCH_SONGS:
                this.element = SearchContent(this.element, loggedIn, __Store.state.extraPageData.search);
                return this.element;
            case CurrentPage.PLAYLIST_CREATOR:
                this.element = PlaylistCreatorContent(this.element,
                                                     loggedIn,
                                                     __Store.state.extraPageData.playlist);
                return this.element;
            case CurrentPage.MY_PLAYLISTS:
                this.element = PlaylistContent(this.element, loggedIn);
                return this.element;
            case CurrentPage.ACCOUNT_SETTINGS:
                this.element = AccSettingsContent(this.element, loggedIn);
                return this.element;
            case CurrentPage.MY_CONTENT:
                this.element = UserContent(this.element);
                return this.element;
        }
    }
};