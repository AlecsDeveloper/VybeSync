import PlayerAPI, { Format } from "./modules/PlayerAPI";
import SearchAPI from "./modules/SearchAPI";
import PresenceAPI from "./modules/PresenceAPI";
import type { T_DB_ALBUM, T_GLOBAL_SEARCH } from "@renderer/types";

// Music IPC
window.vybesync.on("pushSong", (data) => PlayerAPI.pushSong(data as Format));

// Music Bulk IPC
window.vybesync.on("setResultsLazy", (data) => SearchAPI.setResultsLazy(data as T_DB_ALBUM[]))

// Search IPC
window.vybesync.on("setGlobalSearch", (data) => SearchAPI.setGlobalSearch(data as T_GLOBAL_SEARCH))

// Presence IPC
setInterval(PresenceAPI.updateSongData, 500);