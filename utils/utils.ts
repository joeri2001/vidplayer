export interface Subtitle {
    startTime: number
    endTime: number
    text: string
  }
  
  export const parseSRT = (srtContent: string): Subtitle[] => {
    const subtitleBlocks = srtContent.trim().split(/\r?\n\r?\n/)
    return subtitleBlocks.map((block) => {
      const lines = block.split(/\r?\n/)
      if (lines.length < 3) return null
  
      const timeString = lines[1]
      const textLines = lines.slice(2)
  
      const [start, end] = timeString.split(' --> ').map(timeToSeconds)
      return {
        startTime: start,
        endTime: end,
        text: textLines.join(' ')
      }
    }).filter((subtitle): subtitle is Subtitle => subtitle !== null)
  }
  
  const timeToSeconds = (timeString: string): number => {
    const [hours, minutes, secondsAndMs] = timeString.split(':')
    const [seconds, ms] = secondsAndMs.split(',')
    return (
      parseInt(hours) * 3600 +
      parseInt(minutes) * 60 +
      parseInt(seconds) +
      parseInt(ms) / 1000
    )
  }