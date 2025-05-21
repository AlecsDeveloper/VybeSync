import { app } from 'electron';
import path from 'path';
import Database from 'better-sqlite3';

const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'vybesync.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS thumbnails (
    album_id TEXT PRIMARY KEY,
    low_thumb TEXT NOT NULL,   -- base64
    high_thumb TEXT NOT NULL,  -- base64
    rpc_thumb TEXT NOT NULL    -- base64
  );

  CREATE TABLE IF NOT EXISTS songs (
    video_id TEXT PRIMARY KEY,
    song_name TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    album_id TEXT NOT NULL,
    duration INTEGER
  );

  CREATE TABLE IF NOT EXISTS albums (
    album_id TEXT PRIMARY KEY,
    songs_ids TEXT NOT NULL   -- Guarda JSON.stringify([...])
  );
`);

export async function insertThumbnail(albumId: string, lowThumb: string, highThumb: string, rpcThumbUrl: string): Promise<void> {
  const idMatch = rpcThumbUrl.match(/lh3\.googleusercontent\.com\/([^=]+)/);
  if (!idMatch) {
    console.warn(`Invalid data in rpc_thumb: ${rpcThumbUrl}`);
    return;
  }

  const rpcThumbId = idMatch[1];

  if (!lowThumb || !highThumb || !rpcThumbId) {
    console.warn(`Missing data in the album: ${albumId}`);
    return;
  }

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO thumbnails (album_id, low_thumb, high_thumb, rpc_thumb)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(albumId, lowThumb, highThumb, rpcThumbId);
}

export function getThumbnails(albumId: string): THUMBNAILS_TABLE | undefined {
  const stmt = db.prepare(`SELECT * FROM thumbnails WHERE album_id = ?`);
  const row = stmt.get(albumId) as THUMBNAILS_TABLE;

  if (!row) return undefined;

  return {
    ...row,
    rpc_thumb: `https://lh3.googleusercontent.com/${row.rpc_thumb}=w60-h60-l90-rj`
  };
}

type THUMBNAILS_TABLE = {
  album_id: string,
  low_thumb: string,
  high_thumb: string,
  rpc_thumb: string
} | undefined;