/**
 * Extracts the first name from a full name
 * @param fullName - The full name string
 * @returns The first name only
 */
export const getFirstName = (fullName: string): string => {
  if (!fullName) return "";
  return fullName.split(" ")[0];
};
