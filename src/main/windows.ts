import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow } from "electron"
import { createMainWindow } from './window/mainWindow'
import { initDiscord, destroyDiscord } from './rich-presence';


// App initialization
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createMainWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })

  initDiscord();
})

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') return;
  destroyDiscord();
  app.quit()
})
