import React from 'react'

interface SubtitleControlsProps {
  adjustSubtitles: (adjustment: number) => void
  subtitleOffset: number
}

export default function SubtitleControls({ adjustSubtitles, subtitleOffset }: SubtitleControlsProps) {
  return (
    <>
      <div className="mt-2 flex justify-center space-x-1 sm:space-x-2">
      <button
          onClick={() => adjustSubtitles(-5)}
          className="px-1 sm:px-2 py-0.5 sm:py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-xs"
        >
          -5s
        </button>
        <button
          onClick={() => adjustSubtitles(-1)}
          className="px-1 sm:px-2 py-0.5 sm:py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-xs"
        >
          -1s
        </button>
        <button
          onClick={() => adjustSubtitles(-0.5)}
          className="px-1 sm:px-2 py-0.5 sm:py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-xs"
        >
          -0.5s
        </button>
        <button
          onClick={() => adjustSubtitles(-0.1)}
          className="px-1 sm:px-2 py-0.5 sm:py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-xs"
        >
          -0.1s
        </button>
        <button
          onClick={() => adjustSubtitles(0.1)}
          className="px-1 sm:px-2 py-0.5 sm:py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-xs"
        >
          +0.1s
        </button>
        <button
          onClick={() => adjustSubtitles(0.5)}
          className="px-1 sm:px-2 py-0.5 sm:py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-xs"
        >
          +0.5s
        </button>
        <button
          onClick={() => adjustSubtitles(1)}
          className="px-1 sm:px-2 py-0.5 sm:py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-xs"
        >
          +1s
        </button>
        <button
          onClick={() => adjustSubtitles(5)}
          className="px-1 sm:px-2 py-0.5 sm:py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-xs"
        >
          +5s
        </button>
      </div>
      <div className="mt-1 text-center text-xs text-gray-400">
        Subtitle Offset: {subtitleOffset.toFixed(1)}s
      </div>
    </>
  )
}