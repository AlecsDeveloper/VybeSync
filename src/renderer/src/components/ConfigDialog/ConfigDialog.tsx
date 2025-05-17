import { $ } from '@lib/Utils';
import React from 'react'
import CloseSVG from '@assets/icons/CloseSVG.svg?react'

export default function ConfigDialog(): React.JSX.Element {
  const handleConfigDialog = (): void => $("#config-dialog")?.removeAttribute("open");

  return (
    <dialog
      id="config-dialog"
      className={`
        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[80%] h-[80%] outline-none border-none rounded-lg
        bg-ui-dark-150 shadow-[5px_5px_10px_rgba(0,0,0,0.5)]
      `}
    >
      <button
        onClick={handleConfigDialog}
        className="h-[40px] flex items-center justify-center"
      >
        <CloseSVG className='h-[70%] stroke-ui-gray-100 hover:stroke-white hover:scale-110 duration-200 ease-in-out'/>
      </button>
    </dialog>
  )
}
