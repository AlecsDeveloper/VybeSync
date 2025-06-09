import React from 'react'
import ConfigSVG from '@assets/icons/ConfigSVG.svg?react'
import { $ } from '@lib/Utils'

export default function ConfigButton(): React.JSX.Element {
  const handleConfigDialog = (): void => $("#config-dialog")?.setAttribute("open", "");

  return (
    <button
      onClick={handleConfigDialog}
      className='size-13 flex items-center justify-center'
    >
      <ConfigSVG className='stroke-ui-gray-100 size-8 hover:stroke-white hover:scale-110 duration-200 ease-in-out'
    />
    </button>
  )
}
