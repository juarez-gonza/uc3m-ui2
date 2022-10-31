/**
 * @readonly
 * @enum {number}
 */
const CurrentPage = {
    DEFAULT: 0,
    USER_HOME: 1,
    OTHER_USER: 2,
    ARTIST: 3,
    PLAYLIST_CREATOR: 4,
    SEARCH_SONGS: 5,
    MY_PLAYLISTS: 6,
};

/** @typedef {Object} AppState
 *  @property {User|null} loggedIn
 *  @property {CurrentPage} currentPage
 *  @property {Object<string, any> | null} extraPageData
 */

/** @type {AppState} */
const __initalStoreState = {
    loggedIn: null,
    currentPage: CurrentPage.DEFAULT,
    extraPageData: null
};

/** @type {Object<string, function(AppState, Object): AppState>} */
const __mutations = {
    logIn: (state, user) => {
        const ret = {...state, currentPage: CurrentPage.USER_HOME, loggedIn: user}
        return ret;
    },

    logOut: (state) => {
        return {...state, currentPage: CurrentPage.DEFAULT, loggedIn: null};
    },

    toArtistPage: (state, artist) => {
        return {...state, currentPage: CurrentPage.ARTIST, extraPageData: {artist: artist}};
    },

    toUserPage: (state, otherUser) => {
        return {...state, currentPage: CurrentPage.OTHER_USER, extraPageData: {otherUser: otherUser}};
    },

    toSearchPage: (state, search) => {
        return {...state, currentPage: CurrentPage.SEARCH_SONGS, extraPageData: {search: search}};
    },

    toCheckPlaylists: (state) => {
        return {...state, currentPage: CurrentPage.MY_PLAYLISTS};
    },

    toPlaylistCreator: (state) => {
        return {...state, currentPage: CurrentPage.PLAYLIST_CREATOR};
    }
};

// @ts-ignore  JSDoc no puede deducir el tipo bien aquí
const __Store = new SyncStore(__initalStoreState, __mutations);