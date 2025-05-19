import React from 'react'
import AddSVG from '@assets/icons/addSVG.svg?react'

type Playlist = {
  id: string;
  name: string;
  songs: string[];
}

interface LeftSectionProps {
  playlists: Playlist[];
  onCreatePlaylist: () => void;
}

export default function LeftSection({ playlists, onCreatePlaylist }: LeftSectionProps): React.JSX.Element {
  return (
    <section
      id="left-section"
      className="w-full h-full bg-ui-dark-100 rounded-[12px] border border-ui-dark-200 p-4 flex flex-col"
    >
      {/* Área para el reproductor de música */}
      <div
        id="left-player-area"
        className="hidden" // Inicialmente oculto
      >
        {/* PlayerAPI renderizará aquí */}
      </div>

      {/* Área para las playlists */}
      <div id="playlist-area" className="h-full flex flex-col">
        <h2 className="text-xl font-semibold text-white mb-4">Your Playlists</h2>

        <button
          className="flex items-center gap-2 py-2 px-3 rounded-md bg-ui-dark-200 hover:bg-ui-dark-300 transition-colors mb-4"
          onClick={onCreatePlaylist}
        >
          <AddSVG className="w-5 h-5 text-white" />
          <span className="text-white">Make Playlist</span>
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
  )
}
