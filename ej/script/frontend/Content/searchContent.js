  /**
  * @param {HTMLElement} root
  * @param {Song[]} songs
  * @return {HTMLElement}
  */
 function SearchContent(root, songs) {
    const title = document.createElement("h1");
    title.textContent = "Best results";
    title.classList.add("main-title");
    const songsFoundContent = CardContainerSection([
        FoundCardContainer(songs)
    ]);
    return appendChildren([title, ...songsFoundContent], root);
 }

/**
 * @param {Song[]} songs
 * @return {CardContainerData}
 */

function FoundCardContainer(songs) {
    return {
        title:'songs found',
        containerType: CardContainerType.SongCard,
        data: songs.map(s => ({
            song: s,
            playable: true,
            likeable: {liked: isLikedByLoggedIn(s)},
            commonProperties: {
                clickHandler: setClickToLikeHandler(s),
                intervalUpdate: undefined,
                badgeMessage: undefined,
            },
        }))
    };
}