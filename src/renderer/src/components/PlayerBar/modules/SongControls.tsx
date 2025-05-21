import React, { useState, useEffect } from 'react'

import PlaySVG from "@assets/icons/player/PlaySVG.svg?react";
import PauseSVG from "@assets/icons/player/PauseSVG.svg?react";
import PrevSVG from "@assets/icons/player/PrevSVG.svg?react";
import NextSVG from "@assets/icons/player/NextSVG.svg?react";
import RepeatSVG from "@assets/icons/player/RepeatSVG.svg?react";
import ShufleSVG from "@assets/icons/player/ShufleSVG.svg?react";

type Props = {
  audioElement: HTMLAudioElement;
}

export default function SongControls({ audioElement }: Props): React.JSX.Element {
  const [ isPlaying, setIsPlaying ] = useState(false);
  const [ isRepeat, setIsRepeat ] = useState(false);
  const [ isShufle, setIsShufle ] = useState(false);
  const [ currentTime, setCurrentTime ] = useState(0);
  const [ duration, setDuration ] = useState(0);

  useEffect(() => {
    const updateTime = (): void => setCurrentTime(audioElement.currentTime);
    const updateDuration = (): void => setDuration(audioElement.duration);

    const handlePlay = (): void => setIsPlaying(true);
    const handlePause = (): void => setIsPlaying(false);

    const handleEnd = (): Promise<void> => window.electron.ipcRenderer.invoke("rpc:updateSongData", undefined);

    audioElement.addEventListener('timeupdate', updateTime);
    audioElement.addEventListener('loadedmetadata', updateDuration);
    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('ended', handleEnd);

    setIsPlaying(true);

    return () => {
      audioElement.removeEventListener('timeupdate', updateTime);
      audioElement.removeEventListener('loadedmetadata', updateDuration);
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('ended', handleEnd);
    };
  }, [audioElement]);

  const togglePlay = (): void => {
    if (audioElement.paused) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
  }

  const skip = (seconds: number): void => {
    audioElement.currentTime = Math.min(Math.max(audioElement.currentTime + seconds, 0), duration)
  }

  const repeat = (): void =>  {
    audioElement.loop = !audioElement.loop;
    setIsRepeat(audioElement.loop);
  }

  const shufle = (): void =>  {
    setIsShufle(!isShufle)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newTime = Number(e.target.value)
    audioElement.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (t: number): string =>
    `${Math.floor(t / 60).toString().padStart(2, '0')}:${Math.floor(t % 60).toString().padStart(2, '0')}`

  return (
    <div className="w-full h-full flex flex-col text-white">

      {/* Main Controls */}
      <section className="w-full flex items-center justify-center gap-8">

        {/* Shufle button */}
        <button onClick={shufle} title="Enable Shufle">
          <ShufleSVG className={`size-4 transition-colors duration-200 ${isShufle ? 'fill-green-400' : 'fill-ui-gray-100'}`} />
        </button>
        
        <section className='flex items-center justify-center gap-4'>
          {/* Previus button */}
          <button onClick={() => skip(-10)} title="Rewind 10s">
            <PrevSVG className='size-4 fill-ui-gray-100'/>
          </button>
          
          {/* Play/Pause button */}
          <button onClick={togglePlay} title="Play/Pause">
            {isPlaying 
              ? <PauseSVG className='size-6 fill-ui-gray-100'/> 
              : <PlaySVG className='size-6 fill-ui-gray-100'/>
            }
          </button>

          {/* Next button */}
          <button onClick={() => skip(10)} title="Forward 10s">
            <NextSVG className='size-4 fill-ui-gray-100'/>
          </button>
        </section>


        {/* Repeat button */}
        <button onClick={repeat} title="Enable Loop">
          <RepeatSVG className={`size-4 transition-colors duration-200 ${isRepeat ? 'fill-green-400' : 'fill-ui-gray-100'}`} />
        </button>

      </section>

      {/* Player time line */}
      <section className="w-full h-full flex items-center justify-center gap-4">
        <span className="h-full flex items-center text-sm">
          {formatTime(currentTime)}
        </span>

        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="
            w-4/5 h-1 appearance-none bg-transparent rounded-4xl
            [&::-webkit-slider-runnable-track]:h-1
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-3
            [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-green-400
            [&::-webkit-slider-thumb]:mt-[-4px]
            focus:outline-none
          "
          style={{
            background: `linear-gradient(to right, #34d399 ${((currentTime / duration) * 100) || 0}%, #e5e7eb ${((currentTime / duration) * 100) || 0}%)`
          }}
        />

        <span className="h-full flex items-center text-sm">
          {formatTime(duration)}
        </span>
      </section>
    </div>
  )
}