import PlayerAPI, { Format } from "./modules/PlayerAPI";
import SearchAPI, { Song } from "./modules/SearchAPI";

window.vybesync.on("setResults", (data) => SearchAPI.setResults(data as Song[]));
window.vybesync.on("pushSong", (data) => PlayerAPI.pushSong(data as Format));