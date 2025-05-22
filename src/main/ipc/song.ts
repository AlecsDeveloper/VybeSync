import { ipcMain } from "electron";
import * as DataBase from "../lib/database";

export default class SongIPC {

  static saveSong(data: DataBase.SONGS_TABLE): void {
    if (!data) return;

    DataBase.insertSong(data.video_id, data.song_name, data.album_id, data.duration);
  }

  static deleteSong(videoId: string): void {
    if (!videoId) return;

    DataBase.deleteSong(videoId);
  }
}


ipcMain.handle("song:saveSong", (_, data) => SongIPC.saveSong(data));
ipcMain.handle("song:deleteSong", (_, data) => SongIPC.deleteSong(data));