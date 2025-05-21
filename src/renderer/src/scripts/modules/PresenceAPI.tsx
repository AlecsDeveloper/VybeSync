import { $ } from "@renderer/lib/Utils";

export default class PresenceAPI {
  static updateSongData(): void {
    const $audio_element = $("#audio-controls") as HTMLAudioElement;

    if (!$audio_element) {
      window.electron.ipcRenderer.invoke("rpc:updateSongData");
      return;
    }

    const $title_element = $("#pp-title");
    const $title = $title_element?.textContent;
    const $album = $title_element?.getAttribute("album");
    const $album_thumb = $title_element?.getAttribute("album_thumbnail");
    const $artist = $("#pp-artist")?.textContent;
      
    const now = Date.now();
    const currentTimeMs = $audio_element.currentTime * 1000;
    const startTimestamp = Math.floor(now - currentTimeMs);

    const songData = {
      title: $title,
      artist: $artist,
      album: $album,
      album_thumb: $album_thumb,
      progress: startTimestamp,
      paused: $audio_element.paused || $audio_element.ended
    };

    window.electron.ipcRenderer.invoke("rpc:updateSongData", songData);
  };
}