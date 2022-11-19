/**
 * @param {HTMLElement} root
 * @param {object} search
 */
function SearchContent(root, search) {
   const title = document.createElement("h1");
   title.textContent = "Best results";
   title.classList.add("main-title");
   const songs= search.songs
   const artists = search.artists
   const users = search.users
   const user = __Store.state.loggedIn;
   
   let foundContent=foundUsers(users,user)
   const upper = Options([
      {
          text: "Songs",
          iconPath: "./icons/icons8-down-arrow-64.png",
          alt: "search songs",
          clickHandler: undefined
      },
      {
          text: "Artists",
          iconPath:"./icons/icons8-down-arrow-64.png",
          alt: "search artists",
          clickHandler: undefined
      },
      {
         text: "Users",
         iconPath: "./icons/icons8-down-arrow-64.png",
         alt: "search users",
         clickHandler: undefined
     }
  ]);
   return appendChildren([title, upper, foundContent], root);
}




/**
 * @param {Song[]} songs
 * @param {User} user
 * @return {Element}
 */
 function foundSongs(songs, user) {
    if (user==null){
        return CardContainer(songsCardDataNotLogged("Songs found", "found-songs", NoResultsMessage(songs), songs));
    }
    else{
        return CardContainer(songsCardData("Songs found", "found-songs", NoResultsMessage(songs), songs));
    }
}

/**
 * @param {Artist[]} artists
 * @param {User} user
 * @return {Element}
 */
function foundArtists(artists, user) {
    if (user==null){
        return CardContainer(artistsCardDataNotLogged("Songs found", "found-songs", NoResultsMessage(artists), artists));
    }
    else{
        return CardContainer(artistsCardData("Songs found", "found-songs", NoResultsMessage(artists), artists)) 
    }
}
/**
 * @param {UserId[]} users
 * @param {User} user
 * @return {Element}
 */
 function foundUsers(users, user) {
    if (user==null){
    const FoundContent= UserIconsSectionNotLogged("Following", users, NoResultsMessage(users));
    return FoundContent
    }
    else{
        const FoundContent = UserIconsSection("Following", users, NoResultsMessage(users));
        return FoundContent
    }
}
function Options(items) {
   return appendChildren([...SidebarItems(items)], document.createElement("ul"));
}


/**
 * 
 * @param {User[]} users
 * @param {function(User): (function(MouseEvent): any) | undefined} setIconClickHandler
 * @return {HTMLElement[]}
 */
 function UserIcons(users, setIconClickHandler) {
    return users.map(u => UserIcon({
            user: u,
            clickHandler: setIconClickHandler(u)
        }));
}

/**
 * @param {UserId[]} userIds - ids of users to show
 * @return {HTMLElement}
 */
function _UserIconsSection(userIds) {
    const users = userIds.map(uid => User.find(uid));
    const ret = document.createElement("div");
    ret.classList.add("user-icons-section");
    return appendChildren(UserIcons(users, setClickToUserpage), ret);
}

/**
 * @param {string} title
 * @param {UserId[]} userIds - ids of users to show
 * @param {string} mensaje -message of no results fot the section
 * @return {HTMLElement}
 */
function UserIconsSection(title, userIds,mensaje) {
    const ret = document.createElement("div");
    setClasses(ret, ["playlist", "user-icons-section"])
    const h1Title = document.createElement("h1");
    h1Title.textContent = title;

    const h3Title = document.createElement("h3");
    h3Title.textContent = mensaje;

    const userIcons = _UserIconsSection(userIds);
    return appendChildren([h1Title, userIcons, h3Title], ret);
}

/**
 * @param {string} title
 * @param {UserId[]} userIds - ids of users to show
 * @param {string} mensaje -message of no results fot the section
 * @return {HTMLElement}
 */
 function UserIconsSectionNotLogged(title, userIds,mensaje) {
    const ret = document.createElement("div");
    setClasses(ret, ["playlist", "user-icons-section"])
    const h1Title = document.createElement("h1");
    h1Title.textContent = title;

    const h3Title = document.createElement("h3");
    h3Title.textContent = mensaje;

    const userIcons = _UserIconsSectionNotLogged(userIds);
    return appendChildren([h1Title, userIcons, h3Title], ret);
}

/**
 * @param {UserId[]} userIds - ids of users to show
 * @return {HTMLElement}
 */
 function _UserIconsSectionNotLogged(userIds) {
    const users = userIds.map(uid => User.find(uid));
    const ret = document.createElement("div");
    ret.classList.add("user-icons-section");
    return appendChildren(UserIconsNotLogged(users), ret);
}

/**
 * 
 * @param {User[]} users
 * @return {HTMLElement[]}
 */
 function UserIconsNotLogged(users) {
    return users.map(u => UserIcon({
            user: u,
            clickHandler: undefined
        }));
}