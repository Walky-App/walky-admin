/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable filename-rules/match */
export function secondsToTimeDescription(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours >= 1 && minutes % 60 === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`
  } else if (hours >= 1 && minutes % 60 !== 0) {
    const remainingMinutes = minutes % 60
    return `${hours}.${remainingMinutes} hours`
  } else {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`
  }
}

export function getModifiedProperties(oldObj: any, newObj: any): Partial<any> {
  const modifiedProperties: Partial<any> = {}
  for (const key of Object.keys(newObj)) {
    if (newObj[key] !== oldObj[key]) {
      modifiedProperties[key] = newObj[key]
    }
  }
  return modifiedProperties
}

export const createRandomId = () => {
  const date = new Date()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString().substr(2, 2)
  const uid = year + month + date.getMilliseconds()
  return Number(uid)
}
