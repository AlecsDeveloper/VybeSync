import React from 'react'
import SongSVG from "@assets/icons/Song.svg?react"

type Props = {
  thumbnail: string;
  title: string;
  artist: string;
  album: string;
  album_thumbnail: string;
};

export default function SongDisplay({ thumbnail, title, artist, album, album_thumbnail }: Props): React.JSX.Element {
  const [hasError, setHasError] = React.useState(false);

  return (
    <div>
      <div
        className='size-full bg-[#70707050] rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.75)] relative z-10 overflow-hidden'
      >
        <img
          id='pp-img'
          className='size-full rounded-2xl'
          src={hasError ? "/src/assets/icons/blank.png" : thumbnail}
          alt="Song icon"
          onError={() => setHasError(true)}
        />

        {(hasError || !thumbnail) && (
          <div className="animate-pulse absolute inset-0 flex items-center justify-center">
            <SongSVG className='size-40 opacity-80 fill-ui-gray-100' />
          </div>
        )}
      </div>

      <section className='overflow-hidden mt-6'>
        <h4 id='pp-title' className='text-2xl font-semibold truncate leading-tight text-white' {... { album, album_thumbnail } }>{title}</h4>
        <h2 id='pp-artist' className='text-xl font-medium truncate leading-tight text-ui-gray-100'>{artist}</h2>
      </section>
    </div>
  )
}
