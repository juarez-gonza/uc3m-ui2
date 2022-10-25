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
        if (event.key === "Enter") {
          PressEnter(searchInput);
        }
    });

    ret.appendChild(searchInput);

    return ret;
};

  /**
  * @param {HTMLInputElement} search
  */
function PressEnter(search) {
    __Store.commit("toSearchPage", search);
};
