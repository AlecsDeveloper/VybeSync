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

  static saturate({ R, G, B }: { R: number; G: number; B: number }, factor = 1.2): { R: number; G: number; B: number } {
    const r = R / 255, g = G / 255, b = B / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;

    let s = 0, h = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }

    s = Math.min(1, s * factor);

    const hueToRgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r2 = l, g2 = l, b2 = l;
    if (s > 0) {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r2 = hueToRgb(p, q, h + 1/3);
      g2 = hueToRgb(p, q, h);
      b2 = hueToRgb(p, q, h - 1/3);
    }

    return {
      R: Math.round(r2 * 255),
      G: Math.round(g2 * 255),
      B: Math.round(b2 * 255)
    };
  }

  static getContrastColor({ R, G, B }: { R: number; G: number; B: number }): 1 | 0 {
    const avg = (R + G + B) / 3;
    return avg < 64 ? 1 : 0;
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
}