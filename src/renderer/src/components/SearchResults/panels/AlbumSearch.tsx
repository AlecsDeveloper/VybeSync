import React, { useEffect, useState } from 'react'
import SongThumbnail from '../modules/SongThumbnail'
import { $, timeFormat } from '@renderer/lib/Utils'
import SongGeneral from '../modules/SongGeneral'
import Color from '@renderer/lib/Color'
import { ThumbnailDialog } from '@renderer/components/Dialogs'
import type { T_ALBUM_SEARCH } from '@renderer/types'
import QueueAPI, { type QueueItem } from '@renderer/scripts/modules/QueueAPI'

import PlaySVG from "@assets/icons/player/PlaySVG.svg?react"


export default function AlbumSearch({ data }: { data: T_ALBUM_SEARCH }): React.JSX.Element {
  const { AlbumID, AlbumSongs, AlbumThumbnails, AlbumArtist, AlbumYear, AlbumName, AlbumRaw } = data;
  
  const SongLength = AlbumSongs.length;
  const AlbumDuration = AlbumSongs.reduce((acc, s) => acc + (s.data.duration || 0), 0);

  const [ hexColor, setHexColor ] = useState<string>('#000');
  const [ contrastColor, setContrastColor] = useState<number>(0);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = AlbumThumbnails[0].url;

    img.onload = () => {
      const avgColor = Color.getAverageColor(img, 4);
      const saturatedColor = Color.saturate(avgColor, 2);
      const hex = Color.rgbToHex(saturatedColor);
      const contrast = Color.getContrastColor(saturatedColor);
      setHexColor(hex);
      setContrastColor(contrast);
    };
  }, [AlbumThumbnails]);

  // Play Album
  const handlePlayAlbum = (): void => {
    QueueAPI.clearQueue();
  
    const AlbumQueue: QueueItem[] = AlbumSongs.map((s) => ({
      videoId: s.data.videoId,
      albumId: AlbumRaw.albumId
    }));

    QueueAPI.addBulkToQueue(AlbumQueue);
    QueueAPI.initQueue();
  };

  const handleThumbnailDialog = (): void => $("#thumbnail-dialog")?.setAttribute("open", "");

  // Component
  return (
    <div id={AlbumID} className='size-full -mt-4 overflow-y-auto block'>
      <header
        className='h-2/4'
        style={{
          background: `linear-gradient(to bottom, ${hexColor}, transparent 100%)`
        }}
      >
        {/* Album data sub-section */}
        <section className='flex items-center pt-4'>
          <div 
            onClick={handleThumbnailDialog}
            className='sm:size-30 sm:m-4 lg:size-42 lg:m-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.75)]'
          >
            <SongThumbnail thumbnail={AlbumThumbnails[1]?.url}/>
          </div>

          <div className='text-white w-2/3'>
            <h4 className='text-ui-gray-100 ml-2'>Album</h4>
            <h1 className='font-bold text-7xl truncate leading-tight'>{AlbumName}</h1>

            <section className='flex items-center pt-2 ml-2 h-10'>
              <h4 className='font-bold'>{AlbumArtist.name}</h4>
              <span className='font-bold px-2'>•</span>
              <h4>{AlbumYear}</h4>
              <span className='font-bold px-2'>•</span>
              <h4>{SongLength} songs, {timeFormat(AlbumDuration)}</h4>
            </section>
          </div>
        </section>

        {/* Album controls section */}
        <section className='h-1/4 flex items-center'>
          <button 
            onClick={handlePlayAlbum}
            style={{ backgroundColor: hexColor }}
            className={`size-16 rounded-full flex items-center justify-center ml-6 hover:brightness-125`}
          >
            <PlaySVG 
              className={`p-4`}
              style={{ fill: contrastColor ? '#aaaaaa' : '#202020' }}
            />
          </button>
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

      <ThumbnailDialog thumbail={AlbumThumbnails[1]?.url}/>
    </div>
  );
}
