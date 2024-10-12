import React, { useState } from 'react'

interface FileUploadProps {
  onVideoUpload: (file: File) => void
  onSubtitleUpload: (file: File) => void
  videoFileName: string | null
  subtitleFileName: string | null
}

export default function FileUpload({ onVideoUpload, onSubtitleUpload, videoFileName, subtitleFileName }: FileUploadProps) {
  const [isDraggingVideo, setIsDraggingVideo] = useState(false)
  const [isDraggingSubtitle, setIsDraggingSubtitle] = useState(false)

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDragEnter = (event: React.DragEvent<HTMLElement>, type: 'video' | 'subtitle') => {
    event.preventDefault()
    event.stopPropagation()
    if (type === 'video') {
      setIsDraggingVideo(true)
    } else {
      setIsDraggingSubtitle(true)
    }
  }

  const handleDragLeave = (event: React.DragEvent<HTMLElement>, type: 'video' | 'subtitle') => {
    event.preventDefault()
    event.stopPropagation()
    if (type === 'video') {
      setIsDraggingVideo(false)
    } else {
      setIsDraggingSubtitle(false)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLElement>, type: 'video' | 'subtitle') => {
    event.preventDefault()
    event.stopPropagation()
    setIsDraggingVideo(false)
    setIsDraggingSubtitle(false)
    
    const files = Array.from(event.dataTransfer.files)
    if (files.length > 0) {
      if (type === 'video') {
        onVideoUpload(files[0])
      } else {
        onSubtitleUpload(files[0])
      }
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'subtitle') => {
    const file = event.target.files?.[0]
    if (file) {
      if (type === 'video') {
        onVideoUpload(file)
      } else {
        onSubtitleUpload(file)
      }
    }
  }

  return (
    <div className="mb-2 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 select-none">
      <label
        className={`flex-1 border-2 border-dashed rounded-lg p-2 text-center cursor-pointer ${
          isDraggingVideo ? 'border-blue-500 bg-blue-900 bg-opacity-50' : 'border-gray-600 hover:border-blue-500 hover:bg-blue-900 hover:bg-opacity-20'
        }`}
        onDragOver={handleDragOver}
        onDragEnter={(e) => handleDragEnter(e, 'video')}
        onDragLeave={(e) => handleDragLeave(e, 'video')}
        onDrop={(e) => handleDrop(e, 'video')}
      >
        <span className="text-blue-400 text-xs sm:text-sm">
          {videoFileName || "Select or Drop Video File"}
        </span>
        <input type="file" accept="video/*, .mkv" onChange={(e) => handleFileSelect(e, 'video')} className="hidden" />
      </label>
      <label
        className={`flex-1 border-2 border-dashed rounded-lg p-2 text-center cursor-pointer ${
          isDraggingSubtitle ? 'border-green-500 bg-green-900 bg-opacity-50' : 'border-gray-600 hover:border-green-500 hover:bg-green-900 hover:bg-opacity-20'
        }`}
        onDragOver={handleDragOver}
        onDragEnter={(e) => handleDragEnter(e, 'subtitle')}
        onDragLeave={(e) => handleDragLeave(e, 'subtitle')}
        onDrop={(e) => handleDrop(e, 'subtitle')}
      >
        <span className="text-green-400 text-xs sm:text-sm">
          {subtitleFileName || "Select or Drop Subtitle File"}
        </span>
        <input type="file" accept=".srt" onChange={(e) => handleFileSelect(e, 'subtitle')} className="hidden" />
      </label>
    </div>
  )
}