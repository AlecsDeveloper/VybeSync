import { app, ipcMain } from 'electron';
import path from 'path';
import dotenv from 'dotenv';
import VybeRPC from '../lib/vybe_rpc';
import type { Presence, T_Client } from '../lib/vybe_rpc';

dotenv.config({ path: path.join(app.getAppPath(), '.env') });

type UpdateSongDataParams = {
  title: string;
  artist: string;
  album: string;
  album_thumb: string;
  progress: number;
  state: string;
  paused: boolean;
}

export class RichPresenceAPI {
  private static ClientID = process.env.DISCORD_CLIENT_ID;
  private static RPC: T_Client | null = null;
  private static TimeStamp = Date.now();

  static async StartRPC(): Promise<void> {
    if (!app.isReady()) return;
    else if (!this.ClientID) return console.error("Invalid Client ID");

    this.RPC = new VybeRPC.Client({ ClientID: this.ClientID });

    RichPresenceAPI.UpdateSongData(undefined);
  }

  static RemoveRPC(): void {
    if (!this.RPC) return;

    this.RPC = null;
  }

  static UpdateSongData(data: UpdateSongDataParams | undefined): void {
    if (!app.isReady()) return;
    else if (!this.RPC) return console.error("RPC is not connected");

    const DefaultButton = new VybeRPC.ButtonBuilder("Check VybeSync", "https://github.com/AlecsDeveloper/VybeSync").build();

    const DefaultActivity = new VybeRPC.ActivityBuilder()
      .setType(2)
      .setDetails("Using the App")
      .setState("Hearing Music with VybeSync")
      .setTimestamps(this.TimeStamp)
      .setAssets("icon")
      .setInstance(false)
      .setButtons([ DefaultButton ])
      .build();

    const SongActivity = new VybeRPC.ActivityBuilder()
      .setType(2)
      .setDetails(data?.title || "unknow")
      .setState(`${data?.artist || "unknow"} - ${data?.album || "unknow"}`)
      .setAssets(data?.album_thumb || "icon")
      .setButtons([ DefaultButton ])

    if (data?.paused) {
      SongActivity.setTimestamps(Date.now());
    }
    else if (data?.progress) SongActivity.setTimestamps(data.progress);

    this.RPC.setActivity(data ? SongActivity.build() : DefaultActivity)
  }

  static SetActivity(data: Presence): void {
    if (!this.RPC) return console.error("RPC is not connected");

    this.RPC.setActivity(data);
  }
}

ipcMain.handle("rpc:updateSongData", (_, data) => RichPresenceAPI.UpdateSongData(data));