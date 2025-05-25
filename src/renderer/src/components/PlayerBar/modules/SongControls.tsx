import React, { useState, useEffect } from 'react'

import PlaySVG from "@assets/icons/player/PlaySVG.svg?react";
import PauseSVG from "@assets/icons/player/PauseSVG.svg?react";
import PrevSVG from "@assets/icons/player/PrevSVG.svg?react";
import NextSVG from "@assets/icons/player/NextSVG.svg?react";
import RepeatSVG from "@assets/icons/player/RepeatSVG.svg?react";
import ShuffleSVG from "@assets/icons/player/ShuffleSVG.svg?react";

type Props = {
  audioElement: HTMLAudioElement;
}

export default function SongControls({ audioElement }: Props): React.JSX.Element {
  const config = window.config.get() as { repeat?: boolean; shuffle?: boolean };
  const configShuffle = config.shuffle ?? false;
  const configRepeat = config.repeat ?? false;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeat, setIsRepeat] = useState(configRepeat);
  const [isShuffle, setIsShuffle] = useState(configShuffle);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const updateTime = (): void => setCurrentTime(audioElement.currentTime);
    const updateDuration = (): void => setDuration(audioElement.duration);

    const handlePlay = (): void => setIsPlaying(true);
    const handlePause = (): void => setIsPlaying(false);

    const handleEnd = (): void => {
      console.log("next_song");
    };

    audioElement.loop = configRepeat;

    audioElement.addEventListener('timeupdate', updateTime);
    audioElement.addEventListener('loadedmetadata', updateDuration);
    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('ended', handleEnd);

    return () => {
      audioElement.removeEventListener('timeupdate', updateTime);
      audioElement.removeEventListener('loadedmetadata', updateDuration);
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('ended', handleEnd);
    };
  }, [audioElement, configRepeat]);



  const togglePlay = (): void => {
    if (!isPlaying) audioElement.play();
    else audioElement.pause();
  }

  const skip = (seconds: number): void => {
    audioElement.currentTime = Math.min(Math.max(audioElement.currentTime + seconds, 0), duration);
  }

  const toggleRepeat = (): void => {
    const newRepeat = !isRepeat;

    setIsRepeat(newRepeat);
    audioElement.loop = newRepeat;
    window.config.set({ repeat: newRepeat });
  }

  const toggleShuffle = (): void => {
    const newShuffle = !isShuffle;
    
    setIsShuffle(newShuffle);
    window.config.set({ shuffle: newShuffle });
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newTime = Number(e.target.value);
    audioElement.currentTime = newTime;
    setCurrentTime(newTime);
  }

  const formatTime = (t: number): string =>
    `${Math.floor(t / 60).toString().padStart(2, '0')}:${Math.floor(t % 60).toString().padStart(2, '0')}`

  const iconBase = "size-4 transition-colors duration-200 hover:brightness-125"
  const iconStatic = "fill-ui-gray-100 " + iconBase;

  return (
    <div className="w-full h-full flex flex-col text-white">
      <section className="w-full flex items-center justify-center gap-8">
        {/* Shuffle */}
        <button
          onClick={toggleShuffle}
          title="Enable Shuffle"
          aria-label="Enable Shuffle"
          className={`${iconBase} ${isShuffle ? 'fill-ui-pink-100' : 'fill-ui-gray-100'}`}
        >
          <ShuffleSVG className="size-4" />
        </button>

        {/* Main controls */}
        <div className="flex items-center gap-4">
          {/* Prev */}
          <button
            onClick={() => skip(-10)}
            title="Rewind 10s"
            aria-label="Rewind 10 seconds"
            className={iconStatic}
          >
            <PrevSVG className="size-4" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            title="Play/Pause"
            aria-label="Play or Pause"
            className="size-6 fill-ui-gray-100 transition-colors duration-200 hover:brightness-125"
          >
            {isPlaying ? (
              <PauseSVG className="size-6" />
            ) : (
              <PlaySVG className="size-6" />
            )}
          </button>

          {/* Next */}
          <button
            onClick={() => skip(10)}
            title="Forward 10s"
            aria-label="Forward 10 seconds"
            className={iconStatic}
          >
            <NextSVG className="size-4" />
          </button>
        </div>

        {/* Repeat */}
        <button
          onClick={toggleRepeat}
          title="Enable Loop"
          aria-label="Enable Loop"
          className={`${iconBase} ${isRepeat ? 'fill-ui-pink-100' : 'fill-ui-gray-100'}`}
        >
          <RepeatSVG className="size-4" />
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
            [&::-webkit-slider-thumb]:bg-ui-pink-100
            [&::-webkit-slider-thumb]:mt-[-4px]
            focus:outline-none
          "
          style={{
            background: `linear-gradient(to right, #be5feb, #fb64b6, #ff6666 ${((currentTime / duration) * 100) || 0}%, #e5e7eb ${((currentTime / duration) * 100) || 0}%)`
          }}
        />

        <span className="h-full flex items-center text-sm">
          {formatTime(duration)}
        </span>
      </section>
    </div>
  )
}
