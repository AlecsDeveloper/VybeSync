import { ipcRenderer } from 'electron'

type Callback = (data: unknown) => void
const listeners: Record<string, Callback[]> = {}

ipcRenderer.on("vybesync:event", (_, { type, payload }) => {
  listeners[type]?.forEach(cb => cb(payload))
})

export const vybeSync = {
  on: (type: string, callback: Callback) => {
    if (!listeners[type]) listeners[type] = []
    listeners[type].push(callback)
  }
}
