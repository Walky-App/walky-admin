import { format, formatDuration, isToday, isValid } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

/**
 * Converts military time to standard time.
 * @param {number} militaryTime - The military time to convert.
 * @returns {string} The standard time.
 * @throws {Error} If the input is not a valid military time.
 * @example
 * // returns "1:00 PM"
 * convertMilitaryTimeToStandardTime(1300)
 */
export function convertMilitaryTimeToStandardTime(militaryTime: number): string {
  if (militaryTime < 0 || militaryTime > 2359 || militaryTime % 100 > 59) {
    throw new Error('Invalid military time')
  }

  const hours = Math.floor(militaryTime / 100)
  const minutes = militaryTime % 100
  const date = new Date()
  date.setHours(hours)
  date.setMinutes(minutes)

  return format(date, 'h:mm aa')
}

/**
 * Checks if the provided string is a valid date.
 * @param {string} dateString - The string to check.
 * @returns {boolean} Returns true if the string is a valid date, false otherwise.
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString)
  return isValid(date)
}

/**
 * Formats a date string into a locale-specific date string.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string.
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return format(date, 'P') // 'P' is the format string for a locale-specific date
}

/**
 * Formats a timestamp into a locale-specific time string.
 * @param {string | number} timeStamp - The timestamp to format. It can be a string representation of a date or the number of milliseconds since the Unix Epoch.
 * @returns {string} The formatted time string.
 */
export const formatTime = (timeStamp: string | number): string => {
  const date = new Date(timeStamp)
  return format(date, 'hh:mm a') // 'hh:mm a' is the format string for a 12-hour clock time with am/pm
}

/**
 * Converts a number of milliseconds into a readable time string.
 * @param {number} milliseconds - The number of milliseconds to convert.
 * @returns {string} The readable time string.
 */
export const convertMillisecondsToReadableTime = (milliseconds: number): string => {
  const duration = {
    hours: Math.floor(milliseconds / 3600000),
    minutes: Math.floor((milliseconds % 3600000) / 60000),
  }
  return formatDuration(duration)
}

/**
 * Checks if the provided timestamp is the same as today's date.
 * @param {string} [timeStamp] - The timestamp to check. It should be a string representation of a date in a format that can be parsed by the JavaScript Date constructor, such as ISO 8601 Extended Format ("YYYY-MM-DDTHH:mm:ss.sssZ").
 * @returns {boolean} Returns true if the date part of the timestamp is the same as today's date, false otherwise.
 */
export const isTodaysDateSameAsTimeStamp = (timeStamp?: string): boolean => {
  if (timeStamp == null) {
    return false
  }
  const date = new Date(timeStamp)
  return isToday(date)
}

/**
 * Formats a timestamp into a time string in a specific timezone.
 * @param {string | number} timeStamp - The timestamp to format. It can be a string representation of a date or the number of milliseconds since the Unix Epoch.
 * @param {string} timeZone - The timezone to use for formatting.
 * @returns {string} The formatted time string.
 * @example
 * // returns "06:03 PM"
 * formatTimeInTimeZone(1619817780000, 'America/Denver')
 */
export const formatTimeInTimeZone = (timeStamp: string | number, timeZone: string): string => {
  const date = new Date(timeStamp)
  const zonedDate = toZonedTime(date, timeZone)
  return format(zonedDate, 'hh:mm a') // 'hh:mm a' is the format string for a 12-hour clock time with am/pm
}

/**
 * Formats a timestamp into a date and time string in a specific timezone.
 * @param {string | number} timeStamp - The timestamp to format. It can be a string representation of a date or the number of milliseconds since the Unix Epoch.
 * @param {string} timeZone - The timezone to use for formatting.
 * @returns {string} The formatted date and time string.
 * @example
 * // returns "04/30/2024 06:03 PM"
 * formatDateTimeInTimeZone(1704060180000, 'America/Denver')
 */
export const formatDateTimeInTimeZone = (timeStamp: string | number, timeZone: string): string => {
  const date = new Date(timeStamp)
  const zonedDate = toZonedTime(date, timeZone)
  return format(zonedDate, 'P hh:mm a') // 'P hh:mm a' is the format string for a locale-specific date and a 12-hour clock time with am/pm
}
