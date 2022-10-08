/**
 *  @module entities.js
 *  @requires ./storage.js
 */

/** @typedef {string} UserId */
class User {
    /** @type {UserId} */
    _id;
    /** @type {string} */
    username;
    /** @type {string} */
    password;
    /** @type {string} */
    firstName;
    /** @type {string} */
    lastName;
    /** @type {string} */
    email;
    /** @type {Date} */
    birth;
    /** @type {string | undefined} */
    profilePicB64;
    /** @type {UserId[]} */
    following;
    /** @type {UserId[]} */
    followers;
    /** @type {PlaylistId[]} */
    playlists;
    /** @type {SongId[]} */
    favSongs;
    /** @type {ArtistId[]} */
    recentArtists;
    /** @type {SongId[]} */
    recentSongs;

    /**
    * 
    * @param {Object} user
    */
    constructor({username, password, firstName, lastName, email, birth,
        profilePicB64=undefined, following=[], followers=[],
        playlists=[], favSongs=[], recentArtists=[], recentSongs=[]}) {
        this._id = username;
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.birth = birth;
        this.profilePicB64 = profilePicB64;
        this.following = following;
        this.followers = followers;
        this.playlists = playlists;
        this.favSongs = favSongs;
        this.recentSongs = recentSongs;
        this.recentArtists = recentArtists;
    }

   /**
    * @param {ArtistId} artistId
    * @return {User}
    */
    addRecentArtist(artistId) {
        this.recentArtists.push(artistId);
        return this;
    }

   /**
    * @param {SongId} songId
    * @return {User}
    */
    addRecentSong(songId) {
        this.recentSongs.push(songId);
        return this;
    }

   /**
    * @param {SongId} songId
    * @return {User}
    */
    addFavSong(songId) {
        this.favSongs.push(songId);
        return this;
    }

   /**
    * 
    * @param {string} userId 
    * @return {User}
    */
    static find(userId) {
        return new User(findRec(userId));
    }

    remove() {
        for (const playlistId of this.playlists)
            removeLS(playlistId);
        removeLS(this._id);
    }
};

/** @typedef {string} SongId */
class Song {
    /** @type {SongId} */
    _id;
    /**  @type {string} */
    title;
    /**  @type {ArtistId} */
    artist;
    /**  @type {AlbumId | undefined} */
    album;

    /**
     * 
     * @param {string} title 
     * @param {ArtistId} artist 
     * @param {string} songPath
     * @param {AlbumId | undefined} [album=undefined]
     * @param {string} [coverPath=""]
     */
    constructor(title, artist, songPath, album=undefined, coverPath="") {
        this._id = `${title}.${artist}${album || ""}`;
        this.title = title;
        this.artist = artist;
        this.songPath = songPath;
        this.album = album;
        this.coverPath = coverPath;
    }

    /**
     * 
     * @return {Song}
     */
    save() {
        saveRec(this._id, {...this});
        return this;
    }

    remove() {
        removeLS(this._id);
    }

    /**
     * 
     * @param {SongId} songId 
     * @return {Song}
     */
    static find(songId) {
        const rec = findRec(songId);
        /** @type {string} */
        const title = rec.title;
        /** @type {ArtistId} */
        const artist = rec.artist;
        /** @type {string} */
        const songPath = rec.songPath;
        /** @type {AlbumId} */
        const album = rec.album || undefined;
        /** @type {string} */
        const coverPath = rec.coverPath || "";
        return new Song(title, artist, songPath, album, coverPath);
    }
};

/** @typedef {string} AlbumId */
class Album {
    /** @type {AlbumId} */
    _id;
    /**  @type {string} */
    title;
    /**  @type {ArtistId} */
    artist;
    /**  @type {Song[]} */
    songs;
    /**  @type {string} */
    coverPath;

    /**
     * 
     * @param {string} title 
     * @param {ArtistId} artist 
     * @param {Song[]} songs 
     * @param {string} coverPath
     */
    constructor(title, artist, songs, coverPath) {
        this._id = `${title}.${artist}`;
        this.title = title;
        this.artist = artist;
        this.songs = songs;
        this.coverPath = coverPath;
    }

    /**
     * 
     * @return {Album}
     */
    save() {
        // guardar unicamente los ids en el record de Album (las canciones se guardan como records por separado)
        for (const s of this.songs)
            s.save();
        const rec = {...this, songs: this.songs.map(s => s._id)};
        saveRec(this._id, rec);
        return this;
    }

    remove() {
        for (const s of this.songs)
            s.remove();
        removeLS(this._id);
    }
    /**
     * 
     * @param {string} albumId
     * @return {Album}
     */
    static find(albumId) {
        const rec = findRec(albumId)
        /** @type {string} */
        const title = rec.title;
        /** @type {ArtistId} */
        const artist = rec.artist;

        /** @type {Song[]} */
        const songs = rec.songs.length !== 0 ? // restaurar instancias de Song a partir de los SongId guardados
                        rec.songs.map((/** @type {SongId} */ songId) => Song.find(songId))
                        : [];

        /** @type {string} */
        const coverPath = rec.coverPath;
        return new Album(title, artist, songs, coverPath);
    }
};

