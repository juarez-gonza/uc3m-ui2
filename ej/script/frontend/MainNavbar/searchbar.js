/**
 * @template T
 * @param {function(T[]): any} onEnter
 * @param {function(string): T[]} finder
 * @param {string} placeholder
 * @return {HTMLElement}
 */

function Searchbar(placeholder, finder, onEnter) {
    const ret = document.createElement("div");
    ret.classList.add("big-input");

    const searchInput = document.createElement("input");
    searchInput.placeholder = placeholder;
    searchInput.type = "text";
    searchInput.addEventListener("keypress", e => {
        if (e.key === "Enter")
          onEnter(finder(searchInput.value));
    });
    
    ret.appendChild(searchInput);

    return ret;
}
 
/**
 * @param {string} inputStr
 * @return {Song[]} 
 */
function findSongs(inputStr) {
  //@ts-ignore el tipado de Fuse no es reconocido por falta de declaration file
  const fuse = new Fuse(getAllSongs(), {
      keys: ['title']
  });
  const songsFound = fuse.search(inputStr).map(s => s.item);
  return songsFound
}

/**
 * @param {string} inputStr
 * @return {Artist[]} 
 */
function findArtists(inputStr) {
  //@ts-ignore el tipado de Fuse no es reconocido por falta de declaration file
  const fuse = new Fuse(getAllArtists(), {
    keys: ['name']
  });
  /** @type {Artist[]} */
  const artistsFound = fuse.search(inputStr).map(s => s.item);
  return artistsFound
}


/**
 * @param {string} inputStr
 * @return {User[]} 
 */
 function findUsers(inputStr) {
  //@ts-ignore
  const fuse = new Fuse(getAllUsers(), {
      keys: ['username']
  });
  const usersFound = fuse.search(inputStr).map(s => s.item);
  return usersFound
}

/**
 * @param {string} inputStr
 * @return {object} 
 */
 function findContent(inputStr) {
  const songs = findSongs(inputStr);
  const artists = findArtists(inputStr);
  const users = findUsers(inputStr);
  const search = {
    songs,
    artists,
    users,
    category: SearchCategory.Songs
  };
  return search;
}