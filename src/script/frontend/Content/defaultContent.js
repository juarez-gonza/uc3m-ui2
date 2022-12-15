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
   title.textContent = "Welcome to SoundSound";
   title.classList.add("main-title");
   const title2 = document.createElement("p");
   title2.textContent = "In SoundSound you can find your favourite music and podcasts";
   const title3 = document.createElement("h2");
   title3.textContent = "Start now";
   const imagen = document.createElement("div");
    imagen.classList.add("home-section");
    imagen.innerHTML = `
        <img alt="app image" src="./icons/Ultimate-Guide-Stock-Music-Royalty-Free-Music-Custom-Music.png (1).jpg">
    `;
   return appendChildren([title,title2,title3,imagen], root);
   }
