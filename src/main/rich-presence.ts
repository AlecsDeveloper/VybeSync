import { app } from 'electron';
import DiscordRPC from 'discord-rpc';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(app.getAppPath(), '.env') });

const clientId = process.env.DISCORD_CLIENT_ID;

let rpc: DiscordRPC.Client | null = null;

const startTimestamp = new Date();

export async function initDiscord(): Promise<void> {
  if (!app.isReady()) return;

  if (!clientId) {
  console.error('Error: DISCORD_CLIENT_ID not found');
    return;
  }

  DiscordRPC.register(clientId);

  rpc = new DiscordRPC.Client({ transport: 'ipc' });

  rpc.on('ready', () => {
    console.log('RPC status: fine');

    setActivity();

    setInterval(() => {
      setActivity();
    }, 60000);
  });

  try {
    await rpc.login({ clientId });
  } catch (error) {
    console.error('Fatal RPC Error:', error);
  }
}

function setActivity(): void {
  if (!rpc) return;

  rpc.setActivity({
    details: 'Using the App',
    state: 'Hearing Music with VybeSync',
    startTimestamp,
    instance: false,
  });
}

export function updateDiscordActivity(details: string, state: string): void {
  if (!rpc) return;

  rpc.setActivity({
    details,
    state,
    startTimestamp,
    instance: false,
  });
}

export function destroyDiscord(): void {
  if (!rpc) return;

  rpc.destroy();
  rpc = null;
}
