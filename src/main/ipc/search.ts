import { ipcMain } from "electron";
import YTMusic from "ytmusic-api";
import { mainWindow } from "../window/mainWindow";
import Downloader from "../lib/downloader";
import * as DataBase from "../lib/database"
import { T_SONG } from "../types";

export default class SearchAPI {
  private static API: YTMusic = new YTMusic();
  private static API_LOADED: boolean = false;

  // Load YouTube Music API
  static async LoadAPI(): Promise<void> {
    if (!this.API_LOADED) {
      await this.API.initialize();
      this.API_LOADED = true;
    }
  }

  static async getGlobalSearch(query: string): Promise<void> {
    await this.LoadAPI();

    const QueryArtist = (await this.API.searchArtists(query))
    const FirstArtist = QueryArtist[0];
    const RelatedArtist = QueryArtist
      .filter((a) => !a.name.toLocaleLowerCase().includes(FirstArtist.name.toLocaleLowerCase()))
      .slice(0, 5);
    
    const ArtistSongs = (await this.API.searchSongs(query));
    const FirstSongs = ArtistSongs.slice(0, 4);

    const ArtistAlbums = (await this.API.searchAlbums(query)).slice(0, 5);

    let AlbumIndex = 0;
    for (const album of ArtistAlbums) {
      ArtistAlbums[AlbumIndex] = (await Downloader.getAlbumThumbnails(album));
      AlbumIndex++;
    }

    let SongIndex = 0;
    const ParsedSongs: { data: T_SONG, extra: unknown }[] = []

    for (const song of FirstSongs) {
      FirstSongs[SongIndex] = await Downloader.getSongThumbnails(song);

      const DB_DATA = DataBase.getSong(song.videoId);

      const extra = {
        liked: Boolean(DB_DATA?.liked)
      }

      ParsedSongs[SongIndex] = { data: FirstSongs[SongIndex], extra }
      SongIndex++;
    }
  
    const QueryResponse = { 
      FirstArtist,
      RelatedArtist,
      FirstSongs: ParsedSongs,
      ArtistAlbums
    }

    mainWindow.webContents.send("vybesync:event", {
      type: "setGlobalSearch",
      payload: QueryResponse,
    });
  }

  static async getAlbumSearch(albumId: string): Promise<void> {
    const savedAlbum = DataBase.getAlbum(albumId);

    const Album = (await this.API.getAlbum(albumId));
    const AlbumThumbnails = (await Downloader.getAlbumThumbnailsFromId(albumId));

    const ParsedSongs: { data: T_SONG, extra: unknown }[] = [];

    if(savedAlbum) {
      const AlbumSongs = JSON.parse(savedAlbum.songs_ids);

      for (const song of AlbumSongs) {
        const DB_DATA = DataBase.getSong(song)
        const extra = {
          liked: Boolean(DB_DATA?.liked)
        };

        ParsedSongs.push({ 
          data: {
            type: "SONG",
            name: DB_DATA?.song_name || "",
            videoId: DB_DATA?.video_id || "",
            album: { albumId: Album.albumId, name: Album.name },
            artist: { artistId: Album.artist.artistId, name: Album.artist.name },
            thumbnails: AlbumThumbnails,
            duration: DB_DATA?.duration || 0
          }, 
          extra
        });
      }
    } else {
      const AlbumSongs = Album.songs;
      const SongsQuery = await Promise.all(
        AlbumSongs.map(async (song) => {
          const query = `${song.name} ${song.album?.name ?? ""} ${song.artist.name}`;
          const results = await this.API.searchSongs(query);

          return results.find((s) => {
            const q1 = `${s.name} ${s.album?.name ?? ""} ${s.artist.name}`.toLowerCase().trim();
            const q2 = `${song.name} ${song.album?.name ?? ""} ${song.artist.name}`.toLowerCase().trim();
            return q1 === q2;
          }) ?? song;
        })
      );

      let SongIndex = 0;

      for (const song of AlbumSongs) {
        AlbumSongs[SongIndex].thumbnails = AlbumThumbnails;
        AlbumSongs[SongIndex].videoId = SongsQuery[SongIndex].videoId;

        const DB_DATA = DataBase.getSong(song.videoId);

        const extra = {
          liked: Boolean(DB_DATA?.liked)
        };

        ParsedSongs[SongIndex] = { data: AlbumSongs[SongIndex], extra };

        DataBase.insertSong(
          AlbumSongs[SongIndex].videoId,
          AlbumSongs[SongIndex].name,
          AlbumSongs[SongIndex].album?.albumId || "",
          AlbumSongs[SongIndex].duration || 0,
          extra.liked ? 1 : 0,
          0
        )
        SongIndex++;
      }

      const totalDuration = AlbumSongs.reduce((acc, s) => acc + (s.duration || 0), 0);
      await DataBase.insertAlbum(
        albumId,
        JSON.stringify(AlbumSongs.map(s => s.videoId)),
        Album.name,
        Album.artist.artistId || "",
        totalDuration,
      );
    }


    const QueryResponse = { 
      AlbumID: albumId,
      AlbumSongs: ParsedSongs,
      AlbumThumbnails,
      AlbumArtist: Album.artist,
      AlbumYear: Album.year,
      AlbumName: Album.name,
      AlbumRaw: Album
    }

    mainWindow.webContents.send("vybesync:event", {
      type: "setAlbumSearch",
      payload: QueryResponse,
    });
  }
}

ipcMain.handle("search:getGlobalSearch", (_, data) => SearchAPI.getGlobalSearch(data));
ipcMain.handle("search:getAlbumSearch", (_, data) => SearchAPI.getAlbumSearch(data));