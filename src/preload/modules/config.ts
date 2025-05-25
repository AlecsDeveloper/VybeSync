import fs from 'fs'
import path from 'path'
import { ipcRenderer } from 'electron'

const getConfigPath = async (): Promise<string> => {
  const userDataPath = await ipcRenderer.invoke('get-user-config-path')
  return path.join(userDataPath, 'user-config.json')
}

async function loadConfig(): Promise<ConfigData> {
  try {
    const file = await getConfigPath()
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch {
    return { shuffle: false, repeat: false, lastPlayed: null }
  }
}

async function saveConfig(config: ConfigData): Promise<void> {
  const file = await getConfigPath()
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(config, null, 2))
}

let cache: ConfigData = { shuffle: false, repeat: false, lastPlayed: null }

loadConfig().then(c => (cache = c))

export const configAPI = {
  get: () => cache,
  set: (partial: ConfigData) => {
    const merged = { ...cache, ...partial }
    cache = merged
    saveConfig(merged)
  }
}

export type ConfigData = {
  shuffle: boolean
  repeat: boolean
  lastPlayed: string | null
}
