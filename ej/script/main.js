/**
 * en este archivo se generan datos inicial para jugar y
 * se corre el primer render (initialRender()) de elementos html que mantienen estado
 * @module main.js
 * @requires ./entities.js
 */

/**
 * @param {Object[]} artistData
 * @return {Artist[]}
 */
function initArtists(artistData) {
   return artistData.map(a => {
      return new Artist(a.name);
   });
}

/**
 * @param {Artist[]} artists
 * @param {string[]} descriptions
 * @param {string[]} songTitles
 * @return {[Song[], Artist[]]}
 */
function initSingles(songTitles,artists,descriptions) {
   /** @type {Song[]} */
   const songs = iota(15).map(i => {
      const artist = artists[i % artists.length];
      const songTitle=songTitles[i];
      const songPath=`./audios/${(i % artists.length + 1)}.mp3`;
      const title = songTitle+"-"+`${artist.name}`
      const description = descriptions[i % artists.length];
      const image = "./images/"+ (i % artists.length + 1)+".jpg"
      const song = artist.addSingle(title, songPath, description, image); 
      return song;
   });

   return [songs, artists];
}

/**
 * 
 * @param {Artist[]} artists
 * @param {Object[]} albumTitles
 * @param {string[]} descriptions
 * @param {string[]} songTitles
 * @return {[Album[], Artist[]]}
 */
 function initAlbums(artists,albumTitles,descriptions,songTitles) {
   /** @type {Album[]} */
   const albums = iota(2).map(i => {
      const artist = artists[i+5];
      const albumTitle = albumTitles[i];
      const coverPath ="./images/"+ (16+i) +".jpg"; //Elige las imagenes 16,17 y 18 como cover de album
      const songs = iota(6).map(j => {
         const songTitle = songTitles[6*i+j]+"-"+`${artist.name}`
         const songPath = `./audios/${16+6*i+j}.mp3`;
         const description = descriptions[6*i+j];
         const newSong = new Song(songTitle, artist._id, songPath, description);
         return newSong;
      });

      const album = artist.addAlbum(albumTitle, songs, coverPath);
      return album;
   });

   return [albums, artists];
}

/**
 * 
 * @param {Artist[]} artists 
 * @param {Song[]} songs 
 * @param {Album[]} albums
 * @param {Object[]} userData
 * @return {User[]}
 */
function initUsers(artists, songs, albums, userData) {
   /** @type {User[]} */
   const users = userData.map((v, i) => {
      const user = new User({
         username: v.username,
         password: v.password,
         firstName: v.firstName,
         lastName: v.lastName,
         email: v.email,
         birth: v.birth,
      });

      // añadir 2 playlist de 8 canciones a cada usuario
      for (const j of iota(2)) {
         const playlistSongs = [
            songs[(i + j + 1) % songs.length],
            songs[(i + j + 2) % songs.length],
            songs[(i + j + 3) % songs.length],
            songs[(i + j + 4) % songs.length],
            albums[(i + j) % albums.length].songs[0],
            albums[(i + j + 1) % albums.length].songs[0],
            albums[(i + j + 2) % albums.length].songs[1],
            albums[(i + j + 3) % albums.length].songs[1],
         ];
         user.addPlaylist(`Playlist-${j}.${user._id}`, playlistSongs);
      }

      // añadir 6 canciones favoritas y 6 canciones recientes
      // (iguales por simplicidad del código de inicialización)
      for (const j of iota(6)) {
         const album = albums[(i + j) % albums.length];
         const song = album.songs[(i + j) % album.songs.length];
         user.addFavSong(song);
         user._addRecentSong(song);
      }

      // añadir 7 artistas favoritos por usuario
      for (const j of iota(7))
         user.addRecentArtist(artists[(j + i) % artists.length]);

      return user;
   });

   // que los usuarios se sigan mutuamente
   for (let i = 0; i < 5; i++)
      for (const u1 of users)
         for (const u2 of users)
            if (u1._id !== u2._id)
               u1.followUser(u2._id)
   return users;
}

