class PlaylistSearchAPIClass {


  public async search(query: string): Promise<void> {
    if (!query.trim()) return
    window.electron.ipcRenderer.invoke('music:getPlaylistResults', { query })
  }
}

const PlaylistSearchAPI = new PlaylistSearchAPIClass()
export default PlaylistSearchAPI
