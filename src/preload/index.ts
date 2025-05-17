import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {}
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);

    type Callback = (data: unknown) => void;

    const listeners: Record<string, Callback[]> = {};

    ipcRenderer.on("vybesync:event", (_, { type, payload }) => {
      listeners[type]?.forEach(cb => cb(payload));
    });

  contextBridge.exposeInMainWorld("vybesync", {
    on: (type: string, callback: Callback) => {
      if (!listeners[type]) listeners[type] = [];
      listeners[type].push(callback);
    }
  });

  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}