import { T_GLOBAL_SEARCH } from '@renderer/types'
import React from 'react'

import SongSmall from '../modules/SongSmall';
import ArtistCard from '../modules/ArtistCard';
import AlbumCard from '../modules/AlbumCard';
import SongThumbnail from '../modules/SongThumbnail';

import PlaySVG from "@assets/icons/player/PlaySVG.svg?react"


export default function GlobalSearch({ data }: { data: T_GLOBAL_SEARCH } ): React.JSX.Element {
  const { FirstArtist, ArtistAlbums, FirstSongs, RelatedArtist } = data;

  return (
    <div className='size-full overflow-y-auto block space-y-16'>

      {/* Main section */}
      <header className='h-3/8 flex'>
        {/* First artist sub-section */}
        <section className='w-1/2 h-full text-white'>
          <h1 className='h-2/12 pl-2 text-2xl font-bold'>Top Result</h1>
          
          <div className='w-full h-10/12 flex items-center justify-center relative transition-colors duration-200 group'>
            <section className='size-[calc(100%-16px)] rounded-xl bg-ui-dark-150 hover:brightness-110 hover:[&>*]:brightness-90 p-6 flex items-center'>
              <div className='lg:size-24 size-18 rounded-[6px]'>
                <SongThumbnail thumbnail={FirstArtist.thumbnails[1].url} />
              </div>

              <div className='truncate leading-tight ml-4 w-1/2'>
                <h1 className='pt-1 text-xl flex items-start font-medium truncate leading-tight'>{FirstArtist.name}</h1>
                <h2 className='flex items-start font-medium text-ui-gray-100 truncate leading-tight'>Artist</h2>
              </div>
            </section>

            <button
              className='
                absolute right-4 bottom-4 lg:size-14 size-10 rounded-full 
                opacity-0 pointer-events-none 
                transition-all duration-200 
                group-hover:opacity-100 group-hover:pointer-events-auto 
                bg-ui-pink-100
                hover:scale-110
              '
            >
              <PlaySVG className='lg:p-4 p-2 transition-colors duration-200 fill-black' />
            </button>
          </div>
        </section>
        
        {/* First songs sub-section */}
        <section className='w-1/2 h-full text-white'>
          <h1 className='h-2/12 pl-2 text-2xl font-bold'>Songs</h1>
          
          <div className='w-full h-10/12'>
            {FirstSongs.map(({ data, extra }) => (<SongSmall key={data.videoId} data={data} extra={extra}/>))}
          </div>
        </section>
      </header>

      {/* Related artist sections */}
      <section className='text-white'>
        <h1 className='h-2/12 pl-2 text-2xl font-bold'>Artists</h1>

        <div className='w-full h-10/12 flex pt-2 pb-2'>
          {RelatedArtist.map((artist) => (<ArtistCard key={artist.artistId} data={artist}/>))}
        </div>
      </section>


      {/* Related artist sections */}
      <section className='text-white'>
        <h1 className='h-2/12 pl-2 text-2xl font-bold'>Albums</h1>

        <div className='w-full h-10/12 flex pt-2 pb-2'>
          {ArtistAlbums.slice(0,5).map((album) => (<AlbumCard key={album.albumId} data={album}/>))}
        </div>
      </section>

    </div>
  )
}
