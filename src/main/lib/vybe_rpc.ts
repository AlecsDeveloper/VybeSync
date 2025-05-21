import net from "node:net";
import os from "node:os";
import { EventEmitter } from "node:events";

// Client 
export type T_Client = {
  setActivity(data: Presence): void
}


export class Client {
  // Missing Data
  private ClientID: string;
  private SocketPath: string;
  private Socket: net.Socket;
  private EventTracker: EventEmitter = new EventEmitter();
  private Ready = false;
  private QueuedActivity: Presence | null = null;

  // Constant Data
  static OPCODES = { HANDSHAKE: 0, FRAME: 1, CLOSE: 2, PING: 3, PONG: 4 };
  static VERSION = 1;

  constructor({ ClientID }: { ClientID: string }) {
    this.ClientID = ClientID;
    this.SocketPath =
      os.platform() === "win32"
        ? "\\\\.\\pipe\\discord-ipc-0"
        : `${os.tmpdir()}/discord-ipc-0`;

    this.Socket = net.createConnection(this.SocketPath, this.setConnection);
    this.listenConection(this.EventON);
  }

  private setConnection = (): void => {
    const PayLoad = this.encode(Client.OPCODES.HANDSHAKE, {
      v: Client.VERSION,
      client_id: this.ClientID,
    });
    this.Socket.write(PayLoad);
  };

  private listenConection(callback: (op: number, data: Record<string, unknown> | undefined) => void): void {
    this.Socket.on("data", (chunk) => {
      const { op, data } = this.decode(chunk);
      callback(op, data);
    });
  }

  private EventON = (op: number, data: Record<string, unknown> | undefined): void => {
    if (!data) return;
    else if (
      op !== Client.OPCODES.FRAME ||
      data.cmd !== "DISPATCH" ||
      data.evt !== "READY"
    ) return;

    console.log("Connection enabled!");
    this.Ready = true;

    this.EventTracker.on("SET_ACTIVITY", (activity) => {
      if (!this.Ready) return;

      const packet = this.encode(Client.OPCODES.FRAME, {
        cmd: "SET_ACTIVITY",
        args: {
          pid: process.pid,
          activity,
        },
        nonce: `${Date.now()}`,
      });

      this.Socket.write(packet);
    });

    if (this.QueuedActivity) {
      this.setActivity(this.QueuedActivity);
      this.QueuedActivity = null;
    }
  };

  private encode(op: number, payload: unknown): Buffer {
    const data = Buffer.from(JSON.stringify(payload), "utf8");
    const header = Buffer.alloc(8);
    header.writeInt32LE(op, 0);
    header.writeInt32LE(data.length, 4);
    return Buffer.concat([header, data]);
  }

  private decode(buffer: Buffer): { op: number; data: Record<string, unknown> } {
    const op = buffer.readInt32LE(0);
    const len = buffer.readInt32LE(4);
    const data = JSON.parse(buffer.slice(8, 8 + len).toString("utf8"));
    return { op, data };
  }

  // Public Methods
  setActivity(data: Presence): void {
    if (!this.Ready) {
      this.QueuedActivity = data;
    }
    this.EventTracker.emit("SET_ACTIVITY", data);
  }
}

// Builders
export class ActivityBuilder {
  private activity: Presence = {
    type: 0,
    name: '',
    created_at: Date.now(),
  };

  setName(name: string): this {
    this.activity.name = name;
    return this;
  }

  setType(type: number): this {
    this.activity.type = type;
    return this;
  }

  setUrl(url: string): this {
    this.activity.url = url;
    return this;
  }

  setCreatedAt(ms: number): this {
    this.activity.created_at = ms;
    return this;
  }

  setTimestamps(start?: number, end?: number): this {
    this.activity.timestamps = {};
    if (start) this.activity.timestamps.start = start;
    if (end) this.activity.timestamps.end = end;
    return this;
  }

  setApplicationId(id: string): this {
    this.activity.application_id = id;
    return this;
  }

  setDetails(details: string): this {
    this.activity.details = details;
    return this;
  }

  setState(state: string): this {
    this.activity.state = state;
    return this;
  }

  setEmoji(name: string, id?: string, animated?: boolean): this {
    this.activity.emoji = { name, id, animated };
    return this;
  }

  setParty(id?: string, size?: [number, number]): this {
    this.activity.party = {};
    if (id) this.activity.party.id = id;
    if (size) this.activity.party.size = size;
    return this;
  }

  setAssets(largeImage?: string, largeText?: string, smallImage?: string, smallText?: string): this {
    this.activity.assets = {
      large_image: largeImage,
      large_text: largeText,
      small_image: smallImage,
      small_text: smallText,
    };
    return this;
  }

  setSecrets(secrets: { join?: string; spectate?: string; match?: string }): this {
    this.activity.secrets = secrets;
    return this;
  }

  setInstance(value: boolean): this {
    this.activity.instance = value;
    return this;
  }

  setFlags(flags: number): this {
    this.activity.flags = flags;
    return this;
  }

  setButtons(buttons: Button[]): this {
    this.activity.buttons = buttons;
    return this;
  }

  build(): Presence {
    return this.activity;
  }
}

export class ButtonBuilder {
  private button: Button;

  constructor(label: string = "", url: string = "") {
    this.button = { label, url };
  }

  setLabel(label: string): ButtonBuilder {
    this.button.label = label;
    return this;
  }

  setURL(url: string): ButtonBuilder {
    this.button.url = url;
    return this;
  }

  build(): Button {
    return this.button;
  }
}


// Interfaces
export interface Presence {
  name: string;
  type: number;
  url?: string;
  created_at: number;
  timestamps?: {
    start?: number;
    end?: number;
  };
  application_id?: string;
  details?: string;
  state?: string;
  emoji?: {
    name: string;
    id?: string;
    animated?: boolean;
  };
  party?: {
    id?: string;
    size?: [number, number];
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  secrets?: {
    join?: string;
    spectate?: string;
    match?: string;
  };
  instance?: boolean;
  flags?: number;
  buttons?: Button[];
}

export interface Button { label: string; url: string; }


export default { 
  Client,
  ActivityBuilder,
  ButtonBuilder
} 