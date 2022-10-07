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
    static findUser(userId) {
        return new User(super.findRec(userId));
    }
};

/** @typedef {string} ArtistId */
class Artist extends Rec {
   /** @type {ArtistId} */
   _id;
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
    addSingle(songId) {
        this.songs.unshift(songId);
        return this;
    }

    /**
     * 
     * @param {AlbumId} albumId
     * @return {Artist}
     */
    addAlbum(albumId) {
        this.albums.unshift(albumId);
        return this;
    }

    /**
     * 
     * @param {string} artistId
     * @return {Artist}
     */
    static findArtist(artistId) {
        const rec = super.findRec(artistId);
        const name = rec.name;
        const songs = rec.songs;
        const albums = rec.albums;
        return new Artist(name, songs, albums);
    }
};

/** @typedef {string} AlbumId */
class Album extends Rec {
    /**  @type {AlbumId} */
    _id;
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
    static findAlbum(albumId) {
        const rec = super.findRec(albumId)
        const title = rec.title;
        const artist = rec.artist;
        const songs = rec.songs;
        const coverPath = rec.coverPath;
        return new Album(title, artist, songs, coverPath);
    }
};

/** @typedef {string} SongId */
class Song extends Rec {
    /**  @type {SongId} */
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
     * @param {AlbumId | undefined} [album=undefined]
     */
    constructor(title, artist, album=undefined) {
        super(`${title}.${artist}`);
        this.title = title;
        this.artist = artist;
        this.album = album;
    }

    static findSong(songId) {
        const rec = super.findRec(songId);
        const title = rec.title;
        const artist = rec.artist;
        const album = rec.album || undefined;
        return new Song(title, artist, album);
    }
}

/** @typedef {string} PlaylistId */
/** @typedef {Object} Playlistx
 *  @property {PlaylistId} _id
 *  @property {SongId[]} songs
 *  @property {UserId} author
 *  @property {string} name
*/
class Playlist extends Rec {
    /**  @type {PlaylistId} */
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
        super(`${name}.${author}`);
        this.name = name;
        this.songs = songs;
        this.author = author;
    }
};