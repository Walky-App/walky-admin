import { format, formatDuration, isToday, isValid, differenceInDays, parseISO } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

/**
 * Checks if the provided string is a valid date.
 * @param {string} dateString - The string to check.
 * @returns {boolean} Returns true if the string is a valid date, false otherwise.
 * @example
 * // returns true
 * isValidDate('2022-12-31')
 * @example
 * // returns true
 * isValidDate('2022-12-31T13:00:00')
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString)
  return isValid(date)
}

/**
 * Formats a date string into a locale-specific date and time string.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date and time string.
 * @example
 * // returns "12/31/2022 12:00 AM"
 * formatToDateTime('2022-12-31')
 * @example
 * // returns "12/31/2022 01:00 PM"
 * formatToDateTime('2022-12-31T13:00:00')
 */
export const formatToDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return format(date, 'P hh:mm a')
}

/**
 * Formats a date string into a locale-specific date string.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string.
 * @example
 * // returns "12/31/2022"
 * formatToDate('2022-12-31')
 * @example
 * // returns "12/31/2022"
 * formatToDate('2022-12-31T13:00:00')
 */
export const formatToDate = (dateString: string): string => {
  const date = new Date(dateString)
  return format(date, 'P')
}

/**
 * Formats a date string into a locale-specific time string.
 * @param {string | number} dateString - The date string to format. It can be a string representation of a date or the number of milliseconds since the Unix Epoch.
 * @returns {string} The formatted time string.
 * @example
 * // returns "12:00 AM"
 * formatToTime('2022-12-31')
 * @example
 * // returns "01:00 PM"
 * formatToTime('2022-12-31T13:00:00')
 */
export const formatToTime = (dateString: string | number): string => {
  const date = new Date(dateString)
  return format(date, 'hh:mm a')
}

/**
 * Formats a date string into a time string in a specific timezone.
 * @param {string | number} dateString - The date string to format. It can be a string representation of a date or the number of milliseconds since the Unix Epoch.
 * @param {string} timeZone - The timezone to use for formatting.
 * @returns {string} The formatted time string.
 * @example
 * // returns "06:03 PM"
 * formatToTimeInTimeZone(1619817780000, 'America/Denver')
 * @example
 * // returns "07:00 AM"
 * formatToTimeInTimeZone('2022-12-31T13:00:00', 'America/Denver')
 */
export const formatToTimeInTimeZone = (dateString: string | number, timeZone: string): string => {
  const date = new Date(dateString)
  const zonedDate = toZonedTime(date, timeZone)
  return format(zonedDate, 'hh:mm a') // 'hh:mm a' is the format string for a 12-hour clock time with am/pm
}

/**
 * Formats a date string into a date and time string in a specific timezone.
 * @param {string | number} dateString - The date string to format. It can be a string representation of a date or the number of milliseconds since the Unix Epoch.
 * @param {string} timeZone - The timezone to use for formatting.
 * @returns {string} The formatted date and time string.
 * @example
 * // returns "04/30/2024 06:03 PM"
 * formatToDateTimeInTimeZone(1704060180000, 'America/Denver')
 * @example
 * // returns "12/31/2022 07:00 AM"
 * formatToDateTimeInTimeZone('2022-12-31T13:00:00', 'America/Denver')
 */
export const formatToDateTimeInTimeZone = (dateString: string | number, timeZone: string): string => {
  const date = new Date(dateString)
  const zonedDate = toZonedTime(date, timeZone)
  return format(zonedDate, 'P hh:mm a') // 'P hh:mm a' is the format string for a locale-specific date and a 12-hour clock time with am/pm
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
 * Checks if the provided timestamp is the same as today's date.
 * @param {string} [timeStamp] - The timestamp to check. It should be a string representation of a date in a format that can be parsed by the JavaScript Date constructor, such as ISO 8601 Extended Format ("YYYY-MM-DDTHH:mm:ss.sssZ").
 * @returns {boolean} Returns true if the date part of the timestamp is the same as today's date, false otherwise.
 */
export const isTodaySameAsTimeStamp = (timeStamp?: string): boolean => {
  if (timeStamp == null) {
    return false
  }
  const date = new Date(timeStamp)
  return isToday(date)
}

/**
 * Checks if a job is new based on the createdAt date.
 * @param {Date} createdAt - The createdAt date of the job.
 * @returns {boolean} Returns true if the job is new, false otherwise.
 */
export const isNew = (createdAt: Date): boolean => {
  return differenceInDays(new Date(), new Date(createdAt)) <= 3
}

export const formatToTimeUTC = (dateString: string): string => {
  const date = parseISO(dateString)
  const dateUTC = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }))
  return format(dateUTC, 'hh:mm a')
}
