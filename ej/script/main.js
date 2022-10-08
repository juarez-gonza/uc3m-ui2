/**
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
 * @param {Object[]} songData
 * @return {[Song[], Artist[]]}
 */
function initSingles(artists, songData) {
   /** @type {Song[]} */
   const songs = songData.map((v, i) => {
      const artist = artists[i % artists.length];
      const title = `${i}.${artist.name}`
      const song = artist.addSingle(title, v.songPath, "./images/15.jpeg"); // todos los singles creados aquí tienen de imagen 15.jpeg
      return song;
   });

   return [songs, artists];
}

/**
 * 
 * @param {Artist[]} artists
 * @param {Object[]} albumData
 * @return {[Album[], Artist[]]}
 */
function initAlbums(artists, albumData) {
   /** @type {Album[]} */
   const albums = albumData.map((v, i) => {
      const artist = artists[i % artists.length];
      const albumTitle = v.title;
      const coverPath = v.coverPath;

      const songs = iota(5).map(j => {
         const songTitle = `${i}.${albumTitle}.${artist.name}`
         const songPath = `./audios/${(i*j) % 15 + 1}.mp4`;
         const newSong = new Song(songTitle, artist._id, songPath);
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
         user.addRecentSong(song);
      }

      // añadir 7 artistas favoritos por usuario
      for (const j of iota(7))
         user.addRecentArtist(artists[(j + i) % artists.length]);

      return user;
   });

   // que los usuarios se sigan mutuamente
   for (const u1 of users)
      for (const u2 of users)
         if (u1._id !== u2._id)
            u1.followUser(u2._id)
   return users;
}

// generar 2 artistas
const INIT_ARTISTS_DATA = [
   {name: "A-Artist"},
   {name: "B-Artist"}
];

// generar 20 canciones a dividir entre los artistas
const INIT_SONGS_DATA = iota(20).map(i => ({songPath: `./audios/${(i%15) + 1}.mp3`}));

// generar 5 albumes para cada artista
const INIT_ALBUMS_DATA = iota(10).map(i => ({
   coverPath: `./images/${(i % 15) + 1}.${i === 4 ? "webp" : "jpeg"}`,
   title: `${intToChar(i)}`
}));

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
      username: "Fulanito",
      password: "Fulanito123",
      firstName: "Fulano",
      lastName: "Mengano",
      email: "fulanito@gmail.com",
      birth: new Date(),
   }
];

function init() {
   window.localStorage.clear();
   const artists = initArtists(INIT_ARTISTS_DATA);
   const [songs, _] = initSingles(artists, INIT_SONGS_DATA);
   const [albums, __] = initAlbums(artists, INIT_ALBUMS_DATA);

   const users = initUsers(artists, songs, albums, INIT_USERS_DATA);

   for (const a of artists)
      a.save(); // propaga save a canciones y albumes del artista

   for (const u of users)
      u.save(); // propaga save a playlists del usuario
}

init();