import { ipcMain, app } from 'electron';
import path from 'path';
import Database from 'better-sqlite3';

const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'vybesync.db');
const db = new Database(dbPath);

ipcMain.handle('get-user-config-path', () => {
  return app.getPath('userData')
})


db.exec(`
  CREATE TABLE IF NOT EXISTS thumbnails (
    id TEXT PRIMARY KEY,
    low_thumb TEXT NOT NULL,   -- base64
    high_thumb TEXT NOT NULL,  -- base64
    rpc_thumb TEXT NOT NULL    -- base64
  );

  CREATE TABLE IF NOT EXISTS songs (
    video_id TEXT PRIMARY KEY,
    song_name TEXT NOT NULL,
    album_id TEXT NOT NULL,
    duration INTEGER,
    liked INTEGER DEFAULT 0,     -- 0 o 1
    saved INTEGER DEFAULT 0      -- 0 o 1
  );

  CREATE TABLE IF NOT EXISTS artists (
    artist_id TEXT PRIMARY KEY,
    artist_name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS albums (
    album_id TEXT PRIMARY KEY,
    songs_ids TEXT NOT NULL   -- Guardar JSON.stringify([...])
  );

  CREATE TABLE IF NOT EXISTS playlists (
    playlist_id TEXT PRIMARY KEY,
    songs_ids TEXT NOT NULL   -- Guardar JSON.stringify([...])
  );
`);

export async function insertSong(
  video_id: string,
  song_name: string,
  album_id: string,
  duration: number,
  liked: number,
  saved: number
): Promise<void> {
  db.prepare(`
    INSERT INTO songs (video_id, song_name, album_id, duration, liked, saved)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(video_id) DO UPDATE SET
      song_name = excluded.song_name,
      album_id = excluded.album_id,
      duration = excluded.duration,
      liked = excluded.liked,
      saved = excluded.saved
  `).run(video_id, song_name, album_id, duration, liked, saved);
}

export function getSong(videoId: string): SONGS_TABLE {
  const stmt = db.prepare(`SELECT * FROM songs WHERE video_id = ?`);
  const row = stmt.get(videoId) as SONGS_TABLE;

  return row
}

export function deleteSong(videoId: string): void {
  const stmt = db.prepare(`DELETE FROM songs WHERE video_id = ?`);
  stmt.run(videoId);
}

export function existsSong(videoId: string): boolean {
  const stmt = db.prepare(`SELECT 1 FROM songs WHERE video_id = ? LIMIT 1`);
  const row = stmt.get(videoId);
  return !!row;
}

export function getAllSongs(): SONGS_TABLE[] {
  const stmt = db.prepare(`SELECT * FROM songs`);
  const rows = stmt.all() as SONGS_TABLE[];
  return rows;
}


export type SONGS_TABLE = {
  video_id: string;
  song_name: string;
  album_id: string;
  duration: number;
  liked: number;
  saved: number;
} | undefined



// Playlists
export async function insertPlaylist(playlistId: string, songsIds: string): Promise<void> {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO playlists (playlist_id, songs_ids)
    VALUES (?, ?)
  `);

  stmt.run(playlistId, songsIds);
}

export function getPlaylist(playlistId: string): PLAYLISTS_TABLE {
  const stmt = db.prepare(`SELECT * FROM playlists WHERE playlist_id = ?`);
  const row = stmt.get(playlistId) as PLAYLISTS_TABLE;

  return row;
}

export type PLAYLISTS_TABLE = {
  playlist_id: string;
  songs_ids: string;
} | undefined


// Albums
export async function insertAlbum(albumId: string, songsIds: string): Promise<void> {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO albums (album_id, songs_ids)
    VALUES (?, ?)
  `);

  stmt.run(albumId, songsIds);
}

export function getAlbum(albumId: string): ALBUMS_TABLE {
  const stmt = db.prepare(`SELECT * FROM albums WHERE album_id = ?`);
  const row = stmt.get(albumId) as ALBUMS_TABLE;

  return row;
}

export type ALBUMS_TABLE = {
  album_id: string;
  songs_ids: string;
} | undefined




// Thumbnails
export async function insertThumbnail(id: string, lowThumb: string, highThumb: string, rpcThumbUrl: string): Promise<void> {
  const idMatch = rpcThumbUrl.match(/lh3\.googleusercontent\.com\/([^=]+)/);
  if (!idMatch) {
    console.warn(`Invalid data in rpc_thumb: ${rpcThumbUrl}`);
    return;
  }

  const rpcThumbId = idMatch[1];

  if (!lowThumb || !highThumb || !rpcThumbId) {
    console.warn(`Missing data in the profile: ${id}`);
    return;
  }

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO thumbnails (id, low_thumb, high_thumb, rpc_thumb)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(id, lowThumb, highThumb, rpcThumbId);
}

export function getThumbnails(id: string): THUMBNAILS_TABLE {
  const stmt = db.prepare(`SELECT * FROM thumbnails WHERE id = ?`);
  const row = stmt.get(id) as THUMBNAILS_TABLE;

  if (!row) return undefined;

  return {
    ...row,
    rpc_thumb: `https://lh3.googleusercontent.com/${row.rpc_thumb}=w60-h60-l90-rj`
  };
}

type THUMBNAILS_TABLE = {
  id: string,
  low_thumb: string,
  high_thumb: string,
  rpc_thumb: string
} | undefined;