import { ipcMain } from "electron";
import * as DataBase from "../lib/database";
import type { T_ALBUM, T_SONG, T_FORMAT } from "../types";
import { mainWindow } from "../window/mainWindow";
import { MusicIPC } from "./music";
import Downloader from "../lib/downloader";

export default class SongIPC {
  static NSSC: Map<string, T_SONG> = new Map();
  static SAC: Map<string, T_FORMAT> = new Map();
  static ADC: Map<string, T_ALBUM> = new Map();

  static updateSong(data: Partial<DataBase.SONGS_TABLE> & { video_id: string }): void {
    if (!data?.video_id) return;

    const current = DataBase.getSong(data.video_id);

    if (!current && (!data.song_name || !data.album_id)) return;

    const liked = data.liked ?? current?.liked ?? 0;
    const saved = data.saved ?? current?.saved ?? 0;

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

  static async pushSong(videoId: string, albumId: string): Promise<void> {
    const DB_SONG = DataBase.getSong(videoId);
    
    let payload = {}

    if (DB_SONG) {
      const AudioSource = (this.SAC.get(videoId) || await MusicIPC.getSourceAudio(videoId)) as T_FORMAT;
      if (!AudioSource) return;
      
      const Album = this.ADC.get(videoId) || await MusicIPC.getAlbumFromId(DB_SONG.album_id);
      if (!Album) return;

      const Thumbnails = await Downloader.getAlbumThumbnailsFromId(DB_SONG.album_id);

      if (!this.SAC.has(videoId)) this.SAC.set(videoId, AudioSource);
      if (!this.ADC.has(videoId)) this.ADC.set(videoId, Album);

      payload = { AudioSource: AudioSource.url, Thumbnails, Album, VideoID: videoId, Name: DB_SONG.song_name }
    } else if (this.NSSC.has(videoId)) {
      const NSSC_SONG = this.NSSC.get(videoId);
      if (!NSSC_SONG) return;

      const AudioSource = (this.SAC.get(videoId) || await MusicIPC.getSourceAudio(videoId)) as T_FORMAT;
      if (!AudioSource) return;
      
      const Album = this.ADC.get(videoId) || await MusicIPC.getAlbumFromId(albumId);
      if (!Album) return;

      const Thumbnails = await Downloader.getAlbumThumbnailsFromId(albumId);

      if (!this.SAC.has(videoId)) this.SAC.set(videoId, AudioSource);
      if (!this.ADC.has(videoId)) this.ADC.set(videoId, Album);

      payload = { AudioSource: AudioSource.url, Thumbnails, Album, VideoID: videoId, Name: NSSC_SONG.name }
    } else {
      const SongData = await MusicIPC.getSongFromId(videoId);
      if (!SongData) return;

      const AudioSource = (this.SAC.get(videoId) || await MusicIPC.getSourceAudio(videoId)) as T_FORMAT;
      if (!AudioSource) return;

      const Album = this.ADC.get(videoId) || await MusicIPC.getAlbumFromId(albumId);
      if (!Album) return;

      const Thumbnails = await Downloader.getAlbumThumbnailsFromId(albumId);

      if (!this.SAC.has(videoId)) this.SAC.set(videoId, AudioSource);
      if (!this.ADC.has(videoId)) this.ADC.set(videoId, Album);

      this.NSSC.set(videoId, SongData);
      payload = { AudioSource: AudioSource.url || "", Thumbnails, Album, VideoID: videoId, Name: SongData.name }
    }


    mainWindow.webContents.send("vybesync:event", {
      type: "pushSong",
      payload,
    });
  }
}

ipcMain.handle("song:updateSong", (_, data) => SongIPC.updateSong(data));
ipcMain.handle("song:pushSong", (_, data) => SongIPC.pushSong(data[0], data[1]));