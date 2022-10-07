/**
 * @param {Object[]} artistData
 * @return {Artist[]}
 */
function initArtists(artistData) {
   return artistData.map(a => {
      const newArtist = new Artist(a.name)
      return newArtist.saveRec();
   });
}

/**
 * @param {Artist[]} artists
 * @param {Object[]} songData
 * @return {Song[]}
 */
function initSingles(artists, songData) {
   return songData.map((v, i) => {
      const artist = artists[i % artists.length];
      const title = `${i}.${artist.name}`
      const newSong = artist.addSingle(title, v.songPath, "./images/15.jpeg"); // todos los singles creados aquí tienen de imagen 15.jpeg
      return newSong.saveRec();
   });
}

/**
 * 
 * @param {Artist[]} artists
 * @param {Object[]} albumData
 * @return {Album[]}
 */
function initAlbums(artists, albumData) {
   return albumData.map((aData, i) => {
      const artist = artists[i % artists.length];
      const albumTitle = aData.title;
      const coverPath = aData.coverPath;

      // acumular ids de Song pero mantener referencia a instancias compeltas de Song
      // porque guardar en LocalStorage se puede hacer una vez la creación del album
      // tenga éxito.
      let songIds = [];
      const songs = iota(5).map(j => {
         const songTitle = `${i}.${albumTitle}.${artist.name}`
         const songPath = `./audios/${(i*j) % 15 + 1}.mp4`;
         const newSong = new Song(songTitle, artist._id, songPath);
         songIds.push(newSong._id);
         return newSong;
      });

      const newAlbum = artist.addAlbum(albumTitle, songIds, coverPath);

      // save songs now that album creation succeeded
      for (const s of songs)
         s.saveRec();
      newAlbum.saveRec();
      artist.saveRec();

      return newAlbum;
   });
}

/**
 * 
 * @param {Artist[]} artists 
 * @param {Song[]} songs 
 * @param {Object[]} userData
 * @return {User[]}
 */
function initUsers(artists, songs, userData) {
   return [];
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

function init() {
   window.localStorage.clear();
   const artists = initArtists(INIT_ARTISTS_DATA);
   const songs = initSingles(artists, INIT_SONGS_DATA);
   const albums = initAlbums(artists, INIT_ALBUMS_DATA);
   return initUsers(artists, songs, []);
}

init();