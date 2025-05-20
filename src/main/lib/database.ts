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
    high_thumb TEXT NOT NULL   -- base64
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

export async function insertThumbnail(albumId: string, lowThumb: string, highThumb: string): Promise<void> {
  if (!lowThumb || !highThumb) {
    console.warn(`Fallo la descarga para el albumId: ${albumId}`);
    return;
  }

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO thumbnails (album_id, low_thumb, high_thumb)
    VALUES (?, ?, ?)
  `);

  stmt.run(albumId, lowThumb, highThumb);
}

type THUMBNAILS_TABLE = { album_id: string, low_thumb: string, high_thumb: string } | undefined
export function getThumbnails(albumId: string): THUMBNAILS_TABLE {
  const stmt = db.prepare(`SELECT * FROM thumbnails WHERE album_id = ?`);
  return stmt.get(albumId) as THUMBNAILS_TABLE
}
