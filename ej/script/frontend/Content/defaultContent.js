/**
 * @return {Song[]}
 */
function getAllSongs() {
   const ret = [];
   const lS = window.localStorage;
   for (const key in lS) {
      if (!lS.hasOwnProperty(key))
         continue;

      const item  = JSON.parse(lS.getItem(key));
      if (/^Song-.*/.test(item._id))
         ret.push(item);
   }
   return ret;
}

/**
 * 
 * @param {number} n 
 * @return {Song[][]};
 */
function songNCollections(n) {
   const allSongs = getAllSongs();
   return take(slide(allSongs, 5), 3);
}

/**
 * 
 * @param {HTMLElement} root
 * @return {HTMLElement}
 */
function DefaultContent(root) {
    const title = document.createElement("h1");
    title.textContent = "Explore new songs!";
    title.classList.add("main-title");

    const fillerContent = songNCollections(5).map((songs, idx) => ({title: `Playlist ${idx}`, songs: songs}));

    root.appendChild(title);
    return appendChildren(CardContainerSection(fillerContent), root);
}