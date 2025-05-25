import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { vybeSync } from './modules/event'
import { configAPI } from './modules/config'

const api = {}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
    contextBridge.exposeInMainWorld('vybesync', vybeSync);
    contextBridge.exposeInMainWorld('config', configAPI);
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}