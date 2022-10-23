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
            return MainNavbarDefault(this.element);
        return MainNavbarProfile(this.element, __Store.state.loggedIn);
    }
};

/**
 * @param {HTMLElement} root 
 */
function MainNavbarDefault(root) {
    const leftside = document.createElement("div");
    leftside.classList.add("home-section");
    leftside.innerHTML = `
        <img alt="app image" src="./icons/icons8-video-playlist-40.png">
        <h2>SoundSound</h2>
    `;

    const rightside = document.createElement("ul");

    const logIn = document.createElement("li");
    const logInRef = document.createElement("a");
    logInRef.textContent = "Log In";
    logInRef.addEventListener("click", setOpenModalHandler("Enter your credentials:", LogInForm));

    const signIn = document.createElement("li");
    const signInRef = document.createElement("a");
    signInRef.textContent = "Sign In";
    signInRef.addEventListener("click", setOpenModalHandler("Register", SignInForm));

    rightside.appendChild(logIn).appendChild(logInRef);
    rightside.appendChild(signIn).appendChild(signInRef);

    return appendChildren([leftside, rightside], root);
}

function goToLoggedInProfile() {
    __Store.commit("logIn", __Store.state.loggedIn);
}

/**
 * 
 * @param {HTMLElement} root 
 * @param {User} user 
 * @return {HTMLElement}
 */
function MainNavbarProfile(root, user) {
    const leftside = document.createElement("div");
    leftside.classList.add("home-section");
    leftside.innerHTML = `
        <img alt="app image" src="./icons/icons8-video-playlist-40.png">
        <h2>SoundSound</h2>
    `;

    const center = Searchbar();

    // TODO: handle user image user.profilePicB64
    const rightside = document.createElement("ul");
    const userMenu = document.createElement("li");
    const userImg = UserIcon({user: user, clickHandler: outerE => {
        // if the dropdown is not overlapped with the userImg, then
        // a conditional to check that the same dropdown is not opened
        // twice would be needed. Not the case here
        dropdown.classList.add("show");
        document.addEventListener("click", function _handler(innerE) {
            if (innerE === outerE)
                return;
            if (isInDOMTree(innerE.target, dropdown) || !dropdown.classList.contains("show"))
                return;
            dropdown.classList.remove("show");
            document.removeEventListener("click", _handler);
        });
    }});

    const dropdown = root.appendChild(Dropdown([
            {text: "Account", clickHandler: undefined},
            {text: "Profile", clickHandler: goToLoggedInProfile},
            {text: "Log out", clickHandler: undefined}]));

    rightside.appendChild(userMenu).appendChild(userImg);

    return appendChildren([leftside, center, rightside], root);
}