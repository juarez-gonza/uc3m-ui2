/**
 * @return {HTMLElement}
 */
function Searchbar() {
    const ret = document.createElement("div");
    ret.classList.add("searchbar");

    const searchInput = document.createElement("input");
    searchInput.placeholder = "Search your favourite songs";
    searchInput.type = "text";

    ret.appendChild(searchInput);

    return ret;
}