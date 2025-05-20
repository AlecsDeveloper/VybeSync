import React, { useState } from 'react'
import SearchSVG from '@assets/icons/SearchSVG.svg?react'
import SearchAPI from '@scripts/modules/SearchAPI'

export default function SearchBar(): React.JSX.Element {
  const [query, setQuery] = useState('')

  const handleSubmit = (): void=> {
    if (!query.trim()) return;

    SearchAPI.getBulkResults(query);
  }

  const handleFormSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    handleSubmit()
  }

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex items-center justify-center w-1/4 h-[80%] px-5 bg-ui-dark-100 border rounded-[24px]"
    >
      <input
        type="text"
        name="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="What do you want to play?"
        className="w-[90%] h-full bg-transparent outline-none border-none text-white font-vybesync text-[14px] placeholder:text-zinc-450"
      />

      <button type="submit" className="hidden">
        Search
      </button>

      <SearchSVG
        onClick={handleSubmit}
        className="h-[80%] stroke-ui-gray-100 relative left-2.5 cursor-pointer transition hover:stroke-white hover:scale-110 duration-200 ease-in-out"
      />
    </form>
  )
}
