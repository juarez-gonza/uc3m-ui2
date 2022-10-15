/** @typedef {Object} AppState
 *  @property {User|null} loggedIn
 */

/** @type {AppState} */
const __initalStoreState = { loggedIn: null };

/** @type {Object<string, function(AppState, Object): AppState>} */
const __mutations = {
    logIn: (state, user) => {
        const ret = {...state, loggedIn: user}
        return ret;
    },

    logOut: (state) => {
        return {...state, loggedIn: null};
    }
};

// @ts-ignore segunda violación al sistema de tipado. mala deducción de tipo :(
const __Store = new SyncStore(__initalStoreState, __mutations);