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
        const loggedIn = __Store.state.loggedIn;
        if (loggedIn === null)
            return MainNavbarDefault(this.element)
        return MainNavbarProfile(this.element, loggedIn);
  
    }
};

/**
 * @param {HTMLElement} root 
 */
function MainNavbarDefault(root) {
    const leftside = document.createElement("div");
    leftside.classList.add("home-section");
    leftside.innerHTML = `
        <img alt="app-image" src="./icons/icons8-video-playlist-40.png">
        <h2>SoundSound</h2>
    `;
    leftside.addEventListener("click", logOut);

    const center = Searchbar("Search your favourite songs",
                                findContent,
                                onEnterMainSearchbar);

    const rightside = document.createElement("ul");

    const logIn = document.createElement("li");
    const logInRef = document.createElement("a");
    logInRef.textContent = "Log In";
    logInRef.addEventListener("click", setOpenModalHandler("Log In", LogInForm));

    const signIn = document.createElement("li");
    const signInRef = document.createElement("a");
    signInRef.textContent = "Sign In";
    signInRef.addEventListener("click", setOpenModalHandler("Register", SignInForm));

    const language = document.createElement("li");
    const languageImg = document.createElement("img");
    languageImg.alt = "language-selection-img";
    languageImg.src = "./icons/icons8-uk-flag-64.png";
    languageImg.classList.add("lang-selection");

    rightside.appendChild(logIn).appendChild(logInRef);
    rightside.appendChild(signIn).appendChild(signInRef);
    rightside.appendChild(language).appendChild(languageImg);

    return appendChildren([leftside, center, rightside], root);
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
    leftside.addEventListener("click", () => logIn(user));

    const center = Searchbar("Search your favourite songs",
                                findContent,
                                onEnterMainSearchbar);

    // TODO: handle user image user.profilePicB64
    const rightside = document.createElement("ul");
    const userMenu = document.createElement("li");
    const userImg = UserIcon({user: user, label: undefined, clickHandler: outerE => {
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
            document.removeEventListener("click", _handler); /* este self-reference en el segundo argumento
                                                                es la razón por la que el callback no es una función anónima */
        });
    }});

    const dropdown = root.appendChild(Dropdown([
            {text: "Account", clickHandler: () => goToAccountSettings(user)},
            {text: "Profile", clickHandler: () => logIn(user)},
            {text: "Log out", clickHandler: setOpenModalHandler("Are you sure you want to log out?", LogOutForm)}]));

    const language = document.createElement("li");
    const languageImg = document.createElement("img");
    languageImg.src = "./icons/icons8-uk-flag-64.png";
    languageImg.alt = "language-selection-img";
    languageImg.classList.add("lang-selection");

    rightside.appendChild(userMenu).appendChild(userImg);
    rightside.appendChild(language).appendChild(languageImg);

    return appendChildren([leftside, center, rightside], root);
}

/**
* @param {Song[]} search
*/
function onEnterMainSearchbar(search) {
    nextPage("toSearchPage", search);
}

/**
 * @param {User} user
 */
function goToAccountSettings(user) {
    nextPage("toAccSettings", user);
}