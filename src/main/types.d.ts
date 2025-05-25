export type T_THUMBNAIL = {
  url: string;
  width: number;
  height: number;
}

export type T_ARTIST = {
  type: "ARTIST";
  artistId: string;
  name: string;
  thumbnails: T_THUMBNAIL[];
}

export type T_ALBUM = {
  type: "ALBUM";
  name: string;
  albumId: string;
  artist: T_SONG_ARTIST;
  thumbnails: T_THUMBNAIL[];
  playlistId: string;
  year: number | null;
}

export type T_FORMAT = {
  url: string;
}

// Song Types
export type T_SONG_ARTIST = {
  artistId: string | null;
  name: string;
}

export type T_SONG_ALBUM = {
  name: string;
  albumId: string;
}

export type T_SONG = {
  type: "SONG";
  name: string;
  videoId: string;
  artist: T_SONG_ARTIST;
  album: T_SONG_ALBUM | null;
  duration: number | null;
  thumbnails: T_THUMBNAIL[];
}


// Composed Querys
export type T_GLOBAL_SEARCH = {
  FirstArtist: T_ARTIST;
  RelatedArtist: T_ARTIST[];
  FirstSongs: T_SONG[];
  ArtistAlbums: T_ALBUM[];
}


// Data Base Types
export type T_DB_ALBUM = {
  albumId: string;
  albumThumbnails: T_THUMBNAIL[];
  albumBasicinfo: { 
    name: string;
    year: number | null;
    artist: T_SONG_ARTIST
  };
  albumSongs: T_DB_SONG[];
}

export type T_DB_SONG = {
  videoId: string;
  name: string;
  duration: number | null;
  albumId: string | null;
  liked: boolean
}