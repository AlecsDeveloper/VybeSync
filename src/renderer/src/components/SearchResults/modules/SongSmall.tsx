import { T_SONG } from '@renderer/types'
import React from 'react'

import HeartSVG from "@assets/icons/songs/HeartSVG.svg?react"
import SongThumbnail from './SongThumbnail';


type ExtraData = {
  liked: boolean;
}

export default function SongSmall({ data, extra }: { data: T_SONG, extra: ExtraData }): React.JSX.Element {
  const handleClickButton = (): Promise<void> => window.electron.ipcRenderer.invoke("music_bulk:getSourceAudio", { videoId: data.videoId, albumId: data.album?.albumId });
  const [ isLiked, setIsLiked ] = React.useState(extra.liked);

  const handleLike = (like: boolean): void => {
    window.electron.ipcRenderer.invoke("song:updateSong", { 
      video_id: data.videoId,
      song_name: data.name,
      album_id: data.album?.albumId,
      duration: data.duration,
      liked: Number(like)
    });
  }

  const thumbnail = data.thumbnails[0]?.url;

  return (
    <div
      id={data.videoId} 
      onClick={handleClickButton} 
      className='w-full h-1/4 hover:bg-ui-dark-150 rounded-[8px] duration-200 transition-colors flex items-center [&>.like-btn]:stroke-0 hover:[&>.like-btn]:stroke-2'
    >

      <div className='lg:size-13 size-10 p-1 rounded-[8px] '>
        <SongThumbnail thumbnail={thumbnail}/>
      </div>

      <section className='w-1/2 ml-2 truncate leading-tight'>
        <h1 className='font-medium'>{data.name}</h1>
        <h2 className='text-ui-gray-100'>{data.artist.name}</h2>
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
