import PlayerAPI, { Format } from "./modules/PlayerAPI";
import SearchAPI, { T_ALBUM } from "./modules/SearchAPI";
import PresenceAPI from "./modules/PresenceAPI";

// Music IPC
window.vybesync.on("pushSong", (data) => PlayerAPI.pushSong(data as Format));

// Music Bulk IPC
window.vybesync.on("setResultsLazy", (data) => SearchAPI.setResultsLazy(data as T_ALBUM[]))

// Presence IPC
setInterval(PresenceAPI.updateSongData, 500);