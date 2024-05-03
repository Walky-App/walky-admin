/**
 * Converts military time to standard time.
 * @param {number} militaryTime - The military time to convert.
 * @returns {string} The standard time.
 * @throws {Error} If the input is not a valid military time.
 * @example
 * // returns "1:00 pm"
 * convertMilitaryTimeToStandardTime(1300)
 */
export function convertMilitaryTimeToStandardTime(militaryTime: number): string {
  if (militaryTime < 0 || militaryTime > 2359 || militaryTime % 100 > 59) {
    throw new Error('Invalid military time')
  }

  const hours = Math.floor(militaryTime / 100)
  const minutes = militaryTime % 100
  const standardHours = hours % 12 || 12
  const amPm = hours >= 12 ? 'pm' : 'am'

  return `${standardHours}:${minutes < 10 ? '0' : ''}${minutes} ${amPm}`
}

/**
 * Checks if the provided string is a valid date.
 * @param {string} dateString - The string to check.
 * @returns {boolean} Returns true if the string is a valid date, false otherwise.
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

/**
 * Formats a date string into a locale-specific date string.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string.
 */
export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

/**
 * Formats a timestamp into a locale-specific time string.
 * @param {string | number} timeStamp - The timestamp to format. It can be a string representation of a date or the number of milliseconds since the Unix Epoch.
 * @returns {string} The formatted time string.
 */
export const formatTime = (timeStamp: string | number) => {
  const date = new Date(timeStamp)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

/**
 * Converts a number of milliseconds into a readable time string.
 * @param {number} milliseconds - The number of milliseconds to convert.
 * @returns {string} The readable time string.
 */
export const convertMillisecondsToReadableTime = (milliseconds: number): string => {
  const hours = Math.floor(milliseconds / 3600000)
  const minutes = Math.floor((milliseconds % 3600000) / 60000)
  return `${hours}h ${minutes}m`
}

/**
 * Checks if the provided timestamp is the same as today's date.
 * @param {string} [timeStamp] - The timestamp to check. It should be a string representation of a date in a format that can be parsed by the JavaScript Date constructor, such as ISO 8601 Extended Format ("YYYY-MM-DDTHH:mm:ss.sssZ").
 * @returns {boolean} Returns true if the date part of the timestamp is the same as today's date, false otherwise.
 */
export const isTodaysDateSameAsTimeStamp = (timeStamp?: string) => {
  if (timeStamp == null) {
    return false
  }
  const date = new Date(timeStamp)
  const todaysDate = new Date()
  return date.getDate() === todaysDate.getDate()
}
