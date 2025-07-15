import { Role } from "../types/Role";

export const getCurrentUserRole = (): Role => {
  // This function should return the current user's role
  // You can implement this based on your authentication system
  // For now, returning a default value
  const userRole = localStorage.getItem("userRole");
  return (userRole as Role) || Role.STUDENT;
};

export const isAdmin = (): boolean => {
  return getCurrentUserRole() === Role.ADMIN;
};

export const isFaculty = (): boolean => {
  return getCurrentUserRole() === Role.FACULTY;
};

export const isStudent = (): boolean => {
  return getCurrentUserRole() === Role.STUDENT;
};
