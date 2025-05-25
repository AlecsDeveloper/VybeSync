import React from 'react'

import SongSVG from "@assets/icons/Song.svg?react"


export default function SongThumbnail({ thumbnail }: { thumbnail: string | undefined }): React.JSX.Element {
  const [ hasError, setHasError ] = React.useState(false);

  return (
    <div className='size-full relative bg-[#70707050] rounded-[4px]'>
      <img
        className='size-full rounded-[4px]'
        src={hasError || !thumbnail ? "/src/assets/icons/blank.png" : thumbnail}
        alt="Song icon"
        onError={() => setHasError(true)}
      />

      {(hasError || !thumbnail) && (
        <div className="animate-pulse absolute inset-0 flex items-center justify-center">
          <SongSVG className='size-1/3 opacity-80 fill-ui-gray-100' />
        </div>
      )}
    </div>
  )
}
