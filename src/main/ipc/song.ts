import { ipcMain } from "electron";
import * as DataBase from "../lib/database";

export default class SongIPC {
  static updateSong(data: Partial<DataBase.SONGS_TABLE> & { video_id: string }): void {
    if (!data?.video_id) return;

    const current = DataBase.getSong(data.video_id);

    if (!current && (!data.song_name || !data.album_id)) return;

    const liked = data.liked ?? current?.liked ?? 0;
    const saved = data.saved ?? current?.saved ?? 0;


    if (liked === 0 && saved === 0) {
      DataBase.deleteSong(data.video_id);
      return;
    }

    const updated = {
      video_id: data.video_id,
      song_name: data.song_name ?? current?.song_name ?? "",
      album_id: data.album_id ?? current?.album_id ?? "",
      duration: data.duration ?? current?.duration ?? 0,
      liked,
      saved
    };

    DataBase.insertSong(
      updated.video_id,
      updated.song_name,
      updated.album_id,
      updated.duration,
      updated.liked,
      updated.saved
    );
  }
}

ipcMain.handle("song:updateSong", (_, data) => SongIPC.updateSong(data));