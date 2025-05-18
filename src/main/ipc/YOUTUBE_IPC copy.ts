import { Innertube, UniversalCache } from "youtubei.js"
import YTMusic from "ytmusic-api";
import { ipcMain } from "electron";
import { mainWindow } from "..";

const ytmusic = new YTMusic();
let yt: Innertube;
let ytmusicLoaded = false;

async function LoadAPI(): Promise<void> {
  if (!ytmusicLoaded) {
    await ytmusic.initialize();
    yt = await Innertube.create({ cache: new UniversalCache(true) });
    ytmusicLoaded = true;
  }
}

ipcMain.handle("youtube:getResults", async (_, args: { query: string }) => {
  await LoadAPI();

  const res = await ytmusic.searchSongs(args.query);

  mainWindow.webContents.send("vybesync:event", {
    type: "setResults",
    payload: res
  });
});

ipcMain.handle("youtube:getSource", async (_, args: { videoId: string }) => {
  await LoadAPI();

  const res = await yt.getStreamingData(args.videoId, {
    type: "audio", client: "WEB_EMBEDDED",
  })

  mainWindow.webContents.send("vybesync:event", {
    type: "pushSong",
    payload: { ...res, videoId: args.videoId }
  });
});