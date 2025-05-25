import { $ } from "@renderer/lib/Utils";
import ReactDOM from "react-dom/client";
import { SongItemLazy, } from "@renderer/components/MainContent";
import type { T_ALBUM_SEARCH, T_DB_ALBUM, T_GLOBAL_SEARCH } from "@renderer/types";
import { GlobalSearch } from "@renderer/components/SearchResults";
import AlbumSearch from "@renderer/components/SearchResults/panels/AlbumSearch";

let root: ReactDOM.Root | null = null;

export default class SearchAPI {
  static async getResults(query: string): Promise<void> {
    window.electron.ipcRenderer.invoke("music:getResults", { query });
  }

  static async getBulkResults(query: string): Promise<void> {
    window.electron.ipcRenderer.invoke("music_bulk:getResults", { query });
  }

  static setResultsLazy(albums: T_DB_ALBUM[]): void {
    const $result_section = $("#center-section");
    if (!$result_section) return;
   
    if (root) root.unmount();
    $result_section.innerHTML = "";
    root = ReactDOM.createRoot($result_section);

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

  static async getGlobalSearch(query: string): Promise<void> {
    window.electron.ipcRenderer.invoke("search:getGlobalSearch", query);
  }

  static setGlobalSearch(GlobalSeachData: T_GLOBAL_SEARCH): void {
    const $result_section = $("#center-section");
    if (!$result_section) return;
   
    if (root) root.unmount();
    $result_section.innerHTML = "";
    root = ReactDOM.createRoot($result_section);

    root.render(
      <>
        <GlobalSearch data={GlobalSeachData}/>
      </>
    )
  }

  static async getAlbumSearch(query: string): Promise<void> {
    window.electron.ipcRenderer.invoke("search:getAlbumSearch", query);
  }

  static setAlbumSearch(AlbumSeachData: T_ALBUM_SEARCH): void {
    const $result_section = $("#center-section");
    if (!$result_section) return;
   
    if (root) root.unmount();
    $result_section.innerHTML = "";
    root = ReactDOM.createRoot($result_section);

    root.render(
      <>
        <AlbumSearch data={AlbumSeachData}/>
      </>
    )
  }
}

