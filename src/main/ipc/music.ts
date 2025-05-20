import { Innertube, UniversalCache } from "youtubei.js";
import YTMusic from "ytmusic-api";
import { ipcMain } from "electron";
import { mainWindow } from "../window/mainWindow";
import { FormatOptions } from "youtubei.js/dist/src/types";
import { Format } from "youtubei.js/dist/src/parser/misc";


export class MusicIPC {
  private static API: YTMusic = new YTMusic();
  private static INNERTUBE: Innertube | null = null;
  private static API_LOADED: boolean = false;

  static async LoadAPI(): Promise<void> {
    if (!this.API_LOADED) {
      await this.API.initialize();
      this.INNERTUBE = await Innertube.create({ cache: new UniversalCache(true) });
      this.API_LOADED = true;
    }
  }

  // YouTube Get Data Methods
  static async getResults(query: string): Promise<void>{
    await this.LoadAPI();

    const res = await this.API.searchSongs(query);

    mainWindow.webContents.send("vybesync:event", {
      type: "setResults",
      payload: res,
    });
  }

  static async getPlaylistResults(query: string): Promise<void>{
    await this.LoadAPI();

    const res = await this.API.searchSongs(query);

    mainWindow.webContents.send("music:playlistSearchResults", res);
  }

  static async getSourceAudio(videoId: string, send: boolean = true): Promise<Format | null> {
    await this.LoadAPI();

    if (!this.INNERTUBE) return null;

    const formatOptions: FormatOptions = { type: "audio", client: "WEB_EMBEDDED", }
    const res = await this.INNERTUBE.getStreamingData(videoId, formatOptions);

    if (send) {
      const thumbnails = (await this.API.getSong(videoId)).thumbnails;

      mainWindow.webContents.send("vybesync:event", {
        type: "pushSong",
        payload: { ...res, thumbnails: thumbnails, videoId },
      });
    }

    return res;
  }
}

ipcMain.handle('music:getPlaylistResults', (_, args: { query: string }) => MusicIPC.getPlaylistResults(args.query));
ipcMain.handle("music:getResults", (_, args: { query: string }) => MusicIPC.getResults(args.query));
ipcMain.handle("music:getSourceAudio", (_, args: { videoId: string }) => MusicIPC.getSourceAudio(args.videoId));
