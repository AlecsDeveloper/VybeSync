import SongDisplay from "@components/MainContent/modules/SongDisplay";
import Color from "@lib/Color";
import { $ } from "@lib/Utils";
import ReactDOM from "react-dom/client";
import ControlsAPI from "./ControlsAPI";
import { T_ALBUM, T_PUSH_SONG } from "@renderer/types";

export type thumbnail = { url: string; width: number; height: number; };
export type Format = {
  url: string;
  videoId: string;
  approx_duration_ms: number;
  thumbnails: thumbnail[];
};

let colorData: { R: number; G: number; B: number } | null = null;
let currentSongData: { thumbnails: thumbnail[]; album: T_ALBUM; name: string } | null = null;

let rightSectionRoot: ReactDOM.Root | null = null;
let leftSectionRoot: ReactDOM.Root | null = null;

const cache = new Map<string, string>();

export default class PlayerAPI {
  static async pushSong({ VideoID, AudioSource, Thumbnails, Album, Name }: T_PUSH_SONG): Promise<void> {
    try {
      const img = new Image();
      img.src = Thumbnails[0].url;

      const image = await this.loadImage(img.src, VideoID);
      colorData = Color.getAverageColor(image, 4);
    } catch (err) {
      console.warn("Failed to load image for color parsing:", err);
      colorData = null;
    }

    ControlsAPI.generateControls(AudioSource);

    currentSongData = {
      name: Name,
      album: Album,
      thumbnails: Thumbnails
    };

    this.updateView();
    this.setupResizeListener();
  }

  static async loadImage(url: string, videoId: string): Promise<HTMLImageElement> {
    const load = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });

    if (cache.has(videoId)) {
      return load(cache.get(videoId)!);
    }

    const res = await fetch(url);
    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);
    cache.set(videoId, objectURL);

    return load(objectURL);
  }


  static isInFullScreenMode(): boolean {
    return window.innerWidth >= 1024;
  }

  static updateView(): void {
    if (!currentSongData) return;

    const { thumbnails, name, album } = currentSongData;
    const isFullScreen = this.isInFullScreenMode();

    const $leftSection = $("#left-section");
    const $rightSection = $("#right-section");
    const $leftPlayerArea = $("#left-player-area");
    const $playlistArea = $("#playlist-area");

    if (!$leftSection || !$rightSection) {
      console.warn("No se encontraron las secciones necesarias");
      return;
    }

    if (!rightSectionRoot && $rightSection) {
      rightSectionRoot = ReactDOM.createRoot($rightSection);
    }

    if (!leftSectionRoot && $leftPlayerArea) {
      leftSectionRoot = ReactDOM.createRoot($leftPlayerArea);
    }

    const $targetSection = isFullScreen ? $rightSection : $leftSection;

    if (colorData) {
      const { R, G, B } = colorData;
      $targetSection.setAttribute("style", `background-image: linear-gradient(to bottom, rgb(${R}, ${G}, ${B}), #101010)`);
      (isFullScreen ? $leftSection : $rightSection).removeAttribute("style");
    }

    const thumbnail = thumbnails[1]?.url;
    const album_thumbnail = thumbnails[2]?.url;
    const title = name;
    const artist = album.artist.name;

    window.dispatchEvent(new CustomEvent("song-changed", {
      detail: { thumbnail, title, artist }
    }));

    if (!isFullScreen) {
      $leftPlayerArea?.classList.remove("hidden");
      $playlistArea?.classList.add("hidden");

      leftSectionRoot?.render(
        <SongDisplay thumbnail={thumbnail} title={title} artist={artist} album={album.name} album_thumbnail={album_thumbnail} />
      );

      rightSectionRoot?.render(null);
    } else {
      $leftPlayerArea?.classList.add("hidden");
      $playlistArea?.classList.remove("hidden");

      rightSectionRoot?.render(
        <SongDisplay thumbnail={thumbnail} title={title} artist={artist} album={album.name} album_thumbnail={album_thumbnail} />
      );
    }

    ControlsAPI.generateSongPreview(thumbnail, title, artist);
  }

  static resizeListenerSetup = false;

  static setupResizeListener(): void {
    if (this.resizeListenerSetup) return;

    let resizeTimer: number | null = null;

    const handleResize = (): void => {
      if (resizeTimer !== null) clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        this.updateView();
        resizeTimer = null;
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    this.resizeListenerSetup = true;
  }
}
