import React from 'react'
import type { Song } from "@scripts/modules/SearchAPI";

type Props = {
  song: Song;
};

export default function SongItem({ song }: Props): React.JSX.Element {
  const handleClickButton = (): Promise<void> => window.electron.ipcRenderer.invoke("youtube:getSource", { videoId: song.videoId });

  return (
    <div 
      id={song.videoId} 
      onClick={handleClickButton}
      className="w-[calc(100%-16px)] h-20 bg-transparent rounded-[12px] border-none mx-auto text-ui-gray-100 hover:bg-ui-dark-150 flex items-center"
    >
      <img src={song.thumbnails[0].url} className='size-18 rounded-[12px] ml-0.5 p-2' />
      <section className='ml-4'>
        <h4>{song.name}</h4>
        <h2 className='font-medium'>{song.artist.name}</h2>
      </section>
    </div>
  );
}
