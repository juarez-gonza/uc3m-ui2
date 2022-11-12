/**
 * @param {HTMLElement} root
 * @param {Song[]} songs
 * @return {HTMLElement}
 */
function SearchContent(root, songs) {
   const title = document.createElement("h1");
   title.textContent = "Best results";
   title.classList.add("main-title");
   const songsFoundContent = foundSongsContainer(songs);
   return appendChildren([title, songsFoundContent], root);
}

/**
 * @param {Song[]} songs
 */
function foundSongsContainer(songs) {
   return CardContainer(
         songsCardData("Songs found", "found-songs", "Start searching!", songs)
   );
}