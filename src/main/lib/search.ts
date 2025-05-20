import YTMusic, { AlbumDetailed, SongDetailed } from "ytmusic-api";

type T_ALBUM = {
  albumId: string;

  albumThumbnails: { 
    url: string; 
    width: number; 
    height: number;
  }[];

  albumBasicinfo: { 
    name: string;
    year: number | null;
    artist: { 
      artistId: string | null;
      name: string;
    }
  };

  albumSongs: T_SONG[];
}

type T_SONG = {
  videoId: string;
  name: string;
  duration: number | null;
  albumId: string | null;
}


async function getAlbumSongs(albumId: string, API: YTMusic): Promise<SongDetailed[]> {
  return (await API.getAlbum(albumId)).songs
}

async function parseAlbum(album: AlbumDetailed, API: YTMusic): Promise<T_ALBUM> {
  const albumSongs = (await getAlbumSongs(album.albumId, API)).map((song) => {
    return {
      videoId: song.videoId,
      name: song.name,
      duration: song.duration,
      albumId: song.album?.albumId
    }
  });

  return {
    albumId: album.albumId,
    albumThumbnails: album.thumbnails,
    albumBasicinfo: {
      name: album.name,
      artist: album.artist,
      year: album.year
    },
    albumSongs: albumSongs as T_SONG[]
  }
}

export async function getAlbumsFromQuery(query: string): Promise<T_ALBUM[]> {
  const API = new YTMusic();
  await API.initialize();

  const rawAlbums = await API.searchAlbums(query);
  const albums = await Promise.all(
    rawAlbums.map((album) => parseAlbum(album, API))
  );

  return albums;
}