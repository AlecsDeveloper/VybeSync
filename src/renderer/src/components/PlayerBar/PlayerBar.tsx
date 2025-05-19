import React from 'react'

export default function PlayerBar(): React.JSX.Element {
  return (
    <div 
      id='player-bar'
      className='w-screen h-18 relative flex items-center justify-center overflow-hidden'
    >
      <section 
        id='player-preview' 
        className='w-1/4 h-[70%] absolute left-0 ml-4' 
      />
      
      <section
        id='player-controls' 
        className='w-1/3 h-[70%]'
      />
      
      <section
        id='player-config'
        className='w-1/4 h-[70%] absolute right-0 mr-4'
      />
    
      <div id='audio-container' className='hidden'/>
    </div>
  )
}
