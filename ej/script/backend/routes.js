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
 *  @property {Date} birth
 *  @property {string|undefined} profilePicB64
 */

/**
 * @param {NewUserData} userData
 * @return {User}
 */
function signInUserReq(userData) {
    if (User.find(User.genUserId(userData.username)))
        throw new RepetitionError("This username already exists");
    const newUser = new User(userData);
    return newUser.save();
}