/** @typedef {string} ArtistId */
class Artist {
    /** @type {ArtistId} */
    _id;
    /** @type {string} */
    name;
    /** @type {Song[]} */
    songs;
    /** @type {Album[]} */
    albums;

    /**
     * 
     * @param {string} name 
     * @param {Song[]} [songs=[]]
     * @param {Album[]} [albums=[]]
     */
    constructor(name, songs=[], albums=[]) {
        this._id = name;
        this.name = name;
        this.songs = songs;
        this.albums = albums;
    }
    /**
    * 
    * @param {Song} song 
    * @return {Artist}
    */
    _addSingle(song) {
        if (this.songs.some(s => s._id === song._id))
            throw new RepetitionError(`Song ${song} already exists for artist ${this._id}`);
        this.songs.unshift(song);
        return this;
    }
    /**
     * Añade un single a un artista (un single es una canción sin album correspondiente)
     *  
     * @param {string} title 
     * @param {string} songPath
     * @param {string} coverPath
     * @return {Song}
     */
    addSingle(title, songPath, coverPath) {
        const newSong = new Song(title, this._id, songPath, undefined, coverPath);
        this._addSingle(newSong);
        return newSong;
    }
    /**
     * 
     * 
     * @param {Album} album
     * @return {Album}
     */
    _addAlbum(album) {
        if (this.albums.some(a => a._id === album._id))
            throw new RepetitionError(`Album ${album._id} already exists for artist ${this._id}`);
        this.albums.unshift(album);
        return album;
    }
    /**
     * Añade un album a un artista (un album contiene una lista de canciones)
     * 
     * @param {string} title 
     * @param {Song[]} songs 
     * @param {string} coverPath 
     * @return {Album}
     */
    addAlbum(title, songs, coverPath) {
        return this._addAlbum(new Album(title, this._id, songs, coverPath));
    }
    /**
     * 
     * @param {Album} album 
     */
    removeAlbum(album) {
        [this.albums, album] = removeFirstWhere(this.albums, a => a._id == album._id);
        album.remove();
    }

    remove() {
        for (const a of this.albums)
            a.remove();
        for (const s of this.songs)
            s.remove();
        removeLS(this._id);
    }

    /**
     * 
     * @return  {Artist}
     */
    save() {
        for (const a of this.albums) {
            a.save();
        }
        for (const s of this.songs)
            s.save();
        // guardar solo Ids de Song[] y Album[]
        const rec = {...this, songs: this.songs.map(s => s._id), albums: this.albums.map(a => a._id)};
        saveRec(this._id, rec);
        return this;
    }

    /**
     * 
     * @param {string} artistId
     * @return {Artist}
     */
    static find(artistId) {
        const rec = findRec(artistId);
        const name = rec.name;
        /** @type {Song[]} */
        const songs = rec.songs.length !== 0 ? // restaurar instancias de Song a partir de los SongId guardados
                        rec.songs.map((/** @type {SongId} */ songId) => Song.find(songId))
                        : [];

        /** @type {Album[]} */
        const albums = rec.albums.length !== 0 ? // restaurar instancias de Album a partir de los AlbumId guardados
                        rec.albums.map((/** @type {AlbumId} */ songId) => Album.find(songId))
                        : [];

        return new Artist(name, songs, albums);
    }
};

/** @typedef {string} PlaylistId */
class Playlist {
    /** @type {PlaylistId} */
    _id;
    /**  @type {string} */
    name;
    /**  @type {UserId} */
    author;
    /**  @type {SongId[]} */
    songs;

    /**
     * 
     * @param {string} name 
     * @param {UserId} author 
     * @param {SongId[]} [songs=[]]
     */
    constructor(name, author, songs=[]) {
        this._id = `${name}.${author}`;
        this.name = name;
        this.author = author;
        this.songs = songs;
    }

    /**
     * 
     * @param {PlaylistId} playlistId 
     * @return {Playlist}
     */
    static find(playlistId) {
        const rec = findRec(playlistId);
        /** @type {string} */
        const name = rec.name;
        /** @type {SongId[]} */
        const songs = rec.songs;
        /** @type {UserId} */
        const author = rec.author || [];
        return new Playlist(name, author, songs);
    }
};

class ConstructorError extends Error {
    /**
     * 
     * @param {string} message 
     */
    constructor(message) {
        super(message);
        this.name = "ConstructorError";
    }
};

class RepetitionError extends Error {
    /**
     * 
     * @param {string} message 
     */
    constructor(message) {
        super(message);
        this.name = "RepetitionError";
    }
};