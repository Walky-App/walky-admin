/**
 * Converts military time to standard time.
 * @param militaryTime The military time to convert.
 * @returns The standard time.
 * @throws {Error} If the input is not a valid military time.
 * @example
 * // returns "1:00 pm"
 * convertToStandardTime(1300)
 */
export function convertToStandardTime(militaryTime: number): string {
  if (militaryTime < 0 || militaryTime > 2359 || militaryTime % 100 > 59) {
    throw new Error('Invalid military time')
  }
  const militaryTimeString = militaryTime.toString().padStart(4, '0')
  const hours = Number(militaryTimeString.slice(0, -2))
  const minutes = Number(militaryTimeString.slice(-2))
  const standardHours = ((hours + 11) % 12) + 1
  const amPm = hours >= 12 ? 'pm' : 'am'
  return `${standardHours}:${minutes < 10 ? '0' : ''}${minutes} ${amPm}`
}
