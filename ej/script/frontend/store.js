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
    ACCOUNT_SETTINGS: 7,
    MY_CONTENT: 8
};

/**
 * @typedef {Object} AppState
 * @property {User|null} loggedIn
 * @property {CurrentPage} currentPage
 * @property {Object<string, any> | null} extraPageData
 */

/** @typedef {Object | undefined} StateChange */

/** @type {AppState} */
const __initalStoreState = {
    loggedIn: null,
    currentPage: CurrentPage.DEFAULT,
    extraPageData: null
};

/**
 * @typedef {"logIn" | "logOut" | "toArtistPage" | "toUserPage" | "toSearchPage" | "toCheckPlaylists" | "toPlaylistCreator" | "toAccSettings" | "toMyContent"} MKeys
 */

/** @type {Object<MKeys, function(AppState, StateChange): AppState>} */
const __mutations = {
    logIn: (state, user) => {
        return {...state, currentPage: CurrentPage.USER_HOME, loggedIn: user};
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

    toPlaylistCreator: (state, playlist) => {
        return {...state, currentPage: CurrentPage.PLAYLIST_CREATOR, extraPageData: {playlist: playlist}};
    },

    toAccSettings: (state) => {
        return {...state, currentPage: CurrentPage.ACCOUNT_SETTINGS};
    },

    toMyContent: (state) => {
        return {...state, currentPage: CurrentPage.MY_CONTENT};
    }
};

function saveAndRefreshLoggedIn() {
    __Store.state.loggedIn.save();
    refreshLoggedIn();
}

function refreshLoggedIn() {
    __Store.state.loggedIn = User.find(__Store.state.loggedIn._id);
}

// @ts-ignore  JSDoc no puede deducir el tipo bien aquí
const __Store = new SyncStore(__initalStoreState, __mutations);