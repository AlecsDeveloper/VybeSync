import { $ } from "@renderer/lib/Utils"
import ReactDOM from "react-dom/client"
import { SongItem } from "@renderer/components/MainContent";

export type Song = {
  type: "SONG";
  name: string;
  videoId: string;
  artist: { artistId: string | null; name: string; };
  album: { name: string; albumId: string; } | null;
  duration: number | null;
  thumbnails: { url: string; width: number; height: number; }[];
}

let root: ReactDOM.Root | null = null;

export default class SearchAPI {
  static async getResults(query: string): Promise<void> {
    window.electron.ipcRenderer.invoke("youtube:getResults", { query });
  }

  static setResults(data: Song[]): void {
    const $result_section = $("#center-section");
    if (!$result_section) return;

    if (!root) {
      root = ReactDOM.createRoot($result_section);
    }

    root.render(
      <>
        {data.map((song) => (
          <SongItem key={song.videoId} song={song} />
        ))}
      </>
    );
  }
}
