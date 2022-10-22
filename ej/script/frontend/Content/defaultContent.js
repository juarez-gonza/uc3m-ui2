/**
 * @param {RegExp} pattern 
 */
function getWithPattern(pattern) {
   const ret = [];
   const lS = window.localStorage;
   for (const key in lS) {
      if (!lS.hasOwnProperty(key))
         continue;

      const item  = JSON.parse(lS.getItem(key));
      if (pattern.test(item._id))
         ret.push(item);
   }
   return ret;
}

/**
 * @return {Song[]}
 */
function getAllSongs() {
   return getWithPattern(/^Song-.*/);
}

/**
 * @return {Album[]}
 */
function getAllAlbums() {
   return getWithPattern(/^Album-.*/);
}

/**
 * 
 * @param {number} n 
 * @param {Song[]} songs
 * @return {Song[][]};
 */
function songNCollections(n, songs) {
   return take(slide(songs, n), 3);
}

/**
 * @param {Date} initCountdown
 * @return {function(HTMLElement): boolean}
 */
function countdownHandler(initCountdown) {
   return card => {
      const description = card.querySelector(".badge-msg");
      if (description === null)
         return false;
      description.textContent = msToHhmmss(diffFromNowMs(initCountdown));
      return true;
   };
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
   const content = CardContainerSection(songNCollections(5, getAllSongs()).map((songs, idx) => {
      const premiereDate = nDaysFromNow(idx + 2);
      return {
         title: `Playlist ${idx}`,
         data: songs.map(s => ({
            song: s,
            intervalUpdate: {
               handler: countdownHandler(premiereDate),
               period: 1000,
            },
            badgeMessage: msToHhmmss(diffFromNowMs(premiereDate)),
            playable: false,
            clickHandler: undefined,
         })),
         containerType: CardContainerType.SongCard
      };
   }));
   return appendChildren([title, ...content], root);
}