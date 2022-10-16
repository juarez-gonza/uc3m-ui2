class MainNavbar {
    /** @type {HTMLElement} */
    element;

    constructor() {
        __Store.events.subscribe("stateChange", () => this.render());
        this.element = document.querySelector("nav.main-nav");
    }

    /**
     * @return {HTMLElement}
     */
    render() {
        removeAllChildren(this.element);
        if (__Store.state.loggedIn === null)
            return defaultOpts(this.element);
        else
            return userOpts(this.element, __Store.state.loggedIn);
    }
};

/**
 * @param {HTMLElement} root 
 */
function defaultOpts(root) {
    const rightside = document.createElement("div");
    rightside.classList.add("home-section");
    rightside.innerHTML = `
        <img alt="app image" src="./icons/icons8-video-playlist-40.png">
        <h2>SoundSound</h2>
    `;

    const leftside = document.createElement("ul");

    const logIn = document.createElement("li");
    const logInRef = document.createElement("a");
    logInRef.textContent = "Log In";
    logInRef.addEventListener("click",
        setOpenModalHandler("Enter your credentials:", LogInForm));

    const signIn = document.createElement("li");
    const signInRef = document.createElement("a");
    signInRef.textContent = "Sign In";
    signInRef.addEventListener("click", setOpenModalHandler("Register", SignInForm));

    leftside.appendChild(logIn).appendChild(logInRef);
    leftside.appendChild(signIn).appendChild(signInRef);

    root.appendChild(rightside);
    root.appendChild(leftside);

    return root;
}

/**
 * 
 * @param {HTMLElement} root 
 * @param {User} user 
 * @return {HTMLElement}
 */
function userOpts(root, user) {
    const rightside = document.createElement("div");
    rightside.classList.add("home-section");
    rightside.innerHTML = `
        <img alt="app image" src="./icons/icons8-video-playlist-40.png">
        <h2>SoundSound</h2>
    `;

    const center = Searchbar();

    const leftside = document.createElement("ul");
    const userMenu = document.createElement("li");
    const userImg = document.createElement("img");

    // TODO: handle user image user.profilePicB64
    userImg.src = "./icons/icons8-user-64.png";
    userImg.addEventListener("click", () => {console.warn("Dropdown not implemented yet!!")})

    leftside.appendChild(userMenu).appendChild(userImg);

    root.appendChild(rightside);
    root.appendChild(center);
    root.appendChild(leftside);

    return root;
}

/**
 * @return {HTMLElement}
 */
function Searchbar() {
    const ret = document.createElement("div");
    ret.classList.add("searchbar");

    const searchInput = document.createElement("input");
    searchInput.placeholder = "Search your favourite songs";
    searchInput.type = "text";

    ret.appendChild(searchInput);

    return ret;
}