export interface Ambassador {
  id: string;
  _id?: string; // MongoDB ObjectId
  name: string;
  email: string;
  phone?: string;
  student_id?: string;
  campus_id?: string;
  campus_name?: string;
  is_active: boolean;
  profile_image_url?: string;
  bio?: string;
  graduation_year?: number;
  major?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string; // MongoDB timestamp
  updatedAt?: string; // MongoDB timestamp
  created_by?: string;
  school_id?: string;
  __v?: number; // MongoDB version key
}

export interface AmbassadorFormData {
  name: string;
  email: string;
  phone?: string;
  student_id?: string;
  is_active: boolean;
  profile_image_url?: string;
  bio?: string;
  graduation_year?: number;
  major?: string;
}

export type CreateAmbassadorRequest = Omit<AmbassadorFormData, "id">;

export type UpdateAmbassadorRequest = Partial<AmbassadorFormData>;
