import SongDisplay from "@components/MainContent/modules/SongDisplay";
import Color from "@lib/Color";
import { $ } from "@lib/Utils";
import ReactDOM from "react-dom/client";

export type thumbnail = { url: string; width: number; height: number; }
export type Format = {
  url: string;
  videoId: string;
  approx_duration_ms: number;
  thumbnails: thumbnail[];
};

let colorData: { R: number; G: number; B: number } | null = null;
let currentSongData: { element: HTMLElement; thumbnails: thumbnail[] } | null = null;

let rightSectionRoot: ReactDOM.Root | null = null;
let leftSectionRoot: ReactDOM.Root | null = null;

const cache = new Map();

export default class PlayerAPI {
  static async pushSong({ url, videoId, thumbnails }: Format): Promise<void> {
    const $song_element = document.getElementById(videoId);
    const imgElement = $song_element?.getElementsByTagName("img").item(0) as HTMLImageElement | null;

    if (!$song_element || !imgElement) return;

    try {
      const image = await this.loadImage(imgElement.src, videoId);
      colorData = Color.getAverageColor(image, 4);
    } catch (err) {
      console.warn("Failed to load image for color parsing:", err);
      colorData = null;
    }

    this.generateControls(url);

    currentSongData = {
      element: $song_element,
      thumbnails
    };

    this.updateView();
    this.setupResizeListener();
  }

  static async loadImage(url: string, videoId: string): Promise<HTMLImageElement> {
    if (cache.has(videoId)) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = cache.get(videoId);
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    } else {
      const res = await fetch(url);
      const blob = await res.blob();
      const objectURL = URL.createObjectURL(blob);

      cache.set(videoId, objectURL);

      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = objectURL;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    }
  }

  static generateControls(url: string): void {
    const $player_bar = $("#player-bar");
    if (!$player_bar) return;

    $player_bar.innerHTML = "";

    const audio = document.createElement("audio");
    audio.src = url;
    audio.setAttribute("controls", "");
    audio.setAttribute("autoplay", "");
    audio.setAttribute("loop", "");

    $player_bar.appendChild(audio);
  }

  static isInFullScreenMode(): boolean {
    return window.innerWidth >= 1024;
  }

  static updateView(): void {
    if (!currentSongData) return;

    const { element: songElement, thumbnails } = currentSongData;
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
      $targetSection.setAttribute(
        "style",
        `background-image: linear-gradient(to bottom, rgb(${R}, ${G}, ${B}), #101010)`
      );

      if (isFullScreen) {
        $leftSection.removeAttribute("style");
      } else {
        $rightSection.removeAttribute("style");
      }
    }

    const thumbIndex = thumbnails.length - 1;
    const thumbnail = thumbnails[thumbIndex]?.url;
    const title = songElement.querySelector("section:nth-of-type(2) h4")?.textContent?.trim() || "";
    const artist = songElement.querySelector("section:nth-of-type(2) h2")?.textContent?.trim() || "";

    const songEvent = new CustomEvent('song-changed', {
      detail: { thumbnail, title, artist }
    });
    window.dispatchEvent(songEvent);

    if (!isFullScreen) {
      if ($leftPlayerArea) $leftPlayerArea.classList.remove("hidden");
      if ($playlistArea) $playlistArea.classList.add("hidden");

      if (leftSectionRoot) {
        leftSectionRoot.render(
          <SongDisplay thumbnail={thumbnail} title={title} artist={artist} />
        );
      }

      if (rightSectionRoot) {
        rightSectionRoot.render(null);
      }
    } else {
      if ($leftPlayerArea) $leftPlayerArea.classList.add("hidden");
      if ($playlistArea) $playlistArea.classList.remove("hidden");

      if (rightSectionRoot) {
        rightSectionRoot.render(
          <SongDisplay thumbnail={thumbnail} title={title} artist={artist} />
        );
      }
    }
  }

  static resizeListenerSetup = false;

  static setupResizeListener(): void {
    if (this.resizeListenerSetup) return;

    let resizeTimer: number | null = null;

    const handleResize = (): void => {
      if (resizeTimer !== null) {
        clearTimeout(resizeTimer);
      }

      resizeTimer = window.setTimeout(() => {
        this.updateView();
        resizeTimer = null;
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    this.resizeListenerSetup = true;
  }
}
