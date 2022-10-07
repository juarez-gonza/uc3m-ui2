/**
 *  @module entities.js
 *  @requires ./storage.js
 */

/** @typedef {string} UserId */
class User extends Rec {
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
        super(username);
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
        return new User(super.findRec(userId));
    }

    remove() {
        for (const playlistId of this.playlists)
            removeLS(playlistId);
        removeLS(this._id);
    }
};

/** @typedef {string} ArtistId */
class Artist extends Rec {
   /** @type {string} */
   name;
   /** @type {SongId[]} */
   songs;
   /** @type {AlbumId[]} */
   albums;

   /**
    * 
    * @param {string} name 
    * @param {SongId[]} [songs=[]]
    * @param {AlbumId[]} [albums=[]]
    */
    constructor(name, songs=[], albums=[]) {
        super(name);
        this.name = name;
        this.songs = songs;
        this.albums = albums;
    }

    /**
    * 
    * @param {SongId} songId 
    * @return {Artist}
    */
    _addSingle(songId) {
        if (this.songs.some(s => s === songId))
            throw new RepetitionError(`Song ${songId} already exists for artist ${this._id}`);
        this.songs.unshift(songId);
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
        this._addSingle(newSong._id);
        return newSong;
    }

    /**
     * 
     * 
     * @param {AlbumId} albumId
     * @return {Artist}
     */
    _addAlbum(albumId) {
        if (this.albums.some(a => a === albumId))
            throw new RepetitionError(`Album ${albumId} already exists for artist ${this._id}`);
        this.albums.unshift(albumId);
        return this;
    }

    /**
     * Añade un album a un artista (un album contiene una lista de canciones)
     * 
     * @param {string} title 
     * @param {SongId[]} songs 
     * @param {string} coverPath 
     * @return {Album}
     */
    addAlbum(title, songs, coverPath) {
        const newAlbum = new Album(title, this._id, songs, coverPath);
        this._addAlbum(newAlbum._id);
        return newAlbum;
    }

    /**
     * 
     * @param {string} artistId
     * @return {Artist}
     */
    static find(artistId) {
        const rec = super.findRec(artistId);
        const name = rec.name;
        const songs = rec.songs;
        const albums = rec.albums;
        return new Artist(name, songs, albums);
    }

    remove() {
        for (const albumId of this.albums)
            Album.find(albumId).remove();
        for (const songId of this.songs)
            removeLS(songId);
        removeLS(this._id);
    }
};

/** @typedef {string} AlbumId */
class Album extends Rec {
    /**  @type {string} */
    title;
    /**  @type {ArtistId} */
    artist;
    /**  @type {SongId[]} */
    songs;
    /**  @type {string} */
    coverPath;

    /**
     * 
     * @param {string} title 
     * @param {ArtistId} artist 
     * @param {SongId[]} songs 
     * @param {string} coverPath
     */
    constructor(title, artist, songs, coverPath) {
        super(`${title}.${artist}`);
        this.title = title;
        this.artist = artist;
        this.songs = songs;
        this.coverPath = coverPath;
    }

    /**
     * 
     * @param {string} albumId
     * @return {Album}
     */
    static find(albumId) {
        const rec = super.findRec(albumId)
        /** @type {string} */
        const title = rec.title;
        /** @type {ArtistId} */
        const artist = rec.artist;
        /** @type {SongId[]} */
        const songs = rec.songs || [];
        /** @type {string} */
        const coverPath = rec.coverPath;
        return new Album(title, artist, songs, coverPath);
    }

    remove() {
        for (const songId of this.songs)
            removeLS(songId);
        removeLS(this._id);
    }
};

/** @typedef {string} SongId */
class Song extends Rec {
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
        super(`${title}.${artist}${album || ""}`);
        this.title = title;
        this.artist = artist;
        this.songPath = songPath;
        this.album = album;
        this.coverPath = coverPath;
    }

    /**
     * 
     * @param {SongId} songId 
     * @return {Song}
     */
    static find(songId) {
        const rec = super.findRec(songId);
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

    remove() {
        removeLS(this._id);
    }
};

/** @typedef {string} PlaylistId */
class Playlist extends Rec {
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
        super(`${name}.${author}`);
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
        const rec = super.findRec(playlistId);
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
}