const INIT_SONGS_DATA= [
   "Ramble On",
   "En la Buena",
   "The doors",
   "Demon(yo)",
   "Antes de perderte",
   "Olvidame",
   "Praise the lord",
   "El patio",
   "ITMFL",
   "Calling my phone",
   "Postions",
   "Intentions",
   "Si tu supieras",
   "Lokera",
   "Ojitos lindos",
];

const INIT_ARTISTS_DATA = [
   {name: "led Zeppeling"},
   {name: "Dirty Suc"},
   {name: "The doors"},
   {name: "Hecky"},
   {name: "Duki"},
   {name: "Dirty Suc"},
   {name: "A$AP Rocky"},
   {name: "Delaossa"},
   {name: "La Haine"},
   {name: "Ariadna Grande"},
   {name: "Justin Bieber"},
   {name: "Feid"},
   {name: "Rauw Alejandro"},
   {name: "Ojitos lindos"},
];
const INIT_DESCRIPTIONS = [
   "Ramble On",
   " La Ria is the last song of a freestyle mixtape of an upcoming new artist from Spain, Dirty Suc. It was produced by Laghost who is considered one of the most remarkable producers in the country. ",
   "Break On Through (To the Other Side) is a song written and recorded by the Doors. It is the opening track of their debut album, The Doors (1967). ",
   "Demon(yo) is considered the most popular song of Hecky the singer of Valencia(Spain). At the beginning it was only going to be a song to share with his friends but they advised him to pload it and he has become a anthem for his fans",
   "A song produced by Big One that is the third advance of his next work, Reggaeton 2 season.It is a reggaeton song that tells us a love story in which its members separated by following different paths but fail to forget and dream of continuing together.",
   "Olvidame is the first song that went viral of Dirty Suc, an upcoming spanish artist. It is produced by his personal producer Laghost as the majority of his music.",
   "Praise the Lord (Da Shine) is a song by American rapper ASAP Rocky, with production and featured vocals from English rapper Skepta, released as the second single from his third studio album Testing on June 26, 2018",
   "The patio, a song that has been really carefully and slowly made and in which we can hear a fusion of urban and flamenco sounds full of feeling. ",
   "ITMFL is a song by spanish rapper LHAINE who is known to make the best music related with love.ITMFL stands for In the mood for love and the idea of this title belongs to the producer of the songseryi.",
   "Calling My Phone is a song by American recording artists Lil Tjay and 6lack from the former's second studio Destined 2 Win (2021). It was released on February 12, 2021, through Columbia and Sony.",
   "Positions is a song recorded by American singer Ariana Grande. The song was released by Republic Records on October 23, 2020, as the lead single from Grande's sixth studio album of the same name. ",
   "Intentions is a song by Canadian singer Justin Bieber, featuring vocals from American rapper Quavo. It was released as the second single from Bieber's fifth studio album, Changes, on February 7, 2020. ",
   "Si tu supieras is a song by artist Feid. The singer talks about all the things he did to try and forget his ex-lover. A visual that accompanies the launch of his fourth album entitled Inter Shibuya.",
   "Lokera is a song recorded by Puerto Rican singers Rauw Alejandro and Lyanno with Puerto Rican rapper Brray. It was written by Alejandro, Lyanno, and Brray, while the production was handled by Mr. NaisGai, Alejandro, and Caleb Calloway.",
   "Ojitos Lindos (Pretty Eyes) is a song by Puerto Rican rapper Bad Bunny and Colombian band Bomba Estéreo. It was released on May 6, 2022, by Rimas Entertainment as the fourteenth track of Bad Bunny's fifth studio album Un Verano Sin Ti (2022), alongside the rest of the record.",

];


