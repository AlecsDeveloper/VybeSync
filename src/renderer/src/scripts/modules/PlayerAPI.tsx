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

let root: ReactDOM.Root | null = null;
const cache = new Map();

export default class PlayerAPI {
  static async pushSong({ url, videoId, thumbnails }: Format): Promise<void> {
    const $song_element = document.getElementById(videoId);
    const imgElement = $song_element?.getElementsByTagName("img").item(0) as HTMLImageElement | null;

    if (!$song_element || !imgElement) return;

    try {
      const image = await this.loadImage(imgElement.src, videoId);
      const { R, G, B } = Color.getAverageColor(image, 4);
      $("#right-section")?.setAttribute(
        "style",
        `background-image: linear-gradient(to bottom, rgb(${R}, ${G}, ${B}), #101010)`
      );
    } catch (err) {
      console.warn("Failed to load image for color parsing:", err);
    }

    this.generateControls(url);
    this.generateView($song_element, thumbnails);
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

  static generateView(songElement: HTMLElement, thumbnails: thumbnail[]): void {
    const $view_section = $("#right-section");
    if (!$view_section) return;
    if (!root) root = ReactDOM.createRoot($view_section);

    root.render(null);

    const thumbIndex = thumbnails.length - 1;
    const thumbnail = thumbnails[thumbIndex]?.url;
    const title = songElement.querySelector("section:nth-of-type(2) h4")?.textContent?.trim() || "";
    const artist = songElement.querySelector("section:nth-of-type(2) h2")?.textContent?.trim() || "";
    
    root.render(
      <SongDisplay thumbnail={thumbnail} title={title} artist={artist} />
    );
  }
}
