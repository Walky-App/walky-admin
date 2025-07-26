export interface Interest {
  _id: string;
  name: string;
  image_url: string;
  icon_url?: string;
  created_by: string;
  is_active: boolean;
  is_delete: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CreateInterestDto {
  name: string;
  image_url: string;
  created_by?: string;
  is_active?: boolean;
}

export interface UpdateInterestDto {
  name?: string;
  image_url?: string;
  icon_url?: string;
  is_active?: boolean;
  is_delete?: boolean;
}