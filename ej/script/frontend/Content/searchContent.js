  /**
  * @param {HTMLElement} root
  * @param {string} input
  * @return {HTMLElement}
  */
 function SearchContent(root,input) {
    const title = document.createElement("h1");
    title.textContent = "Best results";
    title.classList.add("main-title");
    const found_songs = find_songs(input)
    const songsFoundContent = CardContainerSection([
        FoundCardContainer(found_songs)
    ]);
    return appendChildren([title, ...songsFoundContent], root);
 }
 
/**
 * @param {string} input_song
 * @return {Song[]} 
 */
function find_songs(input_song) {
    //@ts-ignore
    const fuse = new Fuse(getAllSongs(), {
        keys: ['title','artist']
      })
    const songsFound=fuse.search(input_song)

    return songsFound
    
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