import React from 'react'
import SearchBar from './SearchBar'
import ConfigButton from './ConfigButton'
import HomeButton from "@components/NavBar/HomeButton";

export default function NavBar(): React.JSX.Element {
  return (
    <nav className='w-screen h-13 bg-transparent flex items-center'>
      <div className="ml-3.5">
        <HomeButton/>
      </div>
      <SearchBar/>
      <div className="ml-auto">
        <ConfigButton/>
      </div>
    </nav>
  )
}
