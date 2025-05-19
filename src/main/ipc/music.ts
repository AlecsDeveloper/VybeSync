import { Innertube, UniversalCache } from "youtubei.js";
import YTMusic from "ytmusic-api";
import { ipcMain } from "electron";
import { mainWindow } from "../window/mainWindow";
import { FormatOptions } from "youtubei.js/dist/src/types";


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

  static async getSourceAudio(videoId: string): Promise<void> {
    if (!this.INNERTUBE) return;

    await this.LoadAPI();

    
    const formatOptions: FormatOptions = { type: "audio", client: "WEB_EMBEDDED", }
    const res = await this.INNERTUBE.getStreamingData(videoId, formatOptions);
  
    const thumbnails = (await this.API.getSong(videoId)).thumbnails;
  
    mainWindow.webContents.send("vybesync:event", {
      type: "pushSong",
      payload: { ...res, thumbnails: thumbnails, videoId },
    });
  }
}

ipcMain.handle("music:getResults", (_, args: { query: string }) => MusicIPC.getResults(args.query));
ipcMain.handle("music:getSourceAudio", (_, args: { videoId: string }) => MusicIPC.getSourceAudio(args.videoId));


// ipcMain.handle("youtube:getAlbumResults", async (_, args: { query: string }) => {
//   await LoadAPI();

//   const albums = await ytmusic.searchAlbums(args.query);
//   const allSongs: unknown[] = [];

//   for (const album of albums) {
//     const albumDetails = await ytmusic.getAlbum(album.albumId);
//     allSongs.push(...albumDetails.songs);
//   }

//   mainWindow.webContents.send("vybesync:event", {
//     type: "setResults",
//     payload: allSongs,
//   });
// });
