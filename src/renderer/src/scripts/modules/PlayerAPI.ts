import Color from "@renderer/lib/Color";
import { $ } from "@renderer/lib/Utils";

export type Format = {
  url: string;
  videoId: string;
  approx_duration_ms: number;
}

export default class PlayerAPI {
  static pushSong({ url, approx_duration_ms, videoId }: Format): void {
    const $song_element = document.getElementById(videoId);
    const imgElement = $song_element?.getElementsByTagName("img").item(0);
    
    if (!$song_element || !imgElement) return;

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imgElement.src;

      img.onload = () => {
        const { R, G, B } = Color.getAverageColor(img, 4);
        $("#right-section")?.setAttribute(
          "style",
          `background-image: linear-gradient(to bottom, rgb(${R}, ${G}, ${B}), #101010)`
        );
      };
    } catch (e) {
      console.error(e)
    }

    console.log(approx_duration_ms);
    this.generateControls(url);
  }

  static generateControls(url: string): void {
    const $player_bar = $("#player-bar");
    if (!$player_bar) return;

    $player_bar.innerHTML = "";

    const audio = document.createElement("audio");
    audio.src = url;
    audio.setAttribute("controls", "");
    audio.setAttribute("autoplay", "");

    $player_bar.appendChild(audio);
  }
}
