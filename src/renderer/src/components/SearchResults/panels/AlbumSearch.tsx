import React, { useEffect, useState } from 'react'
import type { T_ALBUM_SEARCH } from '@renderer/types'
import SongThumbnail from '../modules/SongThumbnail'
import { timeFormat } from '@renderer/lib/Utils'
import SongGeneral from '../modules/SongGeneral'
import Color from '@renderer/lib/Color'

export default function AlbumSearch({ data }: { data: T_ALBUM_SEARCH }): React.JSX.Element {
  const { AlbumID, AlbumSongs, AlbumThumbnails, AlbumArtist, AlbumYear, AlbumName, AlbumRaw } = data;
  
  const SongLength = AlbumSongs.length;
  const AlbumDuration = AlbumSongs.reduce((acc, s) => acc + (s.data.duration || 0), 0);

  const [hexColor, setHexColor] = useState<string>('#000');

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = AlbumThumbnails[0].url;

    img.onload = () => {
      const avgColor = Color.getAverageColor(img, 4);
      const saturatedColor = Color.saturate(avgColor, 2);
      const hex = Color.rgbToHex(saturatedColor);
      setHexColor(hex);
    };
  }, [AlbumThumbnails]);

  return (
    <div id={AlbumID} className='size-full -mt-4 overflow-y-auto block'>
      <header
        className='h-2/4 flex items-center'
        style={{
          background: `linear-gradient(to bottom, ${hexColor}, transparent 100%)`
        }}
      >
        <div className='sm:size-30 sm:m-4 lg:size-42 lg:m-6'>
          <SongThumbnail thumbnail={AlbumThumbnails[1]?.url}/>
        </div>

        <section className='text-white w-2/3 truncate leading-tight'>
          <h4 className='text-ui-gray-100 ml-2'>Album</h4>
          <h1 className='font-bold text-7xl'>{AlbumName}</h1>

          <section className='flex items-center pt-2 ml-2 h-10'>
            <h4 className='font-bold'>{AlbumArtist.name}</h4>
            <span className='font-bold px-2'>•</span>
            <h4>{AlbumYear}</h4>
            <span className='font-bold px-2'>•</span>
            <h4>{SongLength} songs, {timeFormat(AlbumDuration)}</h4>
          </section>
        </section>
      </header>

      <section className='h-2/3'>
        {AlbumSongs.map((song, index) => (
          <SongGeneral 
            key={song.data.videoId} 
            song={song} 
            album={AlbumRaw} 
            index={index} 
            albumThumbnails={AlbumThumbnails}
          />
        ))}
      </section>
    </div>
  );
}
