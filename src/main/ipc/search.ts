import { ipcMain } from "electron";
import { Innertube, UniversalCache } from "youtubei.js";
import YTMusic from "ytmusic-api";
import { mainWindow } from "../window/mainWindow";
import Downloader from "../lib/downloader";
import * as DataBase from "../lib/database"
import { T_SONG } from "../types";

export default class SearchAPI {
  private static API: YTMusic = new YTMusic();
  private static INNERTUBE: Innertube | null = null;
  private static API_LOADED: boolean = false;

  // Load YouTube Music API
  static async LoadAPI(): Promise<void> {
    if (!this.API_LOADED) {
      await this.API.initialize();
      this.INNERTUBE = await Innertube.create({ cache: new UniversalCache(true) });
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
      ArtistAlbums[AlbumIndex] = await Downloader.getAlbumThumbnails(album);
      AlbumIndex++;
    }

    let SongIndex = 0;
    const ParsedSongs: { data: T_SONG, extra: unknown }[] = []

    for (const song of FirstSongs) {
      FirstSongs[SongIndex] = await Downloader.getSongThumbnails(song);

      const DB_DATA = DataBase.getSong(song.videoId);

      const extra = {
        liked: Boolean(DB_DATA?.liked || 0)
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
    const Album = (await this.API.getAlbum(albumId));
    const AlbumSongs = Album.songs;
    const AlbumThumbnails = await Downloader.getAlbumThumbnailsFromId(albumId);

    let SongIndex = 0
    const ParsedSongs: { data: T_SONG, extra: unknown }[] = []

    for (const song of AlbumSongs) {
      AlbumSongs[SongIndex] = await Downloader.getSongThumbnails(song);

      const DB_DATA = DataBase.getSong(song.videoId);

      const extra = {
        liked: Boolean(DB_DATA?.liked || 0)
      }

      ParsedSongs[SongIndex] = { data: AlbumSongs[SongIndex], extra }
      SongIndex++;
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