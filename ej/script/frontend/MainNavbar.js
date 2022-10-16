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
        if (__Store.state.loggedIn === null)
            return defaultOpts(this.element);
        else
            return this.element;
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

function userOpts(root, user) {
}