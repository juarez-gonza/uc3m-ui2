/**
 * @readonly
 * @enum {number}
 */
 const SearchCategory = {
    Artists: 0,
    Songs: 1,
    Users: 2,
};

/**
 * @param {HTMLElement} root
 * @param {object} search
 */
function SearchContent(root, search) {
   const title = document.createElement("h1");
   title.textContent = "Best results";
   title.classList.add("main-title");

   const user = __Store.state.loggedIn;
   const foundContent = SelectContent(search, user)
   const upper = Options([
      {
          text: "Songs",
          iconPath: "./icons/icons8-down-arrow-64.png",
          alt: "search songs",
          clickHandler:  e => { 
            e.preventDefault();
            search.category = SearchCategory.Songs;
            __Store.commit("toSearchPage", search);
        }
      },
      {
          text: "Artists",
          iconPath:"./icons/icons8-down-arrow-64.png",
          alt: "search artists",
          clickHandler: e => { 
            e.preventDefault();
            search.category = SearchCategory.Artists;
            __Store.commit("toSearchPage", search);
        }
      },
      {
         text: "Users",
         iconPath: "./icons/icons8-down-arrow-64.png",
         alt: "search users",
         clickHandler: e => { 
            e.preventDefault();
            search.category = SearchCategory.Users;
            __Store.commit("toSearchPage", search);
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
function SelectContent(search, user){
    switch (search.category) {
        case SearchCategory.Songs:
            return foundSongs(search.songs, user);
        case SearchCategory.Artists:
            return foundArtists(search.artists, user)
        case SearchCategory.Users:
            return foundUsers(search.users, user)
    }
}

/**
 * @param {Song[]} songs
 * @param {User} user
 * @return {Element}
 */
 function foundSongs(songs, user) {
    return CardContainer(
        songsCardData("Songs found",
                        "found-songs",
                        NoResultsMessage(songs),
                        songs,
                        user === null ? () => __NoCardProperties : likeableCardProperties));
}

/**
 * @param {Artist[]} artists
 * @param {User} user
 * @return {Element}
 */
function foundArtists(artists, user) {
    return CardContainer(
        artistsCardData("Artitsts found",
                        "artists-songs",
                        NoResultsMessage(artists),
                        artists,
                        user === null ? () => __NoCardProperties : interactableArtistCardProperties));
}

/**
 * @param {UserId[]} results
 * @param {User} user
 * @return {Element}
 */
 function foundUsers(results, user) {
    return UserIconsSection(
        "Found Users",
        results,
        NoResultsMessage(results),
        user === null ? () => id : setClickToUserpage
    );
}

function Options(items) {
   return appendChildren([...SidebarItems(items)], document.createElement("ul"));
}