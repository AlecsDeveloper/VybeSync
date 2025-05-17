import React from 'react'
import SearchBar from './SearchBar'
import ConfigButton from './ConfigButton'

export default function NavBar(): React.JSX.Element {
  
  return (
    <nav className='w-screen h-13 bg-transparent flex items-center'>
      <ConfigButton />
      <SearchBar />
    </nav>
  )
}
