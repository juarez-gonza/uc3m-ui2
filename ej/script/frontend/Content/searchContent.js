/**
 * @param {HTMLElement} root
 * @param {Song[]} search
 * @return {HTMLElement}
 */
function SearchContent(root, search) {
    const user = __Store.state.loggedIn;
   const title = document.createElement("h1");
   const songs= search
   const artists = search
   const users = search
   const n= 0
   title.textContent = "Best results";
   title.classList.add("main-title");
   //@ts-ignore
   const songsFoundContent = Opciones(songs, artists, users, n, user);
   const upper = Options([
      {
          text: "Songs",
          iconPath: "./icons/icons8-down-arrow-64.png",
          alt: "search songs",
          clickHandler: e => { 
              e.preventDefault();
              __Store.commit("toSearchPage",search);
          }
      },
      {
          text: "Artists",
          iconPath:"./icons/icons8-down-arrow-64.png",
          alt: "search artists",
          clickHandler: e => {
              e.preventDefault();
              __Store.commit("toSearchPage",search);
          }
      },
      {
         text: "Users",
         iconPath: "./icons/icons8-down-arrow-64.png",
         alt: "search users",
         clickHandler: e => {
             e.preventDefault();
             __Store.commit("toSearchPage", search);
         }
     }
  ]);
   return appendChildren([title, upper, songsFoundContent], root);
}

/**
 * @param {Song[]} songs
 */
function foundSongsContainer(songs) {
   return CardContainer(
        songsCardData("Songs found", "found-songs", "", songs)
   );
}

/**
 * @param {Song[]} songs
 */
function foundSongsContainerNotLogged(songs) {
    return CardContainer(
        songsCardDataNotLogged("Songs found", "found-songs", "", songs)
);
}
/**
 * @param {Artist[]} artists
 */
 function foundArtistsContainer(artists) {
    return CardContainer(
        artistsCardData("Songs found", "found-songs", "", artists)
    );
 }

 /**
 * @param {Artist[]} artists
 */
  function foundArtistsContainerNotLogged(artists) {
    return CardContainer(
        artistsCardDataNotLogged("Songs found", "found-songs", "", artists)
    );
 }




/**
 * @param {string} title
 * @param {string} id
 * @param {string} mensaje
 * @param {Artist[]} recentArtists
 * @return {CardContainerData} 
 */

/**
 * @param {Song[]} songs
 * @param {Artist[]} artists
 * @param {number} n
 * @param {User[]} user
 * @return {Element}
 */
 function Opciones(songs, artists, users, n, user) {
    if (n==0){
        if (user==null){
        const FoundContent= foundSongsContainerNotLogged(songs)
        return FoundContent
        }
        else{
            const FoundContent= foundSongsContainer(songs)
            return FoundContent
        }
    }
    
    else if (n==1){
        if (user==null){
        const FoundContent= foundArtistsContainerNotLogged(artists)
        return FoundContent
        }
        else{
            const FoundContent= foundArtistsContainer(artists)
            return FoundContent
        }
    }

    else{
        if (user==null){
            const FoundContent= foundArtistsContainer(users)
            return FoundContent
        }
        else{
            const FoundContent= foundArtistsContainer(users)
            return FoundContent
        }

    }
 }
function Options(items) {
   return appendChildren([...SidebarItems(items)], document.createElement("ul"));
}
