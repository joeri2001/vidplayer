import React, { useState } from 'react'

interface VideoControlsProps {
  isPaused: boolean
  isMuted: boolean
  isFullscreen: boolean
  volume: number
  progress: number
  duration: number
  isControlsVisible: boolean
  togglePlay: () => void
  toggleMute: () => void
  toggleFullscreen: () => void
  handleVolumeChange: (newVolume: number) => void
  handleProgressChange: (newProgress: number) => void
}

export default function VideoControls({
  isPaused,
  isMuted,
  isFullscreen,
  volume,
  progress,
  duration,
  isControlsVisible,
  togglePlay,
  toggleMute,
  toggleFullscreen,
  handleVolumeChange,
  handleProgressChange
}: VideoControlsProps) {
  const [hoverVolume, setHoverVolume] = useState<number | null>(null)
  const [hoverProgress, setHoverProgress] = useState<number | null>(null)
  const [isHoveringProgress, setIsHoveringProgress] = useState(false)

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const handleVolumeHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const newVolume = Math.round((x / rect.width) * 100)
    setHoverVolume(Math.max(0, Math.min(100, newVolume)))
  }

  const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const newProgress = (x / rect.width) * duration
    setHoverProgress(newProgress)
    setIsHoveringProgress(true)
  }

  const handleProgressLeave = () => {
    setHoverProgress(null)
    setIsHoveringProgress(false)
  }

  const handleVolumeDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const volumeBar = e.currentTarget;
    const updateVolume = (e: MouseEvent) => {
      const rect = volumeBar.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const newVolume = x / rect.width;
      handleVolumeChange(newVolume);
    };

    const stopDrag = () => {
      document.removeEventListener('mousemove', updateVolume);
      document.removeEventListener('mouseup', stopDrag);
    };

    updateVolume(e.nativeEvent);
    document.addEventListener('mousemove', updateVolume);
    document.addEventListener('mouseup', stopDrag);
  };

  return (
    <div className={`absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-75 transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div 
        className={`relative w-full h-1 bg-gray-600 cursor-pointer group transition-all duration-200 ${isHoveringProgress ? 'h-2' : ''}`}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const x = e.clientX - rect.left
          const newProgress = (x / rect.width) * 100
          handleProgressChange(newProgress)
        }}
        onMouseMove={handleProgressHover}
        onMouseLeave={handleProgressLeave}
      >
        <div
          className="absolute top-0 left-0 h-full bg-blue-500"
          style={{ width: `${progress}%` }}
        ></div>
        <div
          className="absolute top-0 left-0 h-full bg-blue-300 opacity-0 group-hover:opacity-50 transition-opacity"
          style={{ width: `${(hoverProgress !== null ? hoverProgress / duration : 0) * 100}%` }}
        ></div>
        {hoverProgress !== null && (
          <div className="absolute bottom-full left-0 bg-black text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs transform -translate-y-1" style={{ left: `${(hoverProgress / duration) * 100}%` }}>
            {formatTime(hoverProgress)}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between p-1">
        <div className="flex items-center space-x-1 sm:space-x-2 w-1/3">
          <button onClick={togglePlay} className="text-white p-1 hover:bg-gray-700 rounded">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isPaused ? (
                <polygon points="5 3 19 12 5 21 5 3" />
              ) : (
                <><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></>
              )}
            </svg>
          </button>
          <button onClick={toggleMute} className="text-white p-1 hover:bg-gray-700 rounded">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMuted ? (
                <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></>
              ) : (
                <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></>
              )}
            </svg>
          </button>
          <div 
            className="relative w-12 sm:w-16 h-1 bg-gray-600 cursor-pointer group" 
            onMouseDown={handleVolumeDrag}
            onMouseMove={handleVolumeHover}
            onMouseLeave={() => setHoverVolume(null)}
          >
            <div
              className="absolute top-0 left-0 h-full bg-blue-500"
              style={{ width: `${volume * 100}%` }}
            ></div>
            <div
              className="absolute top-0 left-0 h-full bg-blue-300 opacity-0 group-hover:opacity-50 transition-opacity"
              style={{ width: `${hoverVolume !== null ? hoverVolume : 0}%` }}
            ></div>
            {hoverVolume !== null && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs">
                {hoverVolume}%
              </div>
            )}
          </div>
        </div>
        <div className="text-white text-xs text-center w-1/3">
          {formatTime(duration * (progress / 100))} / {formatTime(duration)}
        </div>
        <div className="flex justify-end w-1/3">
          <button onClick={toggleFullscreen} className="text-white p-1 hover:bg-gray-700 rounded">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isFullscreen ? (
                <><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" /></>
              ) : (
                <><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></>
              )}
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}