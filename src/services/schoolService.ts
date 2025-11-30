import { apiClient } from "../API";

export interface School {
  id: string;
  _id?: string;
  school_name?: string;
  display_name?: string;
  email_domain?: string;
  is_active?: boolean;
}

export const schoolService = {
  getAll: async (): Promise<School[]> => {
    const response = await apiClient.api.schoolList() as any;
    // Backend may return an array or an object with data
    const payload = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data?.data)
        ? response.data.data
        : [];

    return payload.map((s: School) => ({
      ...s,
      id: s.id || s._id || "",
    }));
  },
};

export default schoolService;
