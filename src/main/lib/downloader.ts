import * as DataBase from "../lib/database";
import { downloadWithRetry } from "./proxy"
import type { T_ALBUM, T_SONG, T_THUMBNAIL } from "../types";
import { MusicIPC } from "../ipc/music";

export default class Downloader {
  static async getAlbumThumbnails(album: T_ALBUM): Promise<T_ALBUM> {
    const DB_Thumbnails = DataBase.getThumbnails(album.albumId)

    if (!DB_Thumbnails) {
      const thumbnails = album.thumbnails;

      const LowThumb_URL = thumbnails[0].url;
      const HighThumb_URL = thumbnails[thumbnails.length - 1].url;

      const LowThumb_B64 = (await downloadWithRetry(LowThumb_URL));
      const HighThumb_B64 = (await downloadWithRetry(HighThumb_URL));

      const LowThumb_URL_B64 = LowThumb_B64 ? LowThumb_B64 : thumbnails[0].url;
      const HighThumb_URL_B64 = HighThumb_B64 ? HighThumb_B64 : thumbnails[3].url;

      DataBase.insertThumbnail(
        album.albumId, 
        LowThumb_B64 || "", 
        HighThumb_B64 || "",
        thumbnails[0].url || ""
      );

      album.thumbnails[0].url = LowThumb_URL_B64;
      album.thumbnails[3].url = HighThumb_URL_B64;
    } else {
      album.thumbnails[0].url = DB_Thumbnails.low_thumb;
      album.thumbnails[3].url = DB_Thumbnails.high_thumb;
    }

    return album;
  }

  static async getSongThumbnails(song: T_SONG): Promise<T_SONG> {
    const albumId = song.album?.albumId || ""
    const DB_Thumbnails = DataBase.getThumbnails(albumId);
    
    if (!DB_Thumbnails) {
      const thumbnails = (await MusicIPC.getAlbumFromId(albumId)).thumbnails;

      const LowThumb_URL = thumbnails[0].url;
      const HighThumb_URL = thumbnails[thumbnails.length - 1].url;

      const LowThumb_B64 = (await downloadWithRetry(LowThumb_URL));
      const HighThumb_B64 = (await downloadWithRetry(HighThumb_URL));

      const LowThumb_URL_B64 = LowThumb_B64 ? LowThumb_B64 : thumbnails[0].url;
      const HighThumb_URL_B64 = HighThumb_B64 ? HighThumb_B64 : thumbnails[3].url;

      DataBase.insertThumbnail(
        albumId, 
        LowThumb_B64 || "", 
        HighThumb_B64 || "",
        thumbnails[0].url || ""
      );

      song.thumbnails[0].url = LowThumb_URL_B64;
      song.thumbnails[1].url = HighThumb_URL_B64;
      song.thumbnails[2] = { width: 60, height: 60, url: thumbnails[0].url };
    } else {
      song.thumbnails[0].url = DB_Thumbnails.low_thumb;
      song.thumbnails[1].url = DB_Thumbnails.high_thumb;
      song.thumbnails[2] = { width: 60, height: 60, url: DB_Thumbnails.rpc_thumb };
    }

    return song;
  }

  static async getAlbumThumbnailsFromId(albumId: string): Promise<T_THUMBNAIL[]> {
    const DB_Thumbnails = DataBase.getThumbnails(albumId);
    
    const thumbs: T_THUMBNAIL[] = []

    if (!DB_Thumbnails) {
      const thumbnails = (await MusicIPC.getAlbumFromId(albumId)).thumbnails;

      const LowThumb_URL = thumbnails[0].url;
      const HighThumb_URL = thumbnails[thumbnails.length - 1].url;

      const LowThumb_B64 = (await downloadWithRetry(LowThumb_URL));
      const HighThumb_B64 = (await downloadWithRetry(HighThumb_URL));

      const LowThumb_URL_B64 = LowThumb_B64 ? LowThumb_B64 : thumbnails[0].url;
      const HighThumb_URL_B64 = HighThumb_B64 ? HighThumb_B64 : thumbnails[3].url;

      DataBase.insertThumbnail(
        albumId, 
        LowThumb_B64 || "", 
        HighThumb_B64 || "",
        thumbnails[0].url || ""
      );

      thumbs[0] = { width: 60, height: 60, url: LowThumb_URL_B64 };
      thumbs[1] = { width: 522, height: 522, url: HighThumb_URL_B64 };
      thumbs[2] = { width: 60, height: 60, url: thumbnails[0].url };
    } else {
      thumbs[0] = { width: 60, height: 60, url: DB_Thumbnails.low_thumb };
      thumbs[1] = { width: 522, height: 522, url: DB_Thumbnails.high_thumb };
      thumbs[2] = { width: 60, height: 60, url: DB_Thumbnails.rpc_thumb };
    }

    return thumbs;
  }
}