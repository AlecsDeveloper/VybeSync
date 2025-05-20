import React from 'react'
import type { T_ALBUM, T_SONG } from "@scripts/modules/SearchAPI";
import { durationFormat } from '@renderer/lib/Utils';
import SongSVG from "@assets/icons/Song.svg?react"

type Props = {
  song: T_SONG;
  album: T_ALBUM;
  index: number;
};

export default function SongItemLazy({ song, album, index }: Props): React.JSX.Element {
  const handleClickButton = (): Promise<void> => window.electron.ipcRenderer.invoke("music_bulk:getSourceAudio", { videoId: song.videoId, albumId: album.albumId });
 
  const thumbnail = album.albumThumbnails[0]?.url;

  const [hasError, setHasError] = React.useState(false);

  return (
    <div 
      id={song.videoId} 
      onClick={handleClickButton}
      className="w-[calc(100%-16px)] h-12 bg-transparent rounded-[12px] border-none mx-auto text-ui-gray-100 hover:bg-ui-dark-150 flex items-center"
    >
      <section className='w-12 flex items-center justify-center font-mono text-sm'>
        <h2>{index + 1}</h2>
      </section>

      <div className='size-8 bg-[#70707050] rounded-[4px] relative'>
        <img
          className='size-full rounded-[4px]'
          src={hasError ? "/src/assets/icons/blank.png" : thumbnail}
          alt="Song icon"
          onError={() => setHasError(true)}
        />

        {(hasError || !thumbnail) && (
          <div className="animate-pulse absolute inset-0 flex items-center justify-center">
            <SongSVG className='size-4 opacity-80 fill-ui-gray-100' />
          </div>
        )}
      </div>

      <section className='ml-4 overflow-hidden w-1/4'>
        <h4 className='truncate leading-tight'>{song.name}</h4>
        <h2 className='text-sm font-medium truncate leading-tight'>{album.albumBasicinfo.artist.name}</h2>
      </section>
   
      <section className='ml-6 overflow-hidden w-1/4'>
        <h2 className='truncate leading-tight text-ui-gray-200 py-1'>{album.albumBasicinfo.name ?? ""}</h2>
      </section>

      <section className='ml-6 overflow-hidden w-1/12 text-center'>
        <h2 className='truncate leading-tight text-ui-gray-200 py-1'>{durationFormat(song.duration ?? 0)}</h2>    
      </section>
    </div>
  );
}
