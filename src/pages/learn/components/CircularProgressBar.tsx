import { useEffect } from 'react'

interface ProgressData {
  progressData: {
    total: number
    complete: number
  }
}

// #TODO changed to primereact progressbar
export const CircularProgressBar = ({ progressData }: ProgressData) => {
  const percent = Math.floor((progressData.complete / progressData.total) * 100)

  const circumference = 2 * (22 / 7) * 30
  const offset = circumference - (percent / 100) * circumference

  useEffect(() => {
    const svgText = document.getElementById('svgText') as unknown as SVGTextElement
    const textBounding = svgText?.getBBox()
    const textWidth = textBounding?.width || 0

    const adjustedOffset = offset + (circumference - textWidth) / 2
    if (svgText) {
      svgText.style.strokeDashoffset = `${adjustedOffset}px`
    }
  }, [percent, offset, circumference])

  return (
    <svg className="h-full w-24 transform">
      <circle
        className="text-gray-300"
        cx="48"
        cy="48"
        fill="transparent"
        r="30"
        stroke="currentColor"
        strokeWidth="5"
      />
      <circle
        className="text-green-600"
        cx="48"
        cy="48"
        fill="transparent"
        r="30"
        stroke="currentColor"
        strokeDasharray={`${circumference}`}
        strokeDashoffset={`${offset}px`}
        strokeWidth="5"
        transform="rotate(-90 48 48)"
      />
      <text fill="black" id="svgText" textAnchor="middle" x="48" y="52">
        {`${progressData.complete} / ${progressData.total}`}
      </text>
    </svg>
  )
}