// Nombre de los albums
const INIT_ALBUMS_DATA = [
   "CSQ",
   "Animal",
]
const INIT_SONGS_ALBUM_DATA= [
   "Lean with me",
   "Armed and Dangerous",
   "In my Head",
   "Lucid Dreams",
   "Robbery",
   "Wishing well",
   "21",
   "DND",
   "Epidemic",
   "Finer things",
   "I know",
   "Rapstar",
];

const INIT_ALBUMS_DESCRIPTIONS = [
   "Lean wit Me is a song by American rapper and singer Dirty Suc. It was included as the seventh song on his debut studio album Goodbye & Good Riddance (2018).",
   "Armed and Dangerous is a song by American rapper Dirty Suc, released as a single on October 15, 2018. ",
   "In My Head is a song released by Dirty Suc in October 2022. It was again a track that went viral immediately after the release, as it often happens with the American rapper (last time it was with Bye Bye).",
   "Lucid Dreams (alternatively Lucid Dreams (Forget Me)) is a song by American rapper and singer Dirty Suc. It was officially released by Grade A Productions and Interscope Records on May 4, 2018",
   "Robbery is a song by American rapper and singer Dirty Suc. It was released on February 13, 2019, via Grade A Productions through exclusive licensing to Interscope Records. ",
   "Wishing Well is a song by American rapper and singer Dirty Suc, from his posthumous third studio album Legends Never Die, written by him, along with its producers Dr. Luke and Chopsquad DJ.",
   "21 is a song by American rapper Rocky from his second studio album The Goat (2020). It was produced by Keanu Beats and Khaled Rohaim.",
   "DND (Do Not Disturb) is a song by American rapper Rocky, released on April 10, 2020 as the third single from his second studio album The Goat (2020). It was produced by WayneOnABeat.",
   "Epidemic is a song by American rapper Rocky. It was released as the lead single from his third studio album, Hall of Fame (2021), on September 25, 2020. It was produced by Tahj Money, D Mac, LondnBlu and Karltin Bankz.",
   "Finer Things is a song by American rapper Rocky. It was first released in August 2018, before being released through streaming services on November 30, 2018. Upon the song's release, it gained millions of streams and views, helping Polo G rise to fame. The song is also the lead single from his debut studio album Die a Legend (2019).",
   "I know is a song by American rapper Rocky, released on April 10, 2020 as the third single from his second studio album The Goat (2020). It was produced by WayneOnABeat.",
   "Rapstar is a song by American rapper Rocky. It was released through Columbia Records as the third single from his third studio album, Hall of Fame, on April 9, 2021.",
];

const INIT_USERS_DATA = [
   {
      username: "gonzalo",
      password: "12345678",
      firstName: "Gonzalo",
      lastName: "Juarez",
      email: "gonzalo@gmail.com",
      birth: new Date(),
   },
   {
      username: "miguelcas",
      password: "3456",
      firstName: "Miguel",
      lastName: "Castuera",
      email: "miguel@gmail.com",
      birth: new Date(),
   }
];

function initialRender() {
   const __mainContent = new Content();
   __mainContent.render();

   const __mainNavbar = new MainNavbar();
   __mainNavbar.render();

   const __sidebar = new Sidebar();
   __sidebar.render();

   const __footer = new Footer();
   __footer.render();
}

function init() {
   window.localStorage.clear();
   const artists = initArtists(INIT_ARTISTS_DATA);
   const [songs, _] = initSingles(INIT_SONGS_DATA, artists, INIT_DESCRIPTIONS);
   const [albums, __] = initAlbums(artists, INIT_ALBUMS_DATA, INIT_ALBUMS_DESCRIPTIONS, INIT_SONGS_ALBUM_DATA);

   const users = initUsers(artists, songs, albums, INIT_USERS_DATA);

   for (const a of artists)
      a.save(); // propaga save a canciones y albumes del artista

   for (const u of users)
      u.save(); // propaga save a playlists del usuario
   
   initialRender();
}

init();