import React from 'react'
import type { T_ARTIST } from '@renderer/types'

import PlaySVG from "@assets/icons/player/PlaySVG.svg?react"
import SongThumbnail from './SongThumbnail'

export default function ArtistCard({ data }: { data: T_ARTIST }): React.JSX.Element {
  return (
    <div className='w-1/5 pt-4 pb-4 rounded-[8px] bg-ui-dark-100 hover:bg-ui-dark-150 transition-colors duration-200 group'>

      <section className='w-full flex items-center justify-center relative'>

        <div className='w-8/9'>
          <SongThumbnail thumbnail={data.thumbnails[1].url} shape='circle'/>
        </div>

        <button
          className='
            absolute right-2 bottom-2 size-12 rounded-full 
            opacity-0 pointer-events-none 
            transition-all duration-200 
            group-hover:opacity-100 group-hover:pointer-events-auto 
            bg-ui-pink-100
            hover:scale-110
          '
        >
          <PlaySVG className='p-3 transition-colors duration-200 fill-black' />
        </button>

      </section>

      <section className='p-2 mt-4'>
        <h1 className='font-medium truncate leading-tight'>{data.name}</h1>
        <h2 className='text-ui-gray-100'>Artist</h2>
      </section>
    </div>
  )
}
