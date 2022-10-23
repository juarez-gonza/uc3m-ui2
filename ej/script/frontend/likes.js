/**
 * @param {Song} song
 * @param {User} user
 * @return {boolean}
 */
function isLikedByUser(song, user) {
    return user.favSongs.find(s => s._id === song._id) !== undefined;
}

/**
 * 
 * @param {Song} song 
 * @return {boolean} 
 */
function isLikedByLoggedIn(song) {
    return isLikedByUser(song, __Store.state.loggedIn);
}

/**
 * 
 * @param {Song} song 
 * @return {Song} 
 */
function likeLoggedIn(song) {
    const loggedIn = __Store.state.loggedIn;
    loggedIn.addFavSong(song);
    loggedIn.save();
    return song;
}

/**
 * 
 * @param {Song} song 
 * @return {Song} 
 */
function dislikeLoggedIn(song) {
    const loggedIn = __Store.state.loggedIn;
    loggedIn.removeFavSong(song);
    loggedIn.save();
    return song;
}

/**
 * 
 * @param {boolean} liked
 * @param {Song} song 
 * @return {Song} 
 */
function toggleLike(liked, song) {
    return liked ? dislikeLoggedIn(song) : likeLoggedIn(song);
}
