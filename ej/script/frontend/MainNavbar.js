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
    logInRef.addEventListener("click",
        setOpenModalHandler("Enter your credentials:", LogInForm));

    const signIn = document.createElement("li");
    const signInRef = document.createElement("a");
    signInRef.textContent = "Sign In";
    signInRef.addEventListener("click", setOpenModalHandler("Register", SignInForm));

    rightside.appendChild(logIn).appendChild(logInRef);
    rightside.appendChild(signIn).appendChild(signInRef);

    root.appendChild(leftside);
    root.appendChild(rightside);

    return root;
}

/**
 * 
 * @param {HTMLElement} root 
 * @param {User} user 
 * @return {HTMLElement}
 */
function userOpts(root, user) {
    const leftside = document.createElement("div");
    leftside.classList.add("home-section");
    leftside.innerHTML = `
        <img alt="app image" src="./icons/icons8-video-playlist-40.png">
        <h2>SoundSound</h2>
    `;

    const center = Searchbar();

    const rightside = document.createElement("ul");
    const userMenu = document.createElement("li");

    const userImg = document.createElement("img");

    // TODO: handle user image user.profilePicB64
    userImg.src = "./icons/icons8-user-64.png";
    userImg.addEventListener("click", e => {
        const dropdown = Dropdown([
            {text: "Account", clickHandler: undefined},
            {text: "Profile", clickHandler: undefined},
            {text: "Log out", clickHandler: undefined}
        ]);
        document.querySelector(".main-nav").appendChild(dropdown);
    })

    rightside.appendChild(userMenu).appendChild(userImg);

    root.appendChild(leftside);
    root.appendChild(center);
    root.appendChild(rightside);

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

/** @typedef {Object} DropdownItemData
 *  @property {string} text
 *  @property {undefined|function(MouseEvent): any} clickHandler
 */

/**
 * @param {DropdownItemData} item
 */
function DropdownItem(item) {
    const {text, clickHandler} = item
    const ret = document.createElement("li");
    ret.textContent = text;
    if (clickHandler)
        ret.addEventListener("click", clickHandler);
    return ret;
}

/**
 * @param {DropdownItemData[]} items
 */
function DropdownItems(items) {
    return items.map(iData => DropdownItem(iData));
}

/**
 * @param {DropdownItemData[]} items
 * @return {HTMLElement}
 */
function Dropdown(items) {
    const dropdown = foldl((container, element) => {
        container.appendChild(element);
        return container;
    }, DropdownItems(items), document.createElement("ul"));
    dropdown.classList.add("dropdown");

    // TODO: check why this setTimeout is needed for the dropdown to show up in the first place
    setTimeout(() => {
        document.addEventListener("click", e => {
            const clicked = isInDOMTree(e.target, dropdown);
            if (!clicked)
                dropdown.remove();
        });
    }, 0);

    return dropdown;
}