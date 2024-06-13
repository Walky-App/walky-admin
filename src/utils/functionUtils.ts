/* eslint-disable @typescript-eslint/no-explicit-any */
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
