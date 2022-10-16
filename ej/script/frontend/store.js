/**
 * @readonly
 * @enum {number}
 */
const CurrentPage = {
    DEFAULT: 0,
    LOGGED_IN: 1,
    OTHER_USER: 2,
    ARTIST: 3,
    PLAYLIST_CREATOR: 4,
};

/** @typedef {Object} AppState
 *  @property {User|null} loggedIn
 *  @property {CurrentPage} currentPage
 *  @property {Object<string, any> | null} extraPageData
 */

/** @type {AppState} */
const __initalStoreState = {
    loggedIn: null,
    currentPage: null,
    extraPageData: null
};

/** @type {Object<string, function(AppState, Object): AppState>} */
const __mutations = {
    logIn: (state, user) => {
        const ret = {...state, currentPage: CurrentPage.LOGGED_IN, loggedIn: user}
        return ret;
    },

    logOut: (state) => {
        return {...state, currentPage: CurrentPage.LOGGED_IN, loggedIn: null};
    }
};

// @ts-ignore violación al sistema de tipado :(
const __Store = new SyncStore(__initalStoreState, __mutations);