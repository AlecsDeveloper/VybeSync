import { $ } from "@renderer/lib/Utils";
import ReactDOM from "react-dom/client";
import { SongItemLazy, } from "@renderer/components/MainContent";

export type Song = {
  type: "SONG";
  name: string;
  videoId: string;
  artist: { artistId: string | null; name: string; };
  album: { name: string; albumId: string; } | null;
  duration: number | null;
  thumbnails: { url: string; width: number; height: number; }[];
};

let root: ReactDOM.Root | null = null;

export default class SearchAPI {
  static async getResults(query: string): Promise<void> {
    window.electron.ipcRenderer.invoke("music:getResults", { query });
  }

  static async getBulkResults(query: string): Promise<void> {
    window.electron.ipcRenderer.invoke("music_bulk:getResults", { query });
  }

  static setResultsLazy(albums: T_ALBUM[]): void {
    const $result_section = $("#center-section");
    if (!$result_section) return;
    if (!root) root = ReactDOM.createRoot($result_section);

    let index = -1;
    root.render(
      <>
        {albums.map((album) =>
          album.albumSongs.map((song) => {
            index++;
            return (
              <SongItemLazy
                key={song.videoId}
                song={song}
                album={album}
                index={index}
                liked={song.liked}
              />
            )
          })
        )}
      </>
    );
  }
}



export type T_ALBUM = {
  albumId: string;

  albumThumbnails: { 
    url: string; 
    width: number; 
    height: number;
  }[];

  albumBasicinfo: { 
    name: string;
    year: number | null;
    artist: { 
      artistId: string | null;
      name: string;
    }
  };

  albumSongs: T_SONG[];
}

export type T_SONG = {
  videoId: string;
  name: string;
  duration: number | null;
  albumId: string | null;
  liked: boolean
}