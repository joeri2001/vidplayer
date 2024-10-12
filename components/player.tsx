'use client'

import React, { useState, useRef } from 'react'
import FileUpload from './playercomponents/file-upload'
import VideoPlayer from './playercomponents/video-player'
import SubtitleControls from './playercomponents/subtitle-controls'
import { parseSRT, Subtitle } from '../utils/utils'

export default function Player() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [subtitles, setSubtitles] = useState<Subtitle[]>([])
  const [subtitleOffset, setSubtitleOffset] = useState(0)
  const [videoFileName, setVideoFileName] = useState<string | null>(null)
  const [subtitleFileName, setSubtitleFileName] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  const handleVideoFile = (file: File) => {
    const url = URL.createObjectURL(file)
    setVideoSrc(url)
    setVideoFileName(file.name)
  }

  const handleSubtitleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const parsedSubtitles = parseSRT(content)
      setSubtitles(parsedSubtitles)
    }
    reader.readAsText(file)
    setSubtitleFileName(file.name)
  }

  const adjustSubtitles = (adjustment: number) => {
    setSubtitleOffset(prevOffset => {
      const newOffset = prevOffset + adjustment
      return Number(newOffset.toFixed(1))
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-2 sm:p-4 fullscreen-subtitle-container">
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-md p-2 sm:p-4">
        <FileUpload
          onVideoUpload={handleVideoFile}
          onSubtitleUpload={handleSubtitleFile}
          videoFileName={videoFileName}
          subtitleFileName={subtitleFileName}
        />
        <div className="relative w-full" ref={containerRef}>
          {videoSrc && (
            <VideoPlayer
              videoSrc={videoSrc}
              subtitles={subtitles}
              subtitleOffset={subtitleOffset}
              containerRef={containerRef}
            />
          )}
        </div>
        <SubtitleControls
          adjustSubtitles={adjustSubtitles}
          subtitleOffset={subtitleOffset}
        />
      </div>
    </div>
  )
}