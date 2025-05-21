import React from 'react'
import SongSVG from "@assets/icons/Song.svg?react"

type Props = {
  thumbnail: string;
  title: string;
  artist: string;
};

export default function SongPreview({ thumbnail, title, artist }: Props): React.JSX.Element {
  const [hasError, setHasError] = React.useState(false);

  return (
    <div className='size-full flex items-center'>

      <div className='size-15'>
        <img
          id='pp-img'
          className='size-full rounded-[6px]'
          src={hasError ? "/src/assets/icons/blank.png" : thumbnail}
          alt="Song icon"
          onError={() => setHasError(true)}
        />

        {(hasError || !thumbnail) && (
          <div className="animate-pulse absolute inset-0 flex items-center justify-center">
            <SongSVG className='size-8 opacity-80 fill-ui-gray-100' />
          </div>
        )}
      </div>

      <section className='w-2/3 h-full ml-4'>
        <h2 className='h-1/2 truncate leading-tight text-white text-sm flex items-center'>{title}</h2>
        <h4 className='h-1/2 truncate leading-tight text-ui-gray-100 text-sm flex items-center'>{artist}</h4>
      </section>
    </div>
  )
}
