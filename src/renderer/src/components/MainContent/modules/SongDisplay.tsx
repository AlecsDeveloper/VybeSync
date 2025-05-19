import React from 'react'
import SongSVG from "@assets/icons/Song.svg?react"

type Props = {
  thumbnail: string;
  title: string;
  artist: string;
};

export default function SongDisplay({ thumbnail, title, artist }: Props): React.JSX.Element {
  return (
    <div>
      <div
        className='size-full bg-[#70707050] rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.75)] relative z-10 overflow-hidden'
      >
        <img
          className='size-full rounded-2xl'
          src={thumbnail || "/src/assets/icons/blank.png"}
          alt="Song icon"
        />

        {!thumbnail && (
          <div
            className="animate-pulse absolute inset-0 flex items-center justify-center"
          >
            <SongSVG className='size-40 opacity-80 fill-ui-gray-100' />
          </div>
        )}
      </div>

      <section className='overflow-hidden mt-10'>
        <h4 className='text-2xl truncate leading-tight text-white'>{title}</h4>
        <h2 className='text-xl font-medium truncate leading-tight text-ui-gray-100'>{artist}</h2>
      </section>
    </div>
  )
}
