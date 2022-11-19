class ValidationError extends Error {
   /**
    * 
    * @param {string} message 
    */
   constructor(message) {
      super(message);
      this.name = "ValidationError";
   }
};

/**
 * @param {string} username 
 * @param {string} password 
 * @param {User} user
 * @return {User}
 */
function validateUserCredentials(username, password, user) {
    if (user.password !== password)
        throw new ValidationError("Wrong credentials");
    return user;
}

/**
 * 
 * @param {string} username 
 * @param {string} password 
 * @return {User}
 */
function logInUserReq(username, password) {
    const user = User.find(User.genUserId(username));
    return validateUserCredentials(username, password, user);
}

/** @typedef {Object} NewUserData
 *  @property {string} username
 *  @property {string} password
 *  @property {string} firstName
 *  @property {string} lastName
 *  @property {string} email
 *  @property {string} birth
 *  @property {string|undefined} profilePicB64
 */

/**
 * @param {NewUserData} userData
 * @return {User}
 */
function signInUserReq(userData) {
    /* TODO: revisar lógica de esto, me suena que hay chequeos innecesarios */
    try {
        if (User.find(User.genUserId(userData.username)))
            throw new RepetitionError("This username already exists");
    } catch (err) {
        if (err.name !== "LSNotFoundException")
            throw err; // re-throw error desconocido 
    }
    const newUser = new User({...userData, birth: new Date(userData.birth)});
    return newUser.save();
}

/**
 * @typedef {NewUserData} UpdateUserData
 */

/**
 * @param {User} user
 * @param {UpdateUserData} updateFields
 * @return {User}
 */
function updateUserReq(user, updateFields) {
    for (const key of Object.keys(updateFields))
        switch (key) {
            case "birth":
                user[key] = new Date(updateFields[key]);
                break;
            case "profilePic":
                console.warn("implement profilePic handling");
                break;
            default:
                user[key] = updateFields[key];
        }
    return user.save();
}


/**
 * @return {Song[]}
 */
function getAllSongs() {
   return getWithPattern(/^Song-.*/);
}

/**
 * @return {Album[]}
 */
function getAllAlbums() {
   return getWithPattern(/^Album-.*/);
}

/**
 * @return {Artist[]}
 */
 function getAllArtists() {
    return getWithPattern(/^Artist-.*/);
 }