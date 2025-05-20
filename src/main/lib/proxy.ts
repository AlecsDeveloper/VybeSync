import axios from "axios";

async function downloadImageAsBase64(url: string): Promise<string | null> {
  try {
    const res = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0", // Para que no te bloquee
      },
    });
    const base64 = Buffer.from(res.data, "binary").toString("base64");
    const mime = res.headers["content-type"] ?? "image/jpeg";
    return `data:${mime};base64,${base64}`;
  } catch (err) {
    console.error("Error descargando imagen:", err);
    return null;
  }
}

export async function downloadWithRetry(url: string, retries = 3): Promise<string | null> {
  for (let i = 0; i < retries; i++) {
    const base64 = await downloadImageAsBase64(url);
    if (base64) return base64;
    await new Promise(r => setTimeout(r, 300 + Math.random() * 700)); // espera entre 300ms y 1s
  }
  return null;
}
