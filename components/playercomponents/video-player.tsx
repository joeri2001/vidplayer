'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Subtitle } from '../../utils/utils'
import VideoControls from './video-controls'

interface VideoPlayerProps {
  videoSrc: string
  subtitles: Subtitle[]
  subtitleOffset: number
  containerRef: React.RefObject<HTMLDivElement>
}

export default function VideoPlayer({ videoSrc, subtitles, subtitleOffset, containerRef }: VideoPlayerProps) {
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null)
  const [isPaused, setIsPaused] = useState(true)
  const [isHoverPaused, setIsHoverPaused] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isControlsVisible] = useState(true)

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime - subtitleOffset
      const currentSub = subtitles.find(
        (sub) => currentTime >= sub.startTime && currentTime <= sub.endTime
      )
      setCurrentSubtitle(currentSub || null)
      setProgress((video.currentTime / video.duration) * 100)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('pause', () => setIsPaused(true))
    video.addEventListener('play', () => setIsPaused(false))

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('pause', () => setIsPaused(true))
      video.removeEventListener('play', () => setIsPaused(false))
    }
  }, [subtitles, subtitleOffset])

  const handleSubtitleHover = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (videoRef.current && !isPaused) {
      videoRef.current.pause()
      setIsHoverPaused(true)
      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'
    }
  }

  const handleSubtitleLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (videoRef.current && isHoverPaused) {
      videoRef.current.play()
      setIsHoverPaused(false)
      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.75)'
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      setIsMuted(!isMuted)
      videoRef.current.muted = !isMuted
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleProgressChange = (newProgress: number) => {
    const video = videoRef.current
    if (video) {
      const time = (newProgress / 100) * video.duration
      video.currentTime = time
    }
  }

  return (
    <>
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full rounded-lg cursor-pointer"
        onClick={togglePlay}
      >
        Your browser does not support the video tag.
      </video>
      <div
        className="absolute left-0 right-0 bottom-0 flex justify-center items-end pointer-events-none"
      >
        {currentSubtitle && (
          <span
            className="inline-block bg-black bg-opacity-75 text-white px-2 sm:px-4 py-1 sm:py-2 rounded cursor-pointer select-text pointer-events-auto transition-all duration-300 ease-in-out text-xs sm:text-base fullscreen-subtitle-container:text-xl sm:fullscreen-subtitle-container:text-2xl mb-12 sm:mb-16"
            onMouseEnter={handleSubtitleHover}
            onMouseLeave={handleSubtitleLeave}
          >
            {currentSubtitle.text}
          </span>
        )}
      </div>
      <VideoControls
        isPaused={isPaused}
        isMuted={isMuted}
        isFullscreen={isFullscreen}
        volume={volume}
        progress={progress}
        duration={duration}
        isControlsVisible={isControlsVisible}
        togglePlay={togglePlay}
        toggleMute={toggleMute}
        toggleFullscreen={toggleFullscreen}
        handleVolumeChange={handleVolumeChange}
        handleProgressChange={handleProgressChange}
      />
    </>
  )
}