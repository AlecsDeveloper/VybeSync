import SongThumbnail from '@renderer/components/SearchResults/modules/SongThumbnail';
import { $ } from '@renderer/lib/Utils';
import React from 'react'

type Props = {
  thumbail: string;
}

export default function ThumbnailDialog({ thumbail }: Props): React.JSX.Element {
  const handleThumbnailDialog = (): void => $("#thumbnail-dialog")?.removeAttribute("open");

  return (
    <dialog
      id="thumbnail-dialog"
      onClick={handleThumbnailDialog}
      className={`
        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-full h-full outline-none border-none rounded-lg
        bg-transparent flex items-center justify-center
        backdrop-blur-3xl
      `}
    >
      <section
        className="shadow-[0_25px_50px_-12px_rgba(0,0,0,0.75)]"
      >
        <SongThumbnail thumbnail={thumbail}/> 
      </section>
    </dialog>
  )
}
