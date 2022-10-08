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
   const albums = albumData.map((aData, i) => {
      const artist = artists[i % artists.length];
      const albumTitle = aData.title;
      const coverPath = aData.coverPath;

      // acumular ids de Song pero mantener referencia a instancias compeltas de Song
      // porque guardar en LocalStorage se puede hacer una vez la creación del album
      // tenga éxito.
      /** @type {SongId[]} */
      let songIds = [];
      const songs = iota(5).map(j => {
         const songTitle = `${i}.${albumTitle}.${artist.name}`
         const songPath = `./audios/${(i*j) % 15 + 1}.mp4`;
         const newSong = new Song(songTitle, artist._id, songPath);
         songIds.push(newSong._id);
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
   const a1 = initArtists(INIT_ARTISTS_DATA);
   const [songs, a2] = initSingles(a1, INIT_SONGS_DATA);
   const [albums, a3] = initAlbums(a2, INIT_ALBUMS_DATA);

   initUsers(a3, songs, albums, []);

   for (const a of a3)
      a.save(); // propaga save a canciones y albumes del artista
}

init();