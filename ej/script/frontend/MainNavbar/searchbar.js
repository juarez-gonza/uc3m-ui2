/**
 * @template T
 * @param {function(T[]): any} onEnter
 * @param {function(string): T[]} finder
 * @param {string} placeholder
 * @return {HTMLElement}
 */
function Searchbar(placeholder, finder, onEnter) {
    const ret = document.createElement("div");
    ret.classList.add("searchbar");

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
  //@ts-ignore
  const fuse = new Fuse(getAllSongs(), {
      keys: ['title','artist']
  });
  /** @type {Song[]} */
  const songsFound = fuse.search(inputStr).map(s => s.item);

  return songsFound;
}