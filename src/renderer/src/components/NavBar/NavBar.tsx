import React from 'react'
import SearchBar from './modules/SearchBar'
import ConfigButton from './modules/ConfigButton'
import HomeButton from "./modules/HomeButton";

export default function NavBar(): React.JSX.Element {
  return (
    <nav className='w-screen h-13 bg-transparent flex items-center'>

      <section className="w-1/3"></section>
      
      <section className="w-1/3 flex items-center">
        <HomeButton />
        <SearchBar/>
      </section>
 
      <section className="w-1/3 flex items-center justify-end">
        <ConfigButton/>
      </section>

    </nav>
  )
}
