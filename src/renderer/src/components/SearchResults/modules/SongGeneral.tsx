import React from 'react'
import type { T_ALBUM, T_SONG, T_THUMBNAIL } from '@renderer/types'
import SongThumbnail from './SongThumbnail';
import { durationFormat } from '@renderer/lib/Utils';

import HeartSVG from "@assets/icons/songs/HeartSVG.svg?react"

type Props = { 
  song: { 
    data: T_SONG, 
    extra: { liked: boolean }
  };
  album: T_ALBUM;
  index: number;
  albumThumbnails?: T_THUMBNAIL[];
} 

export default function SongGeneral({ song, album, index, albumThumbnails }: Props): React.JSX.Element {
  const handleClickButton = (): Promise<void> => window.electron.ipcRenderer.invoke("song:pushSong", [ song.data.videoId, album.albumId ]);

  const thumbnail = albumThumbnails ? albumThumbnails[0].url : song.data.thumbnails[0].url;

  const [ isLiked, setIsLiked ] = React.useState(song.extra.liked);
    
  const handleLike = (like: boolean): void => {
    window.electron.ipcRenderer.invoke("song:updateSong", { 
      video_id: song.data.videoId,
      song_name: song.data.name,
      album_id: album.albumId,
      duration: song.data.duration,
      liked: Number(like)
    });
  }
  
  return (
    <div 
      id={song.data.videoId}
      onClick={handleClickButton}
      className='w-[calc(100%-16px)] h-14 bg-transparent rounded-[12px] border-none mx-auto text-ui-gray-100 hover:bg-[#70707050] flex items-center [&>.like-btn]:stroke-0 hover:[&>.like-btn]:stroke-2'
    >
      <section className='w-10 flex items-center justify-center font-bold text-sm'>
        <h2>{index + 1}</h2>
      </section>

      <div className='size-10 bg-[#70707050] rounded-[4px] relative'>
        <SongThumbnail thumbnail={thumbnail}/>
      </div>

      <section className='ml-4 overflow-hidden w-1/4'>
        <h4 className='truncate leading-tight'>{song.data.name}</h4>
        <h2 className='text-sm font-medium truncate leading-tight'>{song.data.artist.name}</h2>
      </section>

      <section className='ml-6 overflow-hidden w-1/5'>
        <h2 className='truncate leading-tight text-ui-gray-200 py-1'>{album.name ?? ""}</h2>
      </section>

      <section className='ml-6 overflow-hidden w-1/12 text-center'>
        <h2 className='truncate leading-tight text-ui-gray-200 py-1'>{durationFormat(song.data.duration ?? 0)}</h2>    
      </section>

      <button
        className='like-btn ml-8 size-6 flex items-center justify-center'
        onClick={(e) => {
          e.stopPropagation();
          setIsLiked(!isLiked);
          handleLike(!isLiked);
        }}
      >
        <HeartSVG
          className={`like-btn size-5 transition-all duration-200 hover:brightness-125 ${
            isLiked
              ? 'fill-ui-pink-100 stroke-transparent'
              : 'fill-transparent stroke-ui-gray-100'
          }`}
        />
      </button>
    </div>
  )
}
