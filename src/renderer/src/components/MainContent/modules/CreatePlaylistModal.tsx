import React, { useState, useEffect, useCallback } from 'react'
import SearchSVG from '@assets/icons/SearchSVG.svg?react'
import AddSVG from '@assets/icons/addSVG.svg?react'
import PlaylistSearchAPI from '@scripts/modules/PlaylistSearchAPI'

interface CreatePlaylistModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string, songs: Song[]) => void
}

export type Song = {
  type: "SONG";
  name: string;
  videoId: string;
  artist: { artistId: string | null; name: string; };
  album: { name: string; albumId: string; } | null;
  duration: number | null;
  thumbnails: { url: string; width: number; height: number; }[];
};


export default function CreatePlaylistModal({ isOpen, onClose, onSave }: CreatePlaylistModalProps): React.JSX.Element {
  const [playlistName, setPlaylistName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Song[]>([])
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([])

  // Define callback for handling search results
  const handleSearchResults = useCallback((_event: unknown, data: Song[]): void => {
    setSearchResults(data)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    // Listen specifically for playlist search results
    window.electron.ipcRenderer.on('music:playlistSearchResults', handleSearchResults)

    return () => {
      // Clean up listener when component unmounts or modal closes
      window.electron.ipcRenderer.removeListener('music:playlistSearchResults', handleSearchResults)
    }
  }, [isOpen, handleSearchResults])

  const handleSearch = (): void => {
    if (!searchQuery.trim()) return
    PlaylistSearchAPI.search(searchQuery)
  }

  const handleAddSong = (song: Song): void => {
    if (!selectedSongs.some(s => s.videoId === song.videoId)) {
      setSelectedSongs([...selectedSongs, song])
    }
  }

  const handleRemoveSong = (videoId: string): void => {
    setSelectedSongs(selectedSongs.filter(song => song.videoId !== videoId))
  }

  const handleSavePlaylist = (): void => {
    if (!playlistName.trim() || selectedSongs.length === 0) return
    onSave(playlistName, selectedSongs)
    // Reset form and close modal
    setPlaylistName('')
    setSearchQuery('')
    setSelectedSongs([])
    onClose()
  }

  if (!isOpen) return <></>

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-ui-dark-100 rounded-xl border border-ui-dark-200 w-[80%] h-[80%] flex flex-col p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-white">Create Playlist</h2>
          <button
            onClick={onClose}
            className="text-ui-gray-100 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="flex h-full gap-5">
          {/* Left side - Playlist details */}
          <div className="w-1/3 flex flex-col">
            <div className="mb-4">
              <label htmlFor="playlist-name" className="block text-white mb-2">Playlist Name</label>
              <input
                id="playlist-name"
                type="text"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="My Awesome Playlist"
                className="w-full bg-ui-dark-200 border border-ui-dark-200 rounded-md p-2 text-white focus:outline-none focus:border-gray-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              <h3 className="text-white mb-2">Selected Songs ({selectedSongs.length})</h3>
              {selectedSongs.length > 0 ? (
                <ul className="space-y-2">
                  {selectedSongs.map(song => (
                    <li
                      key={song.videoId}
                      className="flex items-center justify-between bg-ui-dark-200 p-2 rounded-md text-white"
                    >
                      <div className="flex items-center">
                        <img
                          src={song.thumbnails[0]?.url}
                          alt={song.name}
                          className="w-10 h-10 rounded mr-2"
                        />
                        <div>
                          <p className="text-sm truncate w-48">{song.name}</p>
                          <p className="text-xs text-ui-gray-100">{song.artist.name}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveSong(song.videoId)}
                        className="text-ui-gray-100 hover:text-white"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-ui-gray-100 mt-8">
                  <p>No songs added</p>
                  <p className="text-sm mt-2">Search and add songs to your playlist!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Song search */}
          <div className="w-2/3 flex flex-col">
            <div className="flex items-center mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for songs..."
                className="flex-1 bg-ui-dark-200 border border-ui-dark-200 rounded-md p-2 text-white focus:outline-none focus:border-gray-500"
              />
              <button
                onClick={handleSearch}
                className="ml-2 p-2 rounded-md bg-ui-dark-200 hover:bg-ui-dark-300"
              >
                <SearchSVG className="w-5 h-5 stroke-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {searchResults.length > 0 ? (
                <ul className="space-y-2">
                  {searchResults.map(song => (
                    <li
                      key={song.videoId}
                      className="flex items-center justify-between bg-ui-dark-200 p-2 rounded-md text-white hover:bg-ui-dark-300 cursor-pointer"
                    >
                      <div className="flex items-center">
                        <img
                          src={song.thumbnails[0]?.url}
                          alt={song.name}
                          className="w-12 h-12 rounded mr-3"
                        />
                        <div>
                          <p>{song.name}</p>
                          <p className="text-sm text-ui-gray-100">{song.artist.name}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddSong(song)}
                        className="text-white hover:scale-110 transition-transform"
                      >
                        <AddSVG className="w-5 h-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-ui-gray-100 mt-8">
                  <p>No search results</p>
                  <p className="text-sm mt-2">Search for songs to add to your playlist!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="mr-2 py-2 px-4 rounded-md bg-ui-dark-200 text-white hover:bg-ui-dark-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSavePlaylist}
            disabled={!playlistName.trim() || selectedSongs.length === 0}
            className={`py-2 px-4 rounded-md bg-ui-dark-200 text-white flex items-center gap-2 ${
              playlistName.trim() && selectedSongs.length > 0
                ? 'hover:bg-ui-dark-300'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <AddSVG className="w-5 h-5" />
            Save Playlist
          </button>
        </div>
      </div>
    </div>
  )
}
