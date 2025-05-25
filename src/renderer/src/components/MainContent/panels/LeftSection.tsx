import React, { useState } from 'react'
import AddSVG from '@assets/icons/addSVG.svg?react'
import CreatePlaylistModal from '@components/MainContent/modules/CreatePlaylistModal'
import { Song } from '@components/MainContent/modules/CreatePlaylistModal'

type Playlist = {
  id: string;
  name: string;
  songs: string[];
}

interface LeftSectionProps {
  playlists: Playlist[];
  onCreatePlaylist: (name: string, songIds: string[]) => void;
}

export default function LeftSection({ playlists, onCreatePlaylist }: LeftSectionProps): React.JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = (): void => {
    setIsModalOpen(true)
  }

  const handleCloseModal = (): void => {
    setIsModalOpen(false)
  }

  const handleSavePlaylist = (name: string, songs: Song[]): void => {
    const songIds = songs.map(song => song.videoId)
    onCreatePlaylist(name, songIds)
  }

  return (
    <>
      <section
        id="left-section"
        className="w-full h-full bg-ui-dark-100 rounded-[12px] border border-ui-dark-200 p-4 flex flex-col"
      >
        <div
          id="left-player-area"
          className="hidden"
        >
        </div>

        <div id="playlist-area" className="h-full flex flex-col">
          <h2 className="text-xl font-semibold text-white mb-4">Your Playlists</h2>

          <button
            className="flex items-center gap-2 py-2 px-3 rounded-md bg-ui-dark-200 hover:bg-ui-dark-300 transition-colors mb-4"
            onClick={handleOpenModal}
          >
            <AddSVG className="w-5 h-5 text-white" />
            <span className="text-white">Create Playlist</span>
          </button>

          <div className="playlist-list flex-1 overflow-y-auto">
            {playlists.length > 0 ? (
              <ul className="space-y-2">
                {playlists.map(playlist => (
                  <li
                    key={playlist.id}
                    className="p-2 rounded hover:bg-ui-dark-300 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white">{playlist.name}</span>
                      <span className="text-ui-gray-100 text-sm">{playlist.songs.length} Songs</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-ui-gray-100 mt-8">
                <p>You dont have Playlists</p>
                <p className="text-sm mt-2">Make an Playlist to organize your Songs!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePlaylist}
      />
    </>
  )
}
