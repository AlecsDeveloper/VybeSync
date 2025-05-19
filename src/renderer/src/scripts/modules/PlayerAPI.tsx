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

// Mantener datos que nos permitirán reconstruir la vista
let colorData: { R: number; G: number; B: number } | null = null;
let currentSongData: { element: HTMLElement; thumbnails: thumbnail[] } | null = null;

// Una raíz para cada sección
let rightSectionRoot: ReactDOM.Root | null = null;
let leftSectionRoot: ReactDOM.Root | null = null;

// Caché para las imágenes
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

    // Guardar los datos actuales
    currentSongData = {
      element: $song_element,
      thumbnails
    };

    // Generar la vista y configurar el listener de redimensionamiento
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
    const $auido_container = $("#audio-container");
    if (!$auido_container) return;

    $auido_container.innerHTML = "";

    const audio = document.createElement("audio");
    audio.src = url;
    audio.setAttribute("controls", "");
    audio.setAttribute("autoplay", "");
    audio.setAttribute("loop", "");

    $auido_container.appendChild(audio);
  }

  static isInFullScreenMode(): boolean {
    return window.innerWidth >= 1024;
  }

  static updateView(): void {
    if (!currentSongData) return;

    const { element: songElement, thumbnails } = currentSongData;
    const isFullScreen = this.isInFullScreenMode();

    // Determinar las secciones en función del tamaño de pantalla
    const $targetSection = isFullScreen ? $("#right-section") : $("#left-section");
    const $inactiveSection = isFullScreen ? $("#left-section") : $("#right-section");

    if (!$targetSection || !$inactiveSection) {
      console.warn("No se encontraron las secciones necesarias");
      return;
    }

    // Inicializar las raíces si es necesario
    if (isFullScreen && !rightSectionRoot && $targetSection) {
      rightSectionRoot = ReactDOM.createRoot($targetSection);
    } else if (!isFullScreen && !leftSectionRoot && $targetSection) {
      leftSectionRoot = ReactDOM.createRoot($targetSection);
    }

    // Obtener la raíz activa
    const activeRoot = isFullScreen ? rightSectionRoot : leftSectionRoot;
    if (!activeRoot) return;

    // Aplicar el gradiente a la sección activa
    if (colorData) {
      const { R, G, B } = colorData;
      $targetSection.setAttribute(
        "style",
        `background-image: linear-gradient(to bottom, rgb(${R}, ${G}, ${B}), #101010)`
      );

      // Limpiar el estilo de la sección inactiva
      $inactiveSection.removeAttribute("style");
    }

    // Preparar datos de la canción para el render
    const thumbIndex = thumbnails.length - 1;
    const thumbnail = thumbnails[thumbIndex]?.url;
    const title = songElement.querySelector("section:nth-of-type(2) h4")?.textContent?.trim() || "";
    const artist = songElement.querySelector("section:nth-of-type(2) h2")?.textContent?.trim() || "";

    // Emitir el evento de cambio de canción
    const songEvent = new CustomEvent('song-changed', {
      detail: { thumbnail, title, artist }
    });
    window.dispatchEvent(songEvent);

    // Renderizar en la sección activa
    activeRoot.render(
      <SongDisplay thumbnail={thumbnail} title={title} artist={artist} />
    );

    // Limpiar la sección inactiva
    if (isFullScreen && leftSectionRoot) {
      leftSectionRoot.render(null);
    } else if (!isFullScreen && rightSectionRoot) {
      rightSectionRoot.render(null);
    }
  }

  // Variable para controlar si el listener ya está configurado
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
