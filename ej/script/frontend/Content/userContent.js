/**
 * @param {HTMLElement} root 
 * @param {User} user 
 * @return {HTMLElement}
 */
 function UserContent(root, user) {
    const title = document.createElement("h1");
    title.textContent = "Account Settings";
    title.classList.add("main-title");

    return appendChildren([title, AccSettingsForm(user)], root);}