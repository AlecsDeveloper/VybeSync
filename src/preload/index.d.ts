import { ElectronAPI } from '@electron-toolkit/preload'

type VybesyncAPI = {
  on: (channel: string, callback: (...args: unknown[]) => void) => void
  send: (channel: string, ...args: unknown[]) => void
  once: (channel: string, callback: (...args: unknown[]) => void) => void
}

type ConfigAPI = {
  get: () => Record<string, unknown>;
  set: (partial: Record<string, unknown>) => void;
}


declare global {
  interface Window {
    electron: ElectronAPI
    vybesync: VybesyncAPI
    config: ConfigAPI
  }
}
