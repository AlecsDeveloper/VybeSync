import { ElectronAPI } from '@electron-toolkit/preload'

type VybesyncAPI = {
  on: (channel: string, callback: (...args: unknown[]) => void) => void
  send: (channel: string, ...args: unknown[]) => void
  once: (channel: string, callback: (...args: unknown[]) => void) => void
  // Agrega más métodos si los usas
}

declare global {
  interface Window {
    electron: ElectronAPI
    vybesync: VybesyncAPI
  }
}
