import { apiClient } from "../API";

export interface School {
  id: string;
  _id?: string;
  name?: string;
  school_name?: string;
  display_name?: string;
  email_domain?: string;
  logo_url?: string;
  is_active?: boolean;
  admins?: string[];
}

export const schoolService = {
  getAll: async (): Promise<School[]> => {
    const response = await apiClient.api.schoolList();
    const payload = response.data || [];

    return payload.map((s) => ({
      ...s,
      id: s._id || "",
    }));
  },
};

export default schoolService;
