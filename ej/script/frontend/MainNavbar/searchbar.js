/**
 * @return {HTMLElement}
 */
function Searchbar() {
    const ret = document.createElement("div");
    ret.classList.add("searchbar");

    const searchInput = document.createElement("input");
    searchInput.placeholder = "Search your favourite songs";
    searchInput.type = "text";
    searchInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter")
          PressEnter(searchInput);
    });

    ret.appendChild(searchInput);

    return ret;
};
 
/**
 * @param {string} inputStr
 * @return {Song[]} 
 */
function findSongs(inputStr) {
    //@ts-ignore
    const fuse = new Fuse(getAllSongs(), {
        keys: ['title','artist']
      })
    /** @type {Song[]} */
    const songsFound= fuse.search(inputStr).map(s => s.item);

    return songsFound
    
}


  /**
  * @param {HTMLInputElement} input
  */
function PressEnter(input) {
    __Store.commit("toSearchPage", findSongs(input.value));
};
