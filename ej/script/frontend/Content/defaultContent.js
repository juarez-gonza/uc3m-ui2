/**
 * @param {Date} initCountdown
 * @return {function(HTMLElement): boolean}
 */
function countdownHandler(initCountdown) {
   return card => {
      const description = card.querySelector(".badge-msg");
      if (description === null)
         return false;
      description.textContent = compose(msToHhmmss, diffFromNowMs)(initCountdown);
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
   title.textContent = "Next on SoundSound";
   title.classList.add("main-title");
   return appendChildren([title, upcommingSongsContainer(), upcommingAlbumsContainer()], root);
}


// Codigo feo para generar cartas con contador

/**
 * @return {HTMLElement}
 */
function upcommingSongsContainer() {
   return CardContainer({
      title: "New Songs!",
      data: take(getAllSongs(), 5).map((s, idx) => {
         const premiereDate = nDaysFromNow(idx + 1);
         return {
            song: s,
            playable: false,
            commonProperties: {
               intervalUpdate: {
                  handler: countdownHandler(premiereDate),
                  period: 1000,
               },
               badgeMessage: msToHhmmss(diffFromNowMs(premiereDate)),
               clickHandler: undefined
            }
         };
      }),
      containerType: CardContainerType.SongCard
   });
}

/**
 * @return {HTMLElement}
 */
function upcommingAlbumsContainer() {
   return CardContainer({
      title: "New Albums!",
      data: take(getAllAlbums(), 5).map((a, idx) => {
         const premiereDate = nDaysFromNow(idx + 1);
         return {
            album: a,
            playable: false,
            commonProperties: {
               intervalUpdate: {
                  handler: countdownHandler(premiereDate),
                  period: 1000,
               },
               badgeMessage: compose(msToHhmmss, diffFromNowMs)(premiereDate),
               clickHandler: undefined
            }
         };
      }),
      containerType: CardContainerType.AlbumCard,
   });
}