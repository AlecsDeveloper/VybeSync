import * as DataBase from "../lib/database";
import { downloadWithRetry } from "../lib/proxy"
import { getAlbumsFromQuery } from "../lib/search"
import { ipcMain } from "electron"
import { mainWindow } from "../window/mainWindow";
import { MusicIPC } from "./music";

class MusicBulkIPC {
  static async getSongsFromAlbumQuery(query: string): Promise<void> {
    const albums = (await getAlbumsFromQuery(query));

    for (const album of albums) {
      const DB_Thumbnails = DataBase.getThumbnails(album.albumId)

      if (!DB_Thumbnails) {
        const thumbnails = album.albumThumbnails;

        const LowThumb_URL = thumbnails[0].url;
        const HighThumb_URL = thumbnails[thumbnails.length - 1].url;

        const LowThumb_B64 = (await downloadWithRetry(LowThumb_URL));
        const HighThumb_B64 = (await downloadWithRetry(HighThumb_URL));

        const LowThumb_URL_B64 = LowThumb_B64 ? LowThumb_B64 : thumbnails[0].url;
        const HighThumb_URL_B64 = HighThumb_B64 ? HighThumb_B64 : thumbnails[3].url;

        DataBase.insertThumbnail(album.albumId, LowThumb_B64 || "", HighThumb_B64 || "");

        album.albumThumbnails[0].url = LowThumb_URL_B64;
        album.albumThumbnails[3].url = HighThumb_URL_B64;
      } else {
        album.albumThumbnails[0].url = DB_Thumbnails.low_thumb;
        album.albumThumbnails[3].url = DB_Thumbnails.high_thumb;
      }      
    }

    mainWindow.webContents.send("vybesync:event", {
      type: "setResultsLazy",
      payload: albums,
    });
  }

  static async getSourceAudio(videoId: string, albumId: string): Promise<void> {
    const audioSource = await MusicIPC.getSourceAudio(videoId);
    const DB_Thumbnails = DataBase.getThumbnails(albumId);

    if (!audioSource) return;

    const thumbnails = DB_Thumbnails ? [
      {
        url: DB_Thumbnails.low_thumb,
        width: 60, height: 60 
      },
      {
        url: DB_Thumbnails.high_thumb,
        width: 522, height: 522 
      }
    ] : []


    mainWindow.webContents.send("vybesync:event", {
      type: "pushSong",
      payload: { ...audioSource, thumbnails, videoId },
    });
  }

}

ipcMain.handle("music_bulk:getResults", (_, args: { query: string }) => MusicBulkIPC.getSongsFromAlbumQuery(args.query));
ipcMain.handle("music_bulk:getSourceAudio", (_, args: { videoId: string, albumId: string }) => MusicBulkIPC.getSourceAudio(args.videoId, args.albumId));