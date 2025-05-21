import { $ } from "@renderer/lib/Utils";
import ReactDOM from "react-dom/client";
import { SongPreview, SongControls } from "@components/PlayerBar";

export default class ControlsAPI {
  private static SongPreviewDOM: ReactDOM.Root | null = null;
  private static SongControlsDOM: ReactDOM.Root | null = null;
  private static SongConfigDOM: ReactDOM.Root | null = null;


  static generateAudioElement(url: string): void {
    const $auido_container = $("#audio-container");
    if (!$auido_container) return;

    $auido_container.innerHTML = "";

    const audioElement = document.createElement("audio") as HTMLAudioElement;
    audioElement.id = "audio-controls"
    audioElement.src = url;
    audioElement.setAttribute("controls", "");
    audioElement.setAttribute("autoplay", "");

    $auido_container.appendChild(audioElement);
    this.generateSongControls(audioElement);
  }
  
  static generateSongPreview(thumbnail: string, title: string, artist: string): void { 
    const $player_section = $("#player-preview");
    if (!$player_section) return;
    if (!this.SongPreviewDOM) this.SongPreviewDOM = ReactDOM.createRoot($player_section);

    this.SongPreviewDOM.render(
      <>
        <SongPreview 
          thumbnail={thumbnail} 
          title={title} 
          artist={artist}
        />
      </>
    )
  }

  static generateSongControls(audioElement: HTMLAudioElement): void { 
    const $player_section = $("#player-controls");
    if (!$player_section) return;
    if (!this.SongControlsDOM) this.SongControlsDOM = ReactDOM.createRoot($player_section);

    this.SongControlsDOM.render(
      <>
        <SongControls audioElement={audioElement}/>
      </>
    )
  }

  static generateSongConfig(): void { 
    const $player_section = $("#player-config");
    if (!$player_section) return;
    if (!this.SongConfigDOM) this.SongConfigDOM = ReactDOM.createRoot($player_section);

  }

  static generateControls(url: string): void {
    this.generateAudioElement(url);
    this.generateSongConfig();
  } 
}