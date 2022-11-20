/**
 * @param {HTMLElement} root
 * @param {object} search
 */
function SearchContent(root, search) {
   const title = document.createElement("h1");
   title.textContent = "Best results";
   title.classList.add("main-title");

   const user = __Store.state.loggedIn;
   const foundContent=SelectContent(search,user)
   const upper = Options([
      {
          text: "Songs",
          iconPath: "./icons/icons8-down-arrow-64.png",
          alt: "search songs",
          clickHandler:  e => { 
            e.preventDefault();
            search.n=0;
            __Store.commit("toSearchPage",search);
        }
      },
      {
          text: "Artists",
          iconPath:"./icons/icons8-down-arrow-64.png",
          alt: "search artists",
          clickHandler: e => { 
            e.preventDefault();
            search.n=1;
            __Store.commit("toSearchPage",search);
        }
      },
      {
         text: "Users",
         iconPath: "./icons/icons8-down-arrow-64.png",
         alt: "search users",
         clickHandler: e => { 
            e.preventDefault();
            search.n=2;
            __Store.commit("toSearchPage",search);
        }
     }
  ]);
   return appendChildren([title, upper, foundContent], root);
}

/**
 * 
 * @param {object} search
 * @param {User} user
 */
function SelectContent(search,user){
    if (search.n==0){
    return foundSongs(search.songs,user)}

    else if (search.n==1){
    return foundArtists(search.artists,user)}

    else{
    return foundUsers(search.users,user)}
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
        return CardContainer(artistsCardDataNotLogged("Artitsts found", "artists-songs", NoResultsMessage(artists), artists));
    }
    else{
        return CardContainer(artistsCardData("Artitsts found", "artists-songs", NoResultsMessage(artists), artists)) 
    }
}
/**
 * @param {UserId[]} users
 * @param {User} user
 * @return {Element}
 */
 function foundUsers(users, user) {
    if (user==null){
    const FoundContent= UserIconsSectionNotLogged("Found users", users, NoResultsMessage(users));
    return FoundContent
    }
    else{
        const FoundContent = UserIconsSection("Found users", users, NoResultsMessage(users));
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


