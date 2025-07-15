import API from "../API";
import { School } from "../types/school";

interface SchoolsResponse {
  schools: School[];
  total: number;
}

class SchoolService {
  // Note: baseUrl will be used when actual API endpoints are available
  // private baseUrl = "/api";

  async getAllSchools(): Promise<School[]> {
    try {
      const response = await API.get("/school");
      // The API returns the schools array directly, not wrapped in an object
      return Array.isArray(response.data)
        ? response.data
        : response.data.schools || [];
    } catch (error) {
      console.error("Error fetching schools:", error);
      throw new Error("Failed to fetch schools. Please try again later.");
    }
  }

  async getSchoolById(schoolId: string): Promise<School> {
    try {
      const response = await API.get(`/school/${schoolId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching school:", error);
      throw error;
    }
  }

  getSelectedSchool(): string | null {
    return localStorage.getItem("selectedSchool");
  }

  getSelectedSchoolName(): string | null {
    return localStorage.getItem("selectedSchoolName");
  }

  setSelectedSchool(schoolId: string, schoolName: string): void {
    localStorage.setItem("selectedSchool", schoolId);
    localStorage.setItem("selectedSchoolName", schoolName);
  }

  clearSelectedSchool(): void {
    localStorage.removeItem("selectedSchool");
    localStorage.removeItem("selectedSchoolName");
  }
}

export const schoolService = new SchoolService();
export type { SchoolsResponse };
