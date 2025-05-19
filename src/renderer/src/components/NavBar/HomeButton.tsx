import React from 'react'
import HomeSVG from '@assets/icons/HomeSVG.svg?react'
import { $ } from '@renderer/lib/Utils'
import SearchAPI from '@renderer/scripts/modules/SearchAPI'

export default function HomeButton(): React.JSX.Element {
  const handleHomeNavigation = (): void => {
    SearchAPI.setResults([]);

    const searchInput = $("input[type='text']") as HTMLInputElement | null;
    if (searchInput) {
      searchInput.value = '';
    }

    console.log('Navigated to home');
  }

  return (
    <button
      onClick={handleHomeNavigation}
      className='size-13 flex items-center justify-center'
    >
      <HomeSVG className='stroke-ui-gray-100 size-8 hover:stroke-white hover:scale-110 duration-200 ease-in-out' />
    </button>
  )
}
