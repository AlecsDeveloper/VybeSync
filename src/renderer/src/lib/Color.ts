export default class Color {
  static getAverageColor(imageElement: HTMLImageElement, ratio: number): { R: number; G: number; B: number } {
    const canvas = document.createElement("canvas");
    const width = (canvas.width = imageElement.naturalWidth);
    const height = (canvas.height = imageElement.naturalHeight);

    const context = canvas.getContext("2d");
    if (!context) return { R: 0, G: 0, B: 0 };

    context.drawImage(imageElement, 0, 0);

    let data: ImageData;
    let length: number;
    let i = -4;
    let count = 0;
    let R = 0, G = 0, B = 0;

    try {
      data = context.getImageData(0, 0, width, height);
      length = data.data.length;
    } catch (err) {
      console.error(err);
      return { R: 0, G: 0, B: 0 };
    }

    while ((i += ratio * 4) < length) {
      ++count;
      R += data.data[i];
      G += data.data[i + 1];
      B += data.data[i + 2];
    }

    R = ~~(R / count);
    G = ~~(G / count);
    B = ~~(B / count);

    return { R, G, B };
  }

  static rgbToHex({ R, G, B }: { R: number; G: number; B: number }): string {
    const componentToHex = (c: number): string => {
      const hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return "#" + componentToHex(R) + componentToHex(G) + componentToHex(B);
  }

  static hexToRgb(hex: string): { R: number; G: number; B: number } {
    hex = hex.replace(/^#/, '');

    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }

    const R = parseInt(hex.slice(0, 2), 16);
    const G = parseInt(hex.slice(2, 4), 16);
    const B = parseInt(hex.slice(4, 6), 16);

    return { R, G, B };
  }

  static parseSecondsToMS(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}