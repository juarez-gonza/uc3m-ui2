/**
 *  @module entities.js
 *  @requires ./storage.js
 */

/**
 * @param {...string} args;
 * @return {string}
 */
function genId(...args) {
    return foldl((acc, str) => acc.concat(str), args, "");
}

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
    /** @type {Playlist[]} */
    playlists;
    /** @type {Song[]} */
    favSongs;
    /** @type {Artist[]} */
    recentArtists;
    /** @type {Song[]} */
    recentSongs;

    /**
    * 
    * @param {Object} user
    */
    constructor({username, password, firstName, lastName, email, birth,
        profilePicB64=undefined, following=[], playlists=[],
        favSongs=[], recentArtists=[], recentSongs=[]}) {
        this._id = User.genUserId(username);
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.birth = birth;
        this.profilePicB64 = profilePicB64;
        this.following = following;
        this.playlists = playlists;
        this.favSongs = favSongs;
        this.recentSongs = recentSongs;
        this.recentArtists = recentArtists;
    }

    /**
     * 
     * @param {Playlist} playlist 
     * @return {Playlist}
     */
    _addPlaylist(playlist) {
        if (this.playlists.some(p => p._id === playlist._id))
            throw new RepetitionError(`Playlist ${playlist._id} already exists for user ${this._id}`);
        this.playlists.unshift(playlist);
        return playlist
    }

    /**
     * 
     * @param {string} name 
     * @param {Song[]} songs 
     * @return {Playlist}
     */
    addPlaylist(name, songs) {
        return this._addPlaylist(new Playlist(name, this._id, songs));
    }

   /**
    * @param {Artist} artist
    * @return {User}
    */
    addRecentArtist(artist) {
        this.recentArtists.push(artist);
        return this;
    }

   /**
    * @param {Song} song
    * @return {User}
    */
    addRecentSong(song) {
        this.recentSongs.push(song);
        return this;
    }

   /**
    * @param {Song} song
    * @return {User}
    */
    addFavSong(song) {
        this.favSongs.push(song);
        return this;
    }

    /**
     * 
     * @param {Song} song 
     * @return {User}
     */
    removeFavSong(song) {
        [this.favSongs,] = removeFirstWhere(this.favSongs, s => s._id === song._id);
        return this;
    }

    /**
     * 
     * @param {UserId} userId 
     */
    followUser(userId) {
        this.following.push(userId);
    }

   /**
    * 
    * @param {string} userId 
    * @return {User}
    */
    static find(userId) {
        const rec = findRec(userId);
        return new User({
            username: rec.username,
            password: rec.password,
            firstName: rec.firstName,
            lastName: rec.lastName,
            email: rec.email,
            birth: rec.birth,
            profilePicB64: rec.profilePicB64 || undefined,
            following: rec.following,
            playlists: rec.playlists.map(findInstanceFromId(Playlist)),
            favSongs: rec.favSongs.map(findInstanceFromId(Song)),
            recentSongs: rec.recentSongs.map(findInstanceFromId(Song)),
            recentArtists: rec.recentArtists.map(findInstanceFromId(Artist)),
        });
    }

    /**
     * @return {User}
     */
    save() {
        for (const p of this.playlists)
            p.save();
        const rec = {...this,
            playlists: this.playlists.map(p => p._id),
            favSongs: this.favSongs.map(s => s._id),
            recentSongs: this.recentSongs.map(s => s._id),
            recentArtists: this.recentArtists.map(a => a._id)
        };
        saveRec(this._id, rec);
        return this;
    }

    remove() {
        for (const p of this.playlists)
            p.remove();
        removeLS(this._id);
    }

    /**
     * @param {string} username 
     * @return {string}
     */
    static genUserId(username) {
        return genId("User-", username);
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
    /** @type {string} */
    coverPath;
    /** @type {string} */
    description;

    /**
     * 
     * @param {string} title 
     * @param {ArtistId} artist 
     * @param {string} songPath
     * @param {string} description
     * @param {AlbumId | undefined} [album=undefined]
     * @param {string} [coverPath=""]
     */
    constructor(title, artist, songPath, description, album=undefined, coverPath="") {
        this._id = `Song-${title}.${artist}${album || ""}`;
        this.title = title;
        this.artist = artist;
        this.songPath = songPath;
        this.description = description;
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
        /** @type {string} */
        const description = rec.description;
        /** @type {AlbumId} */
        const album = rec.album || undefined;
        /** @type {string} */
        const coverPath = rec.coverPath || "";
        return new Song(title, artist, songPath, description, album, coverPath);
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
        this._id = `Album-${title}.${artist}`;
        this.title = title;
        this.artist = artist;
        this.songs = songs;
        songs.forEach(s => s.album = this._id);
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
        const songs = rec.songs.map(findInstanceFromId(Song))

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
        this._id = `Artist-${name}`;
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
     * @param {string} description
     * @param {string} coverPath
     * @return {Song}
     */
    addSingle(title, songPath, description, coverPath) {
        const newSong = new Song(title, this._id, songPath, description, undefined, coverPath);
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
        const songs = rec.songs.map(findInstanceFromId(Song));

        /** @type {Album[]} */
        const albums = rec.albums.map(findInstanceFromId(Album));

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
    /**  @type {Song[]} */
    songs;

    /**
     * 
     * @param {string} name 
     * @param {UserId} author 
     * @param {Song[]} [songs=[]]
     */
    constructor(name, author, songs=[]) {
        this._id = `Playlist-${name}.${author}`;
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
        /** @type {Song[]} */
        const songs = rec.songs.map(findInstanceFromId(Song));
        /** @type {UserId} */
        const author = rec.author || [];
        return new Playlist(name, author, songs);
    }

    save() {
        const rec = {...this, songs: this.songs.map(s => s._id)};
        saveRec(this._id, rec);
    }

    remove() {
        removeLS(this._id);
    }
};

/**
 * 
 * @template T
 * @template U
 * @param {{find: (id: U) => T}} C - Tipo que tiene una función find, la cual toma un parametro id de tipo U y retorna una instancia de tipo T
 * @return {function(U): T}
 */
function findInstanceFromId(C) {
    return id => C.find(id);
}

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
