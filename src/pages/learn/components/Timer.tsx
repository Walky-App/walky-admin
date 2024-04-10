import { useMemo, useState } from 'react'

import { useInterval } from 'primereact/hooks'

import { useLearn } from '../../../store/useLearn'

export const Timer = ({ initialSeconds }: { initialSeconds: number }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds)
  const { setExpireTime } = useLearn()

  const handleTimer = () => {
    if (secondsLeft > 0) {
      setSecondsLeft(prevSeconds => prevSeconds - 1)
    }
    if (secondsLeft === 0) {
      setExpireTime(true)
    }
  }

  useMemo(() => {
    setSecondsLeft(initialSeconds)
  }, [initialSeconds])

  useInterval(handleTimer, 1000)

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex justify-end">
      {initialSeconds > 0 ? <h1 className="font-bold">{formatTime(secondsLeft)}</h1> : null}
    </div>
  )
}
