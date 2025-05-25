import PlayerAPI from "./modules/PlayerAPI";
import SearchAPI from "./modules/SearchAPI";
import PresenceAPI from "./modules/PresenceAPI";
import type { T_DB_ALBUM, T_GLOBAL_SEARCH, T_PUSH_SONG } from "@renderer/types";


window.vybesync.on("setResultsLazy", (data) => SearchAPI.setResultsLazy(data as T_DB_ALBUM[]))

// Song IPC
window.vybesync.on("setGlobalSearch", (data) => SearchAPI.setGlobalSearch(data as T_GLOBAL_SEARCH));

window.vybesync.on("pushSong", (data: unknown) => {
  const payload = data as T_PUSH_SONG;
  if (!payload.VideoID) return;

  PlayerAPI.pushSong(payload);
});


// Presence IPC
setInterval(PresenceAPI.updateSongData, 